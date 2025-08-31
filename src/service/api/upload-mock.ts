/**
 * 模拟文件上传服务 - 用于测试
 */

/**
 * 模拟文件上传
 * @param file - 文件对象
 * @param config - 上传配置
 */
export async function mockUploadFile(file: File, config?: any) {
  // 模拟上传延迟
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 模拟进度更新
  if (config?.onUploadProgress) {
    for (let i = 0; i <= 100; i += 10) {
      setTimeout(() => {
        config.onUploadProgress({ loaded: (i * file.size) / 100, total: file.size });
      }, i * 10);
    }
  }

  // 生成模拟URL
  const mockUrl = `http://localhost:3000/uploads/${Date.now()}_${file.name}`;

  return {
    code: '0000',
    msg: '上传成功',
    data: {
      url: mockUrl
    }
  };
}

/**
 * 模拟文件上传 - 用于开发环境
 */
export async function uploadFileDev(file: FormData, config?: any) {
  console.log('上传文件:', file);

  // 获取文件对象
  const fileObj = file.get('file') as File;

  return await mockUploadFile(fileObj, config);
}
