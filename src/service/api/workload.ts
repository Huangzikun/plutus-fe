import { request } from '../request';

export interface WorkloadListParams {
  page: number;
  pageSize: number;
}

export interface WorkloadListItem {
  id: number;
  semester: string;
  configName: string;
  createTime: string;
  updateTime: string;
}

export interface WorkloadListResponseData {
  list: WorkloadListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 获取工作量配置列表
 */
export function fetchWorkloadList(params: WorkloadListParams) {
  return request<WorkloadListResponseData>({
    url: '/workload/list',
    method: 'get',
    params
  });
}

/**
 * 创建新的工作量配置
 */
export function createWorkload() {
  return request<{ workload_id: number }>({
    url: '/workload/add',
    method: 'post'
  });
}
