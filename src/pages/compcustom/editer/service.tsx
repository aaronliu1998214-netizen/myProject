import { request } from '@umijs/max';

/** 获取可展示分公司 */
export async function findCompanyList(data: any, optional = {}) {
  return request<API.APIResponse<any>>(`/system-service/MssOrganizationController/findCompanyList`, {
    method: 'POST',
    data,
    ...optional,
  });
}

/** 查询组织列表 */
export async function getOrgTreeByOrgCode(
  params?: any & { pageSize?: number; current?: number },
  options: Record<string, any> = {},
) {
  return request<API.APIPage<any>>('/system-service/system/organization/getOrgTreeByOrgCode', {
    method: 'GET',
    params,
    ...options,
  });
}

/**
 * 组织下拉选择框数据
 * 
 */
export async function getOrgTreeSelectData( optional = {}) {
  return request<API.APIResponse<SystemOrganizationRsp[]>>(`/system-service/system/organization/getOrgTreeSelectData`, {
    method: 'GET',
    ...optional,
  });
}


/**
 * 列表查询岗位
 * 
 */
 export async function pagePost(params: any, optional = {}) {
  return request<API.APIResponse<SystemPostRsp[]>>(`/system-service/systemMark/queryMarkPostList`, {
    method: 'GET',
    params,
    ...optional,
  });
}