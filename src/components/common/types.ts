/**
 * 文件上传配置
 */
export interface FileUploadConfig {
  /** 接受的文件类型 */
  accept?: string;
  /** 是否支持多文件上传 */
  multiple?: boolean;
  /** 最大文件数量 */
  maxCount?: number;
  /** 最大文件大小（MB） */
  maxSize?: number;
  /** 是否支持拖拽上传 */
  draggable?: boolean;
  /** 是否显示文件列表 */
  showFileList?: boolean;
}

/**
 * 文件上传事件
 */
export interface FileUploadEvents {
  /** 单个文件上传成功 */
  success: [url: string];
  /** 多个文件上传成功 */
  'success-multiple': [urls: string[]];
  /** 上传错误 */
  error: [error: string];
  /** 文件移除 */
  remove: [file: File];
}

/**
 * 上传文件信息
 */
export interface UploadFileInfo {
  id: string;
  name: string;
  status: 'pending' | 'uploading' | 'finished' | 'error';
  url?: string;
  file?: File;
  progress?: number;
}

/**
 * 上传进度信息
 */
export interface UploadProgressInfo {
  id: string;
  name: string;
  progress: number;
  status: 'success' | 'error' | 'warning' | 'default';
}

/**
 * 文件上传响应
 */
export interface FileUploadResponse {
  code: string;
  msg: string;
  data: {
    url: string;
    [key: string]: any;
  };
}

/**
 * 批量文件上传响应
 */
export interface BatchFileUploadResponse {
  code: string;
  msg: string;
  data: {
    urls: string[];
    [key: string]: any;
  };
}

/**
 * 文件信息
 */
export interface FileInfo {
  url: string;
  name: string;
  size: number;
  type: string;
  uploadTime: string;
  [key: string]: any;
}
