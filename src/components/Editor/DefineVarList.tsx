import { Button, Input } from 'antd';
import React, { forwardRef, useImperativeHandle } from 'react';
import styles from './VarList.module.less';
import Shanchu from '@/assets/shanchu.svg';

const makeEditorElement = ({ varName, varCode }: { varName: string; varCode: string }) => {
  const editorElement = document.createElement('span');
  editorElement.innerText = varName;
  editorElement.style.display = 'inline-block';
  editorElement.contentEditable = 'false';
  editorElement.style.backgroundColor = '#e6f4ff';
  editorElement.style.color = '#1677ff';
  editorElement.style.border = '1px solid #91caff';
  editorElement.style.padding = '2px 8px';
  editorElement.setAttribute('data-editor-code', varCode);
  return editorElement;
};

interface VarItem {
  varName: string;
  varCode: string;
}

type Props = {
  formTitle: string;
  showIput: boolean;
  setShowIput: React.Dispatch<React.SetStateAction<boolean>>;
  lastRange: Range | undefined;
  setLastRange: React.Dispatch<React.SetStateAction<Range | undefined>>;
  setExampleContent: (content: string) => void;
};

const defaultVarDefinitionMap = [
  {
    varName: '奋斗值',
    varCode: 'fendouzhi',
  },
  {
    varName: '目标值',
    varCode: 'mubiaozhi',
  },
];

export const DefineVarList = forwardRef((props: Props, ref) => {
  const [varDefinitionMap, setVarDefinitionMap] =
    React.useState<VarItem[]>(defaultVarDefinitionMap);
  const [activeVarType, setActiveVarType] = React.useState<string>('');
  const { formTitle, showIput, setShowIput, lastRange, setLastRange, setExampleContent } = props;
  const [inputData, setInputData] = React.useState<any>('');
  
  const reset = () => {
    setActiveVarType('');
    setVarDefinitionMap(defaultVarDefinitionMap);
  };

  useImperativeHandle(ref, () => ({
    reset: reset,
  }));

  const onPressEnter = (e: any) => {
    setInputData(e.target.value)
  };

  const getButton =()=> {
    const updateMap = varDefinitionMap;
    if (inputData === '') {
      alert('不能为空');
      return;
    }
    const timestamp = Date.now();
    const varCode = 'x'+timestamp
    
    updateMap.push({
      varName: inputData.trim(),
      varCode: varCode,
    });
    
    setVarDefinitionMap(updateMap);
    setShowIput(false);
  }

  const getimgB =(e:any)=> {
    const filteredArray = varDefinitionMap.filter(item => item.varCode !== e.varCode);
    setVarDefinitionMap(filteredArray)
  }

  return (
    <div className={styles.container}>
      <div className={styles.varTypeList}>
        {varDefinitionMap.map((item: VarItem) => {
          return (
            <div key={item.varCode} className={styles.hemodiv}>
              <div
                className={`${styles.varItem} ${item.varName === activeVarType ? styles.active : ''}`}
                onClick={() => {
                  setExampleContent('');
                  setActiveVarType(item.varName);
                  if (formTitle === '详情') return;
                  const el = makeEditorElement(item);
                  if (!lastRange) return;
                  const range = lastRange.cloneRange();
                  range.deleteContents();
                  range.insertNode(el);
                  range.setStartAfter(el);
                  range.collapse(true);
                  const selection = window.getSelection();
                  selection?.removeAllRanges();
                  selection?.addRange(range);
                  setLastRange(range);
                }}
              >
                {item.varName}
              </div>
              <div className={styles.bott}>
                <img
                  src={Shanchu}
                  alt="avatar"
                  onClick={()=>getimgB(item)}
                />
              </div>
            </div>
          );
        })}
        {showIput && formTitle !== '详情' && (
          <Input.Group compact>
            <Input style={{ width: '70%' }} allowClear placeholder="请输入" onChange={onPressEnter} />
            <Button style={{ width: '30%' }} type="primary" onClick={getButton}>确定</Button>
          </Input.Group>
        )}
      </div>
    </div>
  );
});
