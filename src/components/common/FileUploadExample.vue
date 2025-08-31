<template>
  <div class="file-upload-example">
    <n-card title="文件上传示例" class="mb-4">
      <template #header-extra>
        <n-tag type="info">支持拖拽上传</n-tag>
      </template>
      
      <n-form ref="formRef" :model="form" :rules="rules" label-placement="left" label-width="120px">
        <n-form-item label="单个文件上传" path="singleFile">
          <file-upload
            ref="singleUploadRef"
            :multiple="false"
            :max-size="10"
            accept=".pdf,.doc,.docx,.jpg,.png"
            @success="handleSingleSuccess"
            @error="handleError"
          />
        </n-form-item>
        
        <n-form-item label="多个文件上传" path="multipleFiles">
          <file-upload
            ref="multipleUploadRef"
            :multiple="true"
            :max-count="5"
            :max-size="20"
            accept=".jpg,.jpeg,.png,.gif"
            @success-multiple="handleMultipleSuccess"
            @error="handleError"
          />
        </n-form-item>
        
        <n-form-item label="拖拽上传" path="dragFiles">
          <file-upload
            ref="dragUploadRef"
            :draggable="true"
            :multiple="true"
            :max-count="3"
            :max-size="50"
            accept="*"
            @success-multiple="handleDragSuccess"
            @error="handleError"
          />
        </n-form-item>
        
        <n-form-item>
          <n-space>
            <n-button type="primary" @click="submitForm">提交</n-button>
            <n-button @click="resetForm">重置</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
    
    <n-card title="上传结果" v-if="uploadedUrls.length > 0">
      <n-list :data="uploadedUrls" size="small">
        <template #item="{ item }">
          <n-list-item>
            <n-space align="center">
              <n-text code class="text-xs" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">
                {{ item }}
              </n-text>
              <n-button size="tiny" type="primary" text @click="copyUrl(item)">复制</n-button>
              <n-button size="tiny" type="info" text tag="a" :href="item" target="_blank">打开</n-button>
            </n-space>
          </n-list-item>
        </template>
      </n-list>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useMessage } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import FileUpload from './FileUpload.vue';

const message = useMessage();

const formRef = ref<FormInst | null>(null);
const singleUploadRef = ref<InstanceType<typeof FileUpload> | null>(null);
const multipleUploadRef = ref<InstanceType<typeof FileUpload> | null>(null);
const dragUploadRef = ref<InstanceType<typeof FileUpload> | null>(null);

const form = reactive({
  singleFile: '',
  multipleFiles: [] as string[],
  dragFiles: [] as string[]
});

const rules = {
  singleFile: {
    required: true,
    message: '请上传单个文件',
    trigger: 'change'
  },
  multipleFiles: {
    required: true,
    type: 'array',
    min: 1,
    message: '请上传至少一个文件',
    trigger: 'change'
  }
};

const uploadedUrls = ref<string[]>([]);

const handleSingleSuccess = (url: string) => {
  form.singleFile = url;
  uploadedUrls.value.push(url);
  message.success(`单个文件上传成功: ${url}`);
};

const handleMultipleSuccess = (urls: string[]) => {
  form.multipleFiles = urls;
  uploadedUrls.value.push(...urls);
  message.success(`多个文件上传成功: ${urls.length}个文件`);
};

const handleDragSuccess = (urls: string[]) => {
  form.dragFiles = urls;
  uploadedUrls.value.push(...urls);
  message.success(`拖拽上传成功: ${urls.length}个文件`);
};

const handleError = (error: string) => {
  message.error(`上传失败: ${error}`);
};

const submitForm = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success('表单验证通过');
      console.log('Form data:', form);
    } else {
      message.error('请检查表单数据');
    }
  });
};

const resetForm = () => {
  formRef.value?.restoreValidation();
  singleUploadRef.value?.clearFiles();
  multipleUploadRef.value?.clearFiles();
  dragUploadRef.value?.clearFiles();
  
  form.singleFile = '';
  form.multipleFiles = [];
  form.dragFiles = [];
  uploadedUrls.value = [];
  
  message.success('表单已重置');
};

const copyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    message.success('URL已复制到剪贴板');
  } catch (err) {
    message.error('复制失败');
  }
};
</script>

<style scoped>
.file-upload-example {
  max-width: 800px;
  margin: 0 auto;
}

:deep(.n-upload-trigger) {
  width: 100%;
}

:deep(.n-upload-file-list) {
  margin-top: 8px;
}
</style>