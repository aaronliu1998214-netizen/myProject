/**
 * 人员类型及人员分工
 *
 */
declare interface ScriptReq {
  /**
   * 属性值编码
   */
  transitionScript?: string;
}

interface OperatorType {
  text: string;
}

type ConditionAndFuncType = OperatorType & {
  content: string;
  value: number;
};

type SystemIndicatorListType = {
  /**
   * 指标项编码；
   */
  code: string;

  /**
   * 指标项名称；
   */
  text: string;
};
export { OperatorType, ConditionAndFuncType, SystemIndicatorListType };
