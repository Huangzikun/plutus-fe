<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NAlert,
  NButton,
  NCard,
  NCascader,
  NDynamicTags,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NPageHeader,
  NSelect,
  NSpace
} from 'naive-ui';
import type { FormRules } from 'naive-ui';
import { useWorkloadConfig } from '@/hooks/useWorkloadConfig';
import FileUpload from '@/components/common/FileUpload.vue';

interface OnlineTeachingForm {
  major: string;
  grade: string;
  class_name: string[];
  course_code: string;
  course_name: string;
  class_scale_coefficient: number;
  total_hours: number;
  course_coefficient: number | null;
  student_count: number;
  support_files: string[];
  remark: string;
}

const router = useRouter();
const route = useRoute();

// 使用全局配置 - 网络课程教学专用配置
const { onlineScaleOptions, onlineCoefficientOptions, fetchWorkloadConfig } = useWorkloadConfig();

const formRef = ref();
const fileUploadRef = ref<InstanceType<typeof FileUpload> | null>(null);
const formData = ref<OnlineTeachingForm>({
  major: '',
  grade: '',
  class_name: [],
  course_code: '',
  course_name: '',
  class_scale_coefficient: 1,
  total_hours: 0,
  course_coefficient: null,
  student_count: 0,
  support_files: [],
  remark: ''
});

const rules: FormRules = {
  major: {
    required: true,
    message: '请输入开课专业',
    trigger: 'blur'
  },
  grade: {
    required: true,
    pattern: /^\d{4}$/,
    message: '请输入4位纯数字',
    trigger: 'blur'
  },
  class_name: {
    type: 'array',
    required: true,
    min: 1,
    message: '请至少添加一个开课班级',
    trigger: 'change'
  },
  course_code: {
    required: true,
    message: '请输入课程代码',
    trigger: 'blur'
  },
  course_name: {
    required: true,
    message: '请输入课程名称',
    trigger: 'blur'
  },
  class_scale_coefficient: {
    type: 'number',
    required: true,
    message: '请输入课程规模系数',
    trigger: 'blur'
  },
  total_hours: {
    type: 'number',
    required: true,
    message: '请输入总学时',
    trigger: 'blur'
  },
  course_coefficient: {
    type: 'number',
    required: true,
    message: '请输入课程系数',
    trigger: 'blur'
  },
  student_count: {
    type: 'number',
    required: true,
    message: '请输入学生人数',
    trigger: 'blur'
  },
  remark: {
    type: 'string',
    required: false,
    message: '请输入备注信息',
    trigger: 'blur'
  },
  support_files: {
    type: 'array',
    required: false,
    message: '请上传支撑材料',
    trigger: 'change'
  }
};

// 试算结果
const trialResult = ref<{
  value: number;
  formula: string;
} | null>(null);

// 试算加载状态
const trialLoading = ref(false);

// 错误信息
const errorMessage = ref<string>('');
const showError = ref(false);

// 处理支撑材料上传成功
const handleSupportFilesSuccess = (urls: string[]) => {
  formData.value.support_files = urls;
};

// 处理支撑材料上传错误
const handleSupportFilesError = (error: string) => {
  window.$message?.error(`支撑材料上传失败: ${error}`);
};

// 返回按钮处理
const handleBack = () => {
  router.back();
};

// 提交表单
const handleSubmit = async () => {
  try {
    // 重置错误状态
    showError.value = false;
    errorMessage.value = '';

    // 验证表单
    await formRef.value.validate();

    // 准备提交数据（使用下划线风格参数名）
    const submitData = {
      major: formData.value.major,
      grade: formData.value.grade,
      class_name: formData.value.class_name,
      course_code: formData.value.course_code,
      course_name: formData.value.course_name,
      class_scale_coefficient: formData.value.class_scale_coefficient,
      total_hours: formData.value.total_hours,
      course_coefficient: formData.value.course_coefficient,
      student_count: formData.value.student_count,
      support_files: formData.value.support_files,
      remark: formData.value.remark,
      workload_id: route.params.id
    };

    // 检查是否为修改模式
    const onlineId = route.query.online_id as string;

    // 使用相同的接口，区别在于是否包含online_id
    const url = `${import.meta.env.VITE_SERVICE_BASE_URL}/workload/online/edit`;

    // 如果是修改模式，添加online_id参数
    if (onlineId) {
      Object.assign(submitData, { online_id: onlineId });
    }

    // 调用提交接口
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submitData)
    });

    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE) {
      // 提交成功，返回详情页
      window.$message?.success(onlineId ? '修改成功' : '提交成功');
      router.push(`/workload/detail/${route.params.id}`);
    } else {
      // 提交失败，显示错误信息
      errorMessage.value = result.message || result.msg || '提交失败';
      showError.value = true;
    }
  } catch (error) {
    console.error('提交失败:', error);
    errorMessage.value = '提交请求失败，请稍后重试';
    showError.value = true;
  }
};

// 处理标签创建逻辑
const handleCreateClassTag = (value: string) => {
  // 验证输入格式：数字或者数字+班
  const validFormat = /^\d+(班)?$/;
  if (!validFormat.test(value)) {
    return `${value}班`; // 不符合格式，强制添加"班"
  }

  // 如果输入不以"班"结尾，则添加"班"
  if (!value.endsWith('班')) {
    return `${value}班`;
  }

  return value;
};

// 获取网络课程工作量详情数据
const fetchOnlineWorkloadDetail = async (onlineId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/workload/online/find?online_id=${onlineId}`);
    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE && result.data) {
      const data = result.data;
      // 填充表单数据
      formData.value = {
        major: data.major || '',
        grade: data.grade || '',
        class_name: data.class_name || [],
        course_code: data.course_code || '',
        course_name: data.course_name || '',
        class_scale_coefficient: data.class_scale_coefficient || 1,
        total_hours: data.total_hours || 0,
        course_coefficient: data.course_coefficient || null,
        student_count: data.student_count || 0,
        support_files: data.support_files || [],
        remark: data.remark || ''
      };
      window.$message?.success('数据加载成功');
    } else {
      window.$message?.error(result.message || '数据加载失败');
    }
  } catch (error) {
    console.error('获取网络课程工作量详情失败:', error);
    window.$message?.error('获取数据失败，请稍后重试');
  }
};

// 组件挂载时初始化
onMounted(async () => {
  try {
    await fetchWorkloadConfig();

    // 检查是否有online_id参数，如果有则加载数据
    const onlineId = route.query.online_id as string;
    if (onlineId) {
      await fetchOnlineWorkloadDetail(onlineId);
    }
  } catch (err) {
    window.$message?.error(`配置加载失败: ${err instanceof Error ? err.message : '未知错误'}`);
    console.error('配置加载失败:', err);
  }
});

// 试算处理
const handleTrialCalculation = async () => {
  try {
    trialLoading.value = true;

    // 验证表单
    await formRef.value.validate();

    // 准备试算数据
    const trialData = {
      total_hours: formData.value.total_hours,
      class_scale_coefficient: formData.value.class_scale_coefficient,
      course_coefficient: formData.value.course_coefficient,
      student_count: formData.value.student_count
    };

    // 调用试算接口
    const response = await fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/workload/online/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trialData)
    });

    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE && result.data) {
      trialResult.value = {
        value: result.data.value,
        formula: result.data.formula
      };
      window.$message?.success('试算成功');
    } else {
      window.$message?.error(`试算失败: ${result.msg}`);
    }
  } catch (error) {
    console.error('试算失败:', error);
    window.$message?.error('试算请求失败');
  } finally {
    trialLoading.value = false;
  }
};
</script>

<template>
  <div class="h-full">
    <NPageHeader>
      <template #title>
        <span class="text-20px font-medium">
          {{ route.query.online_id ? '修改网络课程教学工作量' : '新增网络课程教学工作量' }}
        </span>
      </template>
      <template #extra>
        <NButton @click="handleBack">返回</NButton>
      </template>
    </NPageHeader>

    <!-- 配置错误提示 -->
    <NAlert
      v-if="onlineScaleOptions.length === 0 || onlineCoefficientOptions.length === 0"
      title="配置加载失败"
      type="error"
      class="mb-16px"
    >
      无法加载工作量配置，请检查网络连接或联系系统管理员
    </NAlert>

    <!-- 错误提示 -->
    <NAlert v-if="showError" title="提交失败" type="error" closable class="mb-16px" @close="showError = false">
      {{ errorMessage }}
    </NAlert>

    <div class="mt-24px">
      <NCard>
        <NForm
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          size="medium"
          :disabled="onlineScaleOptions.length === 0 || onlineCoefficientOptions.length === 0"
        >
          <NFormItem label="开课专业" path="major">
            <NInput v-model:value="formData.major" placeholder="请输入开课专业" />
          </NFormItem>

          <NFormItem label="开课年级" path="grade">
            <NInput v-model:value="formData.grade" placeholder="请输入4位年份，如：2022" maxlength="4" />
          </NFormItem>

          <NFormItem label="开课班级" path="class_name">
            <NDynamicTags
              v-model:value="formData.class_name"
              :on-create="handleCreateClassTag"
              placeholder="请输入班级号，如：1 或 1班"
            />
          </NFormItem>

          <NFormItem label="课程代码" path="course_code">
            <NInput v-model:value="formData.course_code" placeholder="请输入课程代码" />
          </NFormItem>

          <NFormItem label="课程名称" path="course_name">
            <NInput v-model:value="formData.course_name" placeholder="请输入课程名称" />
          </NFormItem>

          <NFormItem label="课程规模系数" path="class_scale_coefficient">
            <NSelect
              v-model:value="formData.class_scale_coefficient"
              :options="onlineScaleOptions"
              placeholder="请选择课程规模系数"
              clearable
            />
          </NFormItem>

          <NFormItem label="总学时" path="total_hours">
            <NInputNumber v-model:value="formData.total_hours" :min="0" :step="1" placeholder="请输入总学时" />
          </NFormItem>

          <NFormItem label="课程系数" path="course_coefficient">
            <NCascader
              v-model:value="formData.course_coefficient"
              :options="onlineCoefficientOptions"
              placeholder="请选择课程系数"
              check-strategy="child"
              clearable
            />
          </NFormItem>

          <NFormItem label="学生人数" path="student_count">
            <NInputNumber v-model:value="formData.student_count" :min="0" :step="1" placeholder="请输入学生人数" />
          </NFormItem>

          <NFormItem label="备注" path="remark">
            <NInput
              v-model:value="formData.remark"
              type="textarea"
              placeholder="请输入备注信息（如无备注可留空）"
              :maxlength="500"
              show-count
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
            <template #feedback>
              <span class="text-sm text-gray-500">如无特殊说明，可留空</span>
            </template>
          </NFormItem>

          <NFormItem label="支撑材料" path="support_files">
            <FileUpload
              ref="fileUploadRef"
              :multiple="true"
              :max-count="10"
              :max-size="50"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
              @success-multiple="handleSupportFilesSuccess"
              @error="handleSupportFilesError"
            />
          </NFormItem>

          <!-- 试算结果 -->
          <NFormItem v-if="trialResult" label="标准学时">
            <div class="space-y-8px">
              <div class="text-24px text-green-600 font-bold">
                {{ trialResult.value }}
              </div>
              <div
                class="overflow-auto border-l-4 border-green-400 rounded bg-gray-50 px-12px py-8px text-14px text-gray-600 font-mono"
              >
                <div class="mb-4px text-green-700 font-medium">计算公式：</div>
                <div class="whitespace-pre-wrap break-all">
                  {{ trialResult.formula }}
                </div>
              </div>
            </div>
          </NFormItem>

          <NFormItem v-else-if="!trialLoading" label="标准学时">
            <div class="text-16px text-gray-500">点击"试算"按钮计算标准学时</div>
          </NFormItem>

          <div class="mt-32px flex justify-end">
            <NSpace>
              <NButton type="warning" :loading="trialLoading" @click="handleTrialCalculation">试算</NButton>
              <NButton type="primary" @click="handleSubmit">提交</NButton>
            </NSpace>
          </div>
        </NForm>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-form-item-label) {
  font-weight: 500;
}
</style>
