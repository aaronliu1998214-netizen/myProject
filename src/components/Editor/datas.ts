import type { ConditionAndFuncType, OperatorType } from './type';

// 运算符列表
const operatorLists: OperatorType[] = [
  {
    text: '+',
  },
  {
    text: '-',
  },
  {
    text: '*',
  },
  {
    text: '/',
  },
  {
    text: '=',
  },
  {
    text: '>',
  },
  {
    text: '<',
  },
  {
    text: '>=',
  },
  {
    text: '<=',
  },
  {
    text: '(',
  },
  {
    text: ')',
  },
  {
    text: '<>',
  },
  {
    text: '%',
  },
  {
    text: '^',
  },
];

const textStyles =
  'display: inline-block; background-color: rgb(230, 244, 255); color: rgb(22, 119, 255); border: 1px solid rgb(145, 202, 255); padding: 2px 8px;';
// 条件与函数列表
const conditionAndFuncLists: ConditionAndFuncType[] = [
  {
    text: '如果……否则',
    value: 1,
    content: `=if (<span contenteditable="false" data-editor-id="光衰合格率-通用" style="${textStyles}">光衰合格率-通用</span>>=0.4) {
      <br><span contenteditable="false" data-editor-id="占位指标-KPI得分类" style="${textStyles}">占位指标-KPI得分类</span>*
      <span contenteditable="false" data-editor-id="千兆24小时交付率-KPI得分类" style="${textStyles}">千兆24小时交付率-KPI得分类</span>}
       else
      {<br><span contenteditable="false" data-editor-id="装维平均处理时长-KPI得分类" style="${textStyles}">装维平均处理时长-KPI得分类</span>+<span contenteditable="false" data-editor-id="改约率-KPI得分类" style="${textStyles}">改约率-KPI得分类</span>}
    <br><div><br></div><div><br></div><div><br></div><div><br></div>
    <div>如果光衰合格率-通用大于等于40%，那么该项指标为占位指标-KPI得分类*千兆24小时交付率-KPI得分类，否则该项指标为装维平均处理时长-KPI得分类+改约率-KPI得分类</div>`,
  },
  {
    text: '如果',
    value: 2,
    content: `=if (<span contenteditable="false" data-editor-id="光衰合格率-通用" style="${textStyles}">光衰合格率-通用</span>>=0.4) {
      <br><span contenteditable="false" data-editor-id="占位指标-KPI得分类" style="${textStyles}">占位指标-KPI得分类</span>*
      <span contenteditable="false" data-editor-id="千兆24小时交付率-KPI得分类" style="${textStyles}">千兆24小时交付率-KPI得分类</span>}
    <br><div><br></div><div><br></div><div><br></div><div><br></div>
    <div>如果光衰合格率-通用大于等于40%，那么该项指标为占位指标-KPI得分类*千兆24小时交付率-KPI得分类</div>`,
  },
  {
    text: '且',
    value: 3,
    content:
      '且样例暂无',
  },
  {
    text: '或',
    value: 4,
    content:
      '或样例暂无',
  },
  {
    text: '非',
    value: 5,
    content:
      '非样例暂无',
  },
  {
    text: '相等判断（是）',
    value: 6,
    content:
      '相等判断（是）样例暂无',
  },
  {
    text: '不等判断',
    value: 7,
    content:
      '不等判断样例暂无',
  },
  {
    text: '平均值函数',
    value: 8,
    content: `=avgByOrg (<span contenteditable="false" data-editor-id="光衰合格率-通用" style="${textStyles}">光衰合格率-通用</span> ,1); 
    <br><div><br></div><div><br></div><div><br></div><div><br></div>
    <div>param1需要计算平均值的指标，param2：1按全市计算、2按全单位计算、3按全部门计算</div>`,
  },
  {
    text: '连续X个月低效',
    value: 9,
    content: `=NearYearLowEffect (<span contenteditable="false" data-editor-id="光衰合格率-通用" style="${textStyles}">光衰合格率-通用</span> ,'1' ,'3'); 
    <br><div><br></div><div><br></div><div><br></div><div><br></div>
    <div>param1:需要计算的指标，param2：多少算低效，param3：近几个月</div>`,
  },
];

// 条件与函数列表(组织绩效)
const conditionAndFuncListsOrg: ConditionAndFuncType[] = [
  {
    text: '组织平均值',
    value: 10,
    content: `=orgAvg (<span contenteditable="false" data-editor-id="组织平均值" style="${textStyles}">params1</span>); 
    <br><div><br></div><div><br></div><div><br></div><div><br></div>
    <div>param1:个人效能指标</div>`,
  },
  {
    text: '组织人员数量',
    value: 11,
    content: `=orgCount (<span contenteditable="false" data-editor-id="组织人员数量" style="${textStyles}">params1</span> , <span contenteditable="false" data-editor-id="组织人员数量p2" style="${textStyles}">param2</span>); 
    <br><div><br></div><div><br></div><div><br></div><div><br></div>
    <div>param1:个人效能指标, param2:指标值</div>`,
  },
  {
    text: '组织线性内插',
    value: 12,
    content: `=orgLineInnerDiff (<span contenteditable="false" data-editor-id="组织线性内插" style=""></span>'params1' ,'params2', 'params3'); 
    <br><div><br></div><div><br></div><div><br></div><div><br></div>
    <div>param1 :组织效能指标, param2:最低分, param3:最高分 </div>`,
  },
]

const conditionAndFuncListsPerson = [
  {
    text: '线性内插',
    value: 13,
    content: `=lineInnerDiff (<span contenteditable="false" data-editor-id="线性内插" style=""></span>'params1' ,'params2', 'params3', 'params4'); 
    <br><div><br></div><div><br></div><div><br></div><div><br></div>
    <div>param1 :个人效能指标, param2:最低分, param3:最高分, param4: （1：全市，2：本单位） </div>`,
  },
]

const dafaultSystemIndicatorList = [
  {
    text: '光衰合格率-通用',
    code: '19238328923',
  },
  {
    text: '光衰合格率-KPI得分类',
    code: '19238328923',
  },
  {
    text: '虚拟号使用活跃率-通用',
    code: '19238328923',
  },
  {
    text: '虚拟号使用活跃率-KPI得分类',
    code: '19238328923',
  },
  {
    text: '新增宽带-KPI得分类',
    code: '19238328923',
  },
  {
    text: '新增宽带-KPI得分类',
    code: '19238328923',
  },
  {
    text: '装维平均处理时长-KPI得分类',
    code: '19238328923',
  },
  {
    text: '装维平均处理时长-KPI得分类',
    code: '19238328923',
  },
  {
    text: '千兆24小时交付率-KPI得分类',
    code: '19238328923',
  },
  {
    text: '千兆24小时交付率-KPI得分类',
    code: '19238328923',
  },
  {
    text: '改约率-KPI得分类',
    code: '19238328923',
  },
  {
    text: '改约率-KPI得分类',
    code: '19238328923',
  },
  {
    text: '占位指标-KPI得分类',
    code: '19238328923',
  },
  {
    text: '占位指标-KPI得分类',
    code: '19238328923',
  },
  {
    text: '占位指标-KPI得分类',
    code: '19238328923',
  },
  {
    text: '占位指标-KPI得分类',
    code: '19238328923',
  },
  {
    text: '占位指标-KPI得分类',
    code: '19238328923',
  },
  {
    text: '占位指标-KPI得分类',
    code: '19238328923',
  },
  {
    text: '占位指标-KPI得分类',
    code: '19238328923',
  },
  {
    text: '占位指标-KPI得分类',
    code: '19238328923',
  },
  {
    text: '占位指标-KPI得分类',
    code: '19238328923',
  },
  {
    text: '占位指标-KPI得分类',
    code: '19238328923',
  },
];

export { operatorLists, conditionAndFuncLists, conditionAndFuncListsOrg, dafaultSystemIndicatorList, conditionAndFuncListsPerson };
