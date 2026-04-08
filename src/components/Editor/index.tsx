import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import { Button, Input, message } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { conditionAndFuncLists, conditionAndFuncListsOrg, conditionAndFuncListsPerson, operatorLists } from './datas';
import { DefineVarList } from './DefineVarList';
import { EditBox } from './EditBox';
import { ExampleBox } from './ExampleBox';
import './index.less';
import { ItemList } from './ItemList';
import { EXamineScript, pagePost } from './service';
import { Title } from './Title';
import type { ConditionAndFuncType, OperatorType, SystemIndicatorListType } from './type';
import {
  createExpressionHandle,
  createTextNodeHandle,
  getLastRangeHandle,
  makeEditorElement,
  setEditorContent,
  setExampleContent,
} from './utils';
import { VarList } from './VarList';
import { postlist, tag } from './post'

const { Search } = Input;
const tagList = tag.map((item:any) => ({ text: item?.name, code: item.code }))
//    {
//             text: item.name,
//             code: item.code,
// })

/**
 * 上级页面组件传入属性
 */
type IProps = {
  formTitle: string;
  getSystemIndicatorItemType: () => any;
  getSystemIndicatorItem: (params: any) => any;
  /** 酬金项接口 */
  getRemunerationItemList?: (params: any) => any;
  /** 是否展示酬金项 */
  isShowRemuneration?: boolean;
  /** 酬金编码 */
  salaryManageCode?: string;
  departments?: any
  /* 额外的参数 */ 
  extraParams?: any | undefined; 
  /* 分类-组织效能使用 */
  type?: string | undefined; 
};

export const Editor = forwardRef((props: IProps, ref) => {
  const {
    formTitle,
    departments,
    isShowRemuneration,
    getSystemIndicatorItemType,
    getSystemIndicatorItem,
    getRemunerationItemList,
    salaryManageCode,
    extraParams,
    type,
  } = props;
  const varListRef = useRef(null);
  const defineVarListRef = useRef(null);
  // 二级分类列表
  const [SystemIndicatorList, setSystemIndicatorList] = useState<SystemIndicatorListType[]>();
  const [lastRange, setLastRange] = useState<Range>();
  const [showIput, setShowIput] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<any>(); // 当前选择的一级分类
  const [selectValue2, setSelectValue2] = useState(""); // 当前选择的三级分类
  const [selectValue3, setSelectValue3] = useState(""); // 当前选择的三级分类 - 岗位

  // 酬金项列表
  const [remunerationItemList, setRemunerationItemList] = useState([]);

  // personnel
  const ifList = 
    type === 'organization'  ?  conditionAndFuncLists.concat(conditionAndFuncListsOrg) :
    type === 'personnel' ? conditionAndFuncLists.concat(conditionAndFuncListsPerson) : conditionAndFuncLists


  /** 指标规则 */
  let indicatorRule = {
    transitionIndicatorCode: '',
    transitionScriptDesc: document.getElementById('smart-home-edit-box')?.innerHTML,
    transitionScript: '',
  };

  /** 验证填写指标规则公式内容 */
  const checkEditorContent = async (e:any) => {
    const editBox = document.getElementById('smart-home-edit-box') as HTMLDivElement;
    if (!editBox) return;
    const content = editBox.innerHTML;
    const result = content.replace(/<span.*?(data-editor-id="(.+?)"|data-editor-code="(.+?)").*?span>/g, '$2$3');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = result.replace(/<br\s*\/?>/gi, '').replace(/&nbsp;/gi, ' ');
    const decodedContent = tempDiv.innerText;

    
    // 选择所有span元素
    const spans = editBox.querySelectorAll('span');
    // 创建一个Set来存储data-editor-id的值，自动去重
    const editorIdsSet = new Set();

    // 遍历span元素
    spans.forEach(function(span) {
      // 获取data-editor-id属性的值
      const editorId = span.getAttribute('data-editor-id');
      if(editorId){
        // 将值添加到Set中
        editorIdsSet.add(editorId);
      }
    });

    // 将Set转换为数组
    const uniqueEditorIds = Array.from(editorIdsSet);
    
    let transitionIndicatorCode = ''
    // eslint-disable-next-line array-callback-return
    uniqueEditorIds.map((item:any,index:any)=>{
      if(index+1 === uniqueEditorIds.length){
        transitionIndicatorCode = transitionIndicatorCode+item
      }else{
        transitionIndicatorCode = transitionIndicatorCode+item+','
      }
    })
    const res = await EXamineScript({ transitionScript: decodedContent });
    if (res.success && res.data.success) {
      message.success('指标规则验证成功');
      
      indicatorRule.transitionScript = decodedContent;
      indicatorRule.transitionIndicatorCode = transitionIndicatorCode
      indicatorRule.transitionScriptDesc = document.getElementById('smart-home-edit-box')?.innerHTML
      return;
    }
    if(e !== 'no'){
      if (res.success && !res.data.success) {
        message.warning(res.data.message);
        return;
      }
      if (!res.success) {
        message.error(res.data.errorMessage);
        return;
      }
    }
    return;
  };

  const reset = () => {
    setSystemIndicatorList(SystemIndicatorList);
    (varListRef.current as any)?.reset();
    (defineVarListRef.current as any)?.reset();
  };

  /**
   * 查询二级分类
   * @param name 二级分类名称
   */
  const getSecondLevelType = async (name?: string) => {
    const params: { secondLevel: number; name?: string; indicatorType: string; postCode:string } = {
      secondLevel: selectValue,
      indicatorType: selectValue2,
      postCode: selectValue3,
    };
    if (name) {
      params.name = name;
    }
    const res = await getSystemIndicatorItem({...params, ...extraParams});
    if (res.success && res.data) {
      
      setSystemIndicatorList(
        tag.map((item: any) => {
          return {
            text: item.name,
            code: item.code,
          };
        }),
      );
      message.success('查询成功');
    }
  };

  /** 指标项搜索 */
  const onSearchHandle = async (value: string) => {
    if (!value) {
      // 输入框没有值的时候，通过一级分类去查询全部
      getSecondLevelType();
    }
    if (!value.trim()) {
      return;
    }
    getSecondLevelType(value);
  };

  /**
   * 条件与函数点击事件
   */
  const conditionClickHandle = (item: ConditionAndFuncType) => {
    setExampleContent(item.content);
    if (formTitle === '详情') return;
    if (!lastRange) return;
    const range = lastRange.cloneRange();
    range.deleteContents();

    const expressions: Record<number, string | string[]> = {
      1: [`if () {`, `} else {`, `}`],
      2: [`if () {`, `}`],
      3: '&&',
      4: '||',
      5: '!',
      6: '==',
      7: '!=',
      8: 'avgByOrg(param1, param2);',
      9: 'nearYearLowEffect(param1, param2, param3);',
      10: 'orgAvg(param1);',
      11: 'orgCount(param1, param2)',
      12: 'orgLineInnerDiff(param1, param2, param3)',
      13: 'lineInnerDiff(param1, param2, param3, param4)',
    };

    const expression = expressions[item.value];
    if (expression) {
      setLastRange(getLastRangeHandle(createExpressionHandle(expression, range)));
    }
  };

  /**
   * 运算符点击
   */
  const operatorClickHandle = (item: OperatorType) => {
    setExampleContent('');
    if (formTitle === '详情') return;
    if (!lastRange) return;
    const range = lastRange.cloneRange();
    range.deleteContents();
    const el = createTextNodeHandle(item.text);
    range.insertNode(el);
    range.setStartAfter(el);

    setLastRange(getLastRangeHandle(range));
  };

  /**
   * 查询指标项：初始化默认查询id为1的数据 一级
   * @param value
   */
  const getIndicatorListHandle = async (id: any) => {
    setSelectValue(id);
    let params = { 
      secondLevel: id,
      indicatorType: selectValue2,
      postCode: selectValue3,
    }
    if(extraParams){
      params = { ...params, ...extraParams }
    }
    const res = await getSystemIndicatorItem(params);
    if (res?.success) {
      setSystemIndicatorList(
         tag.map((item: any) => {
          return {
            code: item.code,
            text: item.name,
          };
        }),
      );
    }
  };


  // 获取二级
  const getSecondValue = async (val: string) =>{
    setSelectValue2(val);
    let params = { 
      secondLevel: selectValue, 
      indicatorType: val,
      postCode: selectValue3,
    }
    if(extraParams){
      params = { ...params, ...extraParams }
    }
    const res = await getSystemIndicatorItem(params);
    if (res.success) {
      setSystemIndicatorList(
        tag.map((item: any) => {
          return {
            code: item.code,
            text: item.name,
          };
        }),
      );
    }
  }

// 获取岗位分类 三级
  const getPostCodeValue = async (val: string) =>{
    setSelectValue3(val);
    let params = { 
      secondLevel: selectValue, 
      indicatorType: selectValue2,
      postCode: val,
    }
    if(extraParams){
      params = { ...params, ...extraParams }
    }
    const res = await getSystemIndicatorItem(params);
    if (res.success) {
      setSystemIndicatorList(
        tag.map((item: any) => {
          return {
            code: item.code,
            text: item.name,
          };
        }),
      );
    }
  }


  const getRemunerationListHandle = async (name?: string) => {
    const params: any = { salaryManageCode };
    if (name) {
      params.name = name;
    }
    const res = await getRemunerationItemList!(params);
    if (res.success) {
      
      setRemunerationItemList(res.data);
    }
  };

  useImperativeHandle(ref, () => ({
    indicatorRule: indicatorRule,
    checkEditorContent: checkEditorContent,
    setEditorContent: setEditorContent,
    dafaultSystemIndicatorList: SystemIndicatorList,
    selectValue: selectValue,
    indicatorListHandle: getIndicatorListHandle,
    reset: reset,
  }));

  
  useEffect(() => {
    getIndicatorListHandle('');
    if (isShowRemuneration && (formTitle === '编辑酬金'||formTitle === '新增酬金项')) {
      getRemunerationListHandle();
    }
  }, []);

  /**
   * 查询岗位分类
   * 
   * */ 

  const getPost = async () => {
    // const params = {
    //   current: 1,
    //   pageSize: 999
    // }
    // const res = await pagePost(params);
    // if (res.success) {
    //   const data:any = res.data?.filter((item:any) => item?.mark === 1)
    //   const result = data.map((item:any) => {
    //     return {
    //       label: item.postName,
    //       value: item.postCode
    //     }
    //   })

    //   return result
    // }
      const result = postlist.map((item:any) => {
        return {
          label: item.postName,
          value: item.postCode
        }
      })
      return result
  }

  /**
   * 查询一级分类
   * @returns 一级分类列表
   */
  const getFirstLevelType = async () => {
    // const res = await getSystemIndicatorItemType();
    // if (res.success) {
    //   const result = res.data;
    //   return result.map((item: any) => {
    //     return {
    //       label: item.name,
    //       value: item.id,
    //     };
    //   });
    // }
    return [
      { label: '营销类', value: 'all' },
      { label: '装维类', value: 'open' },
      { label: '发展类', value: 'closed' },
      { label: '客经类', value: 'processing' },
    ];
  };

  const getSecond =  async () => {
//  const res = await getSystemIndicatorItemType();
//     if (res.success) {
//       console.log();
//     }
    // 后续通过接口返回
    return [
      { label: '效能类', value: 'effect' },
      { label: '效能等级类', value: 'effect_grade' },
      { label: '组织效能类', value: 'org_effect' },
      { label: '组织效能等级类', value: 'org_effect_grade' },
      { label: '通用', value: 'generic' },
      { label: 'kpi得分类', value: 'kpi' },
      { label: '酬金单价类', value: 'salary_price' },
      { label: '服务积分类', value: 'score' },
    ];
  }

  return (
    <div className="container">
      <main>
        <div className="left">
          <div className="block">
            <Title text="指标规则" />
            <p>公式内容</p>
            <EditBox
              formTitle={formTitle}
              updateLastRange={(range) => {
                setLastRange(range);
              }}
            />
            <Button type="primary" onClick={checkEditorContent}>
              公式确认
            </Button>
          </div>
          <div className="block" style={{ paddingTop: '31px' }}>
            <Title text="样例" />
            <ExampleBox />
          </div>
        </div>

        {
          formTitle !== '详情'?<div className="right">
          {/* 酬金项 */}
          {isShowRemuneration && (
            <div className="block">
              <Title text="酬金项" />
              <Search
                placeholder="请输入酬金项名称"
                onSearch={(name) => getRemunerationListHandle(name)}
                enterButton="搜索"
                allowClear
              />
              <ItemList
                list={remunerationItemList?.map((item: any) => {
                  return {
                    text: item.name,
                    onClick: () => {
                      setExampleContent('');
                      if (formTitle === '详情') return;
                      if (!lastRange) return;
                      const el = makeEditorElement({ text: item.name,code: item.code });
                      const range = lastRange.cloneRange();
                      range.deleteContents();
                      range.insertNode(el);
                      range.setStartAfter(el);
                      setLastRange(getLastRangeHandle(range));
                    },
                  };
                })}
              />
            </div>
          )}

          <div className="block">
            <Title text="指标项" />
            <div style={{ display: 'flex', gap: '5px', height: '35px' }}>
              <ProFormSelect
                style={{ width: 100, margin: 0 }}
                fieldProps={{
                  onChange: async (value) => {
                    getIndicatorListHandle(value);
                  },
                }}
                request={getFirstLevelType}
              />
              <ProFormSelect
                style={{ width: 100, margin: 0 }}
                fieldProps={{
                  onChange: async (value) => {
                    getSecondValue(value);
                  },
                }}
                request={getSecond}
              />
              <ProFormSelect
                style={{ width: 100, margin: 0 }}
                fieldProps={{
                  onChange: async (value) => {
                    getPostCodeValue(value);
                  },
                }}
                request={getPost}
              />
              <Search
                placeholder="请输入指标名称或指标编码"
                onSearch={onSearchHandle}
                enterButton="搜索"
                allowClear
              />
            </div>

            <ItemList
              list={tagList?.map((item:any) => {
                return {
                  text: item.text,
                  onClick: () => {
                    setExampleContent('');
                    if (formTitle === '详情') return;
                    if (!lastRange) return;
                    const el = makeEditorElement({ text: item.text,code: item.code });
                    
                    const range = lastRange.cloneRange();
                    range.deleteContents();
                    range.insertNode(el);
                    range.setStartAfter(el);
                    console.log('getLastRangeHandle(range)', getLastRangeHandle(range));
                    setLastRange(getLastRangeHandle(range));
                  },
                };
              })}
            />
          </div>

          <div className="block">
            <Title
              text="运算符"
              extra={
                <div style={{ display: 'flex', gap: '4px' }}>
                  <InfoCircleOutlined style={{ color: '#999' }} />
                  <span style={{ color: '#999' }}>用于公式运算</span>
                </div>
              }
            />
            <ItemList
              list={operatorLists.map((item) => {
                return {
                  text: item.text,
                  onClick: () => operatorClickHandle(item),
                };
              })}
            />
          </div>

          <div className="block">
            <Title
              text="条件/函数"
              extra={
                <div style={{ display: 'flex', gap: '4px' }}>
                  <InfoCircleOutlined style={{ color: '#999' }} />
                  <span style={{ color: '#999' }}>用于条件判断</span>
                </div>
              }
            />
            <ItemList
              list={ifList.map((item) => {
                return {
                  text: item.text,
                  onClick: () => conditionClickHandle(item),
                };
              })}
            />
          </div>
          {
            (departments&&departments.length>0)?<div className="block">
            <Title text="变量" />
            <VarList
              ref={varListRef}
              formTitle={formTitle}
              departments={departments}
              lastRange={lastRange}
              setLastRange={setLastRange}
              setExampleContent={setExampleContent}
            />
          </div>:''
          }
          <div className="block">
            <Title
              text="自定义变量"
              extra={
                <div>
                  <Button onClick={() => setShowIput(true)} icon={<PlusOutlined />}>
                    新增变量
                  </Button>
                </div>
              }
            />

            <DefineVarList
              ref={defineVarListRef}
              formTitle={formTitle}
              showIput={showIput}
              setShowIput={setShowIput}
              lastRange={lastRange}
              setLastRange={setLastRange}
              setExampleContent={setExampleContent}
            />
          </div>
        </div>:''
        }
      </main>
    </div>
  );
});
