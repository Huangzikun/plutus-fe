<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NButton, NCard, NCascader, NForm, NFormItem, NInput, NInputNumber, NPageHeader, NSpace } from 'naive-ui';
import type { FormRules } from 'naive-ui';
import { useWorkloadConfig } from '@/hooks/useWorkloadConfig';
import FileUpload from '@/components/common/FileUpload.vue';

interface PaperForm {
  paperType: number | null; // 论文指导类型值
  paperCount: number | null; // 份数
  totalWorkload: number;
  support_files: string[];
  remark: string;
}

const router = useRouter();
const route = useRoute();

const { fetchWorkloadConfig, paperTypeOptions } = useWorkloadConfig();

const formRef = ref();
const fileUploadRef = ref<InstanceType<typeof FileUpload> | null>(null);

// 试算结果
const trialResult = ref<{
  value: number;
  formula: string;
} | null>(null);

// 试算加载状态
const trialLoading = ref(false);
const formData = ref<PaperForm>({
  paperType: null,
  paperCount: null,
  totalWorkload: 0,
  support_files: [],
  remark: ''
});

const formRules: FormRules = {
  paperType: [{ required: true, type: 'number', min: 1, message: '请选择论文指导类型', trigger: 'change' }],
  paperCount: [
    { required: true, type: 'number', message: '请输入份数', trigger: 'blur' },
    {
      type: 'number',
      min: 0,
      max: 100,
      message: '份数必须在0-100之间',
      trigger: 'blur'
    }
  ]
};

const isEditing = ref(false);
const paperId = ref<string | null>(null);

// 自动试算处理
const autoCalculate = async () => {
  if (formData.value.paperType && formData.value.paperType > 0 && formData.value.paperCount) {
    try {
      trialLoading.value = true;

      // 准备试算数据
      const trialData = {
        paper_type: formData.value.paperType,
        paper_count: formData.value.paperCount
      };

      // 调用试算接口
      const response = await fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/workload/paper/calculate`, {
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
        formData.value.totalWorkload = result.data.value;
      } else {
        formData.value.totalWorkload = 0;
      }
    } catch (error) {
      console.error('试算失败:', error);
      formData.value.totalWorkload = 0;
    } finally {
      trialLoading.value = false;
    }
  } else {
    formData.value.totalWorkload = 0;
  }
};

// 监听数据变化，自动试算
watch([() => formData.value.paperType, () => formData.value.paperCount], () => {
  autoCalculate();
});

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();

    const teacherId = route.params.id;
    const apiUrl = `${import.meta.env.VITE_SERVICE_BASE_URL}/workload/paper/edit`;

    // 准备提交数据
    const submitData = {
      paper_type: formData.value.paperType,
      paper_count: formData.value.paperCount,
      total_workload: formData.value.totalWorkload,
      support_files: formData.value.support_files,
      remark: formData.value.remark,
      teacher_id: teacherId,
      paper_id: paperId.value || undefined
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submitData)
    });

    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE) {
      window.$message?.success(isEditing.value ? '修改成功' : '提交成功');
      router.push(`/workload/detail/${teacherId}`);
    } else {
      window.$message?.error(result.message || '操作失败');
    }
  } catch (error) {
    console.error('提交失败:', error);
    window.$message?.error('提交失败，请稍后重试');
  }
};

const handleCancel = () => {
  const teacherId = route.params.id;
  router.push(`/workload/detail/${teacherId}`);
};

const loadPaperData = async () => {
  const paperIdParam = route.query.paper_id as string;
  if (!paperIdParam) return;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVICE_BASE_URL}/workload/paper/find?paper_id=${paperIdParam}`
    );
    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE && result.data) {
      const data = result.data;

      formData.value = {
        paperType: data.paper_type || null,
        paperCount: data.paper_count || null,
        totalWorkload: data.standard_workload || 0,
        support_files: data.support_files || [],
        remark: data.remark || ''
      };
      isEditing.value = true;
      paperId.value = paperIdParam;
    }
  } catch (error) {
    console.error('加载数据失败:', error);
    window.$message?.error('加载数据失败');
  }
};

onMounted(async () => {
  await fetchWorkloadConfig();
  await loadPaperData();
});
</script>

<template>
  <div class="h-full">
    <NPageHeader>
      <template #title>
        <span class="text-20px font-medium">
          {{ isEditing ? '修改论文工作量' : '添加论文工作量' }}
        </span>
      </template>
      <template #extra>
        <NButton @click="handleCancel">返回</NButton>
      </template>
    </NPageHeader>

    <div class="flex-1 overflow-y-auto">
      <NCard class="m-16px">
        <NForm
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-placement="left"
          label-width="120px"
          require-mark-placement="right-hanging"
          size="medium"
        >
          <NFormItem label="论文指导类型" path="paperType" class="w-full">
            <NCascader
              v-model:value="formData.paperType"
              :options="paperTypeOptions"
              placeholder="请选择论文指导类型"
              :show-path="true"
              clearable
              check-strategy="child"
            />
          </NFormItem>

          <NFormItem label="份数" path="paperCount" class="w-full">
            <NInputNumber v-model:value="formData.paperCount" placeholder="请输入份数" :min="0" :max="100" clearable />
          </NFormItem>

          <!-- 试算结果 -->
          <NFormItem v-if="trialResult" label="标准学时" class="w-full">
            <div class="space-y-8px">
              <div class="text-24px text-green-600 font-bold">
                {{ trialResult.value.toFixed(2) }}
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

          <NFormItem v-else-if="!trialLoading" label="标准学时" class="w-full">
            <div class="text-16px text-gray-500">请选择论文指导类型和份数自动计算标准学时</div>
          </NFormItem>

          <NFormItem label="备注" path="remark" class="w-full">
            <NInput
              v-model:value="formData.remark"
              type="textarea"
              placeholder="请输入备注信息（可选）"
              :rows="3"
              maxlength="200"
              show-count
            />
          </NFormItem>

          <NFormItem label="相关附件" class="w-full">
            <FileUpload ref="fileUploadRef" v-model:value="formData.support_files" :max-count="5" :max-size="10" />
          </NFormItem>

          <div class="mt-32px flex justify-end">
            <NSpace>
              <NButton type="primary" @click="handleSubmit">提交</NButton>
            </NSpace>
          </div>
        </NForm>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-date-picker) {
  width: 100%;
}

/* 确保级联选择器宽度合适 */
:deep(.n-cascader) {
  width: 100%;
}

/* 确保表单控件对齐 */
:deep(.n-form-item) {
  margin-bottom: 16px;
}

/* 确保选择器不会溢出 */
:deep(.n-cascader-menu) {
  max-width: 300px;
}
</style>
