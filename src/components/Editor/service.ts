import {
  SystemOrganizationCheckOrgCodeReq,
  SystemOrganizationGetOrgTreeSelectDataReq,
  SystemOrganizationLoadOrgListReq,
  SystemOrganizationReq,
  SystemOrganizationRsp,
} from '@@ccs/src/pages/system/org/typings';
import { request } from '@umijs/max';

/** 列表查询 */
export async function loadOrgList(
  params?: SystemOrganizationLoadOrgListReq,
  options: Record<string, any> = {},
) {
  return request<API.APIResponse<SystemOrganizationRsp[]>>(
    '/system-service/system/organization/loadOrgList',
    {
      method: 'GET',
      params,
      ...options,
    },
  );
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


/** 保存数据 */
export async function editOrganization(
  data: SystemOrganizationReq,
  options: Record<string, any> = {},
) {
  return request<API.APIResponse<SystemOrganizationRsp>>(
    '/system-service/system/organization/editOrganization',
    {
      method: 'POST',
      data,
      ...options,
    },
  );
}

/** 组织下拉选择框数据 */
export async function getOrgTreeSelectData(
  params?: SystemOrganizationGetOrgTreeSelectDataReq,
  options: Record<string, any> = {},
) {
  return request<API.APIResponse<SystemOrganizationRsp[]>>(
    '/system-service/system/organization/getOrgTreeSelectData',
    {
      method: 'GET',
      params,
      ...options,
    },
  );
}

/**
 * 检查组织编码
 *
 */
export async function checkOrgCode(params: SystemOrganizationCheckOrgCodeReq, optional = {}) {
  return request<API.APIResponse<boolean>>(`/system-service/system/organization/checkOrgCode`, {
    method: 'GET',
    params,
    ...optional,
  });
}

/**
 * 检查脚本
 *
 */
export async function EXamineScript(data: any, optional = {}) {
  return request<API.APIResponse<any>>(`/system-service/system/indicator/rule/checkRule`, {
    method: 'POST',
    data,
    ...optional,
  });
}
