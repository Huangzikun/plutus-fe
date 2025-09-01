<script setup lang="ts">
import { ref } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { uploadFile } from '@/service/api/file';

interface Props {
  accept?: string;
  multiple?: boolean;
  maxCount?: number;
  showFileList?: boolean;
}

interface Emits {
  (e: 'success', url: string): void;
  (e: 'successMultiple', urls: string[]): void;
  (e: 'error', error: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*',
  multiple: false,
  maxCount: 10,
  showFileList: true
});

const emit = defineEmits<Emits>();
const message = useMessage();

// 使用可受控的file-list
const fileList = ref<UploadFileInfo[]>([]);

// 处理文件列表变化
const handleFileListChange = (fileListData: UploadFileInfo[]) => {
  fileList.value = fileListData;
};

// 处理文件移除
const handleRemove = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  fileList.value = data.fileList;

  // 如果是已上传的文件，可以在这里添加删除服务器的逻辑
  if (data.file.url) {
    // 文件移除逻辑
  }
};

// 自定义上传请求
const customRequest = async ({ file, onFinish, onError, onProgress }: any) => {
  try {
    const formData = new FormData();
    formData.append('file', file.file as File);

    const response = await uploadFile(formData, {
      onUploadProgress: (progressEvent: any) => {
        const progress = Math.round((progressEvent.loaded / (progressEvent.total || 1)) * 100);
        onProgress({ percent: progress });
      }
    });

    if (response) {
      // 创建已上传的文件对象，保持原始id
      const newFile: UploadFileInfo = {
        id: file.id,
        name: file.name,
        status: 'finished',
        url: (response as any).url || (response as any).data?.url || ''
      };

      // 更新文件列表
      if (props.multiple) {
        const index = fileList.value.findIndex(f => f.id === file.id);
        if (index !== -1) {
          fileList.value[index] = newFile;
        }
        const urls = fileList.value.map(f => f.url || '').filter(Boolean);
        emit('successMultiple', urls);
      } else {
        fileList.value = [newFile];
        emit('success', (response as any).url || (response as any).data?.url || '');
      }

      message.success(`文件 ${file.name} 上传成功`);
      onFinish();
    } else {
      throw new Error('上传失败');
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '上传失败';
    emit('error', errorMessage);
    onError();
    message.error(`${file.name} 上传失败: ${errorMessage}`);
  }
};

// 公开方法
const clearFiles = () => {
  fileList.value = [];
};

const getUploadedUrls = () => {
  return fileList.value.map(f => f.url || '').filter(Boolean);
};

// 暴露方法给父组件
defineExpose({
  clearFiles,
  getUploadedUrls
});
</script>

<template>
  <NUpload
    v-model:file-list="fileList"
    :accept="accept"
    :multiple="multiple"
    :max="maxCount"
    :show-file-list="showFileList"
    :custom-request="customRequest"
    @update:file-list="handleFileListChange"
    @remove="handleRemove"
  >
    <NButton type="primary">
      <template #icon>
        <NIcon>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20">
            <g fill="none">
              <path
                d="M13.596 5.404a.5.5 0 0 1 .09.908l-3.707 2.146a.5.5 0 0 0-.204.436v4.102a.5.5 0 0 1-1 0V8.894a.5.5 0 0 0-.204-.436L5.764 6.312a.5.5 0 0 1 .09-.908l3.707 2.146a.5.5 0 0 0 .472 0l3.563-2.146zM7.5 14a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
        </NIcon>
      </template>
      上传文件
    </NButton>
  </NUpload>
</template>
