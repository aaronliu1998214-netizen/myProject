import { request } from '@umijs/max';

/* 大屏汇总数据 */
export async function getSummaryData(data?:ScreenRsq, options?: any) {
  return request<
  { 
    totalAttackEvents?: number, 
    totalAttackedEvents?: number, 
    impactHours?: number,
    averageResponseEfficiency?:number,
    list:Record<string, any> 
  }
  >('/api/dashboardController/getSummaryData', {
    method: 'POST',
    data,
    ...options,
  });
}

/* 防护资产概况数据 */
export async function getProtectedAssetOverview(data?:ScreenRsq, options?: any) {
  return request<
  { 
    totalProtectionBandwidth?: number, 
    protectionBandwidthUtilization?: number, 
    list:Record<string, any> 
  }>('/api/dashboardController/getProtectedAssetOverview', {
    method: 'POST',
    data,
    ...options,
  });
}

/* 防护资产概况监控 */
export async function getProtectedAssetMonitor(data?:ScreenRsq, options?: any) {
  return request<Record<string, any>>('/api/dashboardController/getProtectedAssetMonitor', {
    method: 'POST',
    data,
    ...options,
  });
}

/* 流量-攻击趋势 */
export async function getTrafficAttackTrend(data?:ScreenRsq, options?: any) {
  return request<Record<string, any>>('/api/dashboardController/getTrafficAttackTrend', {
    method: 'POST',
    data,
    ...options,
  });
}


/* 攻击趋势 */
export async function getAttackTrend(data?:ScreenRsq, options?: any) {
  return request<Record<string, any>>('/api/dashboardController/getAttackTrend', {
    method: 'POST',
    data,
    ...options,
  });
}

/* 威胁情报 */
export async function getThreatIntelligence(data?:ScreenRsq, options?: any) {
  return request<Record<string, any>>('/api/dashboardController/getThreatIntelligence', {
    method: 'POST',
    data,
    ...options,
  });
}

/* 实时DDOS攻击情况 */
export async function getDdosAttackList(data?:ScreenRsq, options?: any) {
  return request<{ total?: number, list:Record<string, any>}>('/api/attackEventController/pageAttackEvent', {
    method: 'POST',
    data,
    ...options,
  });
}

/* 攻击类型按次数分布 */
export async function getAssertsTypeRatio(
  data?:any & AttackSummaryRsq, 
  options?: Record<string, any>
) {
  return request<Record<string, any>>('/api/attackEventController/getAssertsTypeRatio', {
    method: 'POST',
    data,
    ...options,
  });
}


/* 攻击事件分析 */
export async function getAssertsLeveRatio(data?:ScreenRsq, options?: any) {
  return request<{
    highRisk?:number,
    mediumRisk?: number,
    lowRisk?:number,
    list:Record<string, any>
  }>('/api/attackEventController/getAssertsLeveRatio', {
    method: 'POST',
    data,
    ...options,
  });
}

/* 协同处置分析 */
export async function getCooperationDisposalAnalysis(data?:ScreenRsq, options?: any) {
  return request<{
    workOrderSubmissionCount?:number,
    processedWorkOrderRatio?:number,
    list:Record<string, any>
  }>('/api/dashboardController/getCooperationDisposalAnalysis', {
    method: 'POST',
    data,
    ...options,
  });
}

/* 复盘溯源 */
export async function getIncidentReview(data?:ScreenRsq, options?: any) {
  return request<IncidentReviewReq>('/api/dashboardController/getIncidentReview', {
    method: 'POST',
    data,
    ...options,
  });
}