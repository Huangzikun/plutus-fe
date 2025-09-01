/**
 * 文件上传服务 - 已移除mock数据
 */

/**
 * 文件上传
 * @param _file - 文件对象
 * @param _config - 上传配置
 */
export async function mockUploadFile(_file: File, _config?: any) {
  // 实际实现已移除
  throw new Error('Mock上传功能已移除，请使用实际的上传服务');
}

/**
 * 文件上传 - 用于开发环境
 */
export async function uploadFileDev(_file: FormData, _config?: any) {
  // 实际实现已移除
  throw new Error('开发环境上传功能已移除，请使用实际的上传服务');
}
