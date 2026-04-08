declare interface ScreenRsq {
  /* 重点资产 */
  criticalAssets?: string;
  /* 区县 */
  district?: string;
  /* 开始时间 */
  beginTime?: string;
  /* 结束时间 */
  endTime?: string;
  /* 运营商 */
  operatorTraffic?: string;
  /*   1攻击来源地图 2流量统计地图 */
  type?: number;
}

declare interface IncidentReviewReq {
  /* 恶意组织数 */
  maliciousOrganizationsCount?: number;
  /* 攻击跳板IP数 */
  attackIpCount?: number;
  /* 新攻击方式 */
  newAttackWayCount?: number;
  /* 最高得分 */
  highestScore?: number;
  /* 较上次 */
  changePercentageFromLastTime?: number;
  /* 较上季度 */
  attchangePercentageFromLastQuarterackTarget?: number;
  /* 一季度 */
  firstQuarter?: number;
  /* 二季度 */
  secondQuarter?: number;
  /* 三季度 */
  thirdQuarter?: number;
  /* 四季度 */
  fourthQuarter?: number;
}