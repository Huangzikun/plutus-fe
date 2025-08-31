import { request } from '@/service/request';
import { uploadFileDev } from './upload-mock';

/**
 * 上传文件
 * @param file - 要上传的文件
 * @param config - 上传配置
 */
export async function uploadFile(file: FormData, config?: any) {
  // 开发环境使用模拟上传（可以注释掉这行来使用真实接口）
  // if (import.meta.env.DEV) {
  //   return await uploadFileDev(file, config);
  // }

  return await request({
    url: '/file/upload',
    method: 'POST',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  });
}

/**
 * 批量上传文件
 * @param files - 要上传的文件列表
 */
export function uploadMultipleFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });

  return request({
    url: '/file/upload/multiple',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/**
 * 获取文件列表
 * @param params - 查询参数
 */
export function getFileList(params?: { page?: number; size?: number; type?: string; keyword?: string }) {
  return request({
    url: '/file/list',
    method: 'GET',
    params
  });
}

/**
 * 删除文件
 * @param url - 文件URL
 */
export function deleteFile(url: string) {
  return request({
    url: '/file/delete',
    method: 'DELETE',
    params: { url }
  });
}

/**
 * 下载文件
 * @param url - 文件URL
 */
export function downloadFile(url: string) {
  return request({
    url: '/file/download',
    method: 'GET',
    params: { url },
    responseType: 'blob'
  });
}

/**
 * 获取文件信息
 * @param url - 文件URL
 */
export function getFileInfo(url: string) {
  return request({
    url: '/file/info',
    method: 'GET',
    params: { url }
  });
}
