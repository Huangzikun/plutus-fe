<script setup lang="ts">
import { h, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NCard, NDataTable, NSpace, NTag } from 'naive-ui';
import { createWorkload, fetchWorkloadList } from '@/service/api';
import type { WorkloadListItem } from '@/service/api';

const router = useRouter();
const loading = ref(false);

// 表格数据
const tableData = ref<WorkloadListItem[]>([]);

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: false,
  showQuickJumper: true,
  onUpdatePage: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  }
});

// 表格列定义
const columns: DataTableColumns<WorkloadListItem> = [
  {
    key: 'semester',
    title: '所属学期',
    align: 'center',
    minWidth: 200,
    render: row =>
      h(
        NTag,
        {
          type: 'info',
          size: 'small'
        },
        () => row.semester
      )
  },
  {
    key: 'configName',
    title: '工作量配置名称',
    align: 'center',
    minWidth: 250,
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'createTime',
    title: '创建时间',
    align: 'center',
    minWidth: 180
  },
  {
    key: 'updateTime',
    title: '更新时间',
    align: 'center',
    minWidth: 180
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    minWidth: 150,
    render: row =>
      h(NSpace, { justify: 'center', size: 'small' }, [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            ghost: true,
            onClick: () => handleEdit(row)
          },
          () => '编辑'
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'success',
            ghost: true,
            onClick: () => handleExport(row)
          },
          () => '导出'
        )
      ])
  }
];

// 编辑操作
function handleEdit(row: WorkloadListItem) {
  window.$message?.info(`编辑: ${row.configName}`);
}

// 导出操作
function handleExport(row: WorkloadListItem) {
  window.$message?.success(`正在导出: ${row.configName}`);
}

// 新增工作量配置
async function handleAdd() {
  try {
    const response = await createWorkload();
    if (response.data) {
      const { workload_id } = response.data;
      router.push(`/workload/detail/${workload_id}`);
    }
  } catch {
    window.$message?.error('创建失败，请稍后重试');
  }
}

// 加载数据
async function loadData() {
  loading.value = true;

  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize
    };

    const response = await fetchWorkloadList(params);

    if (response.data) {
      tableData.value = response.data.list;
      pagination.itemCount = response.data.pagination.total;
    }
  } catch {
    window.$message?.error('获取数据失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}

// 监听分页变化
watch(
  () => [pagination.page, pagination.pageSize],
  () => {
    loadData();
  }
);

// 初始化加载
onMounted(() => {
  loadData();
});

defineOptions({ name: 'WorkLoadList' });
</script>

<template>
  <div class="h-full flex-col">
    <NCard :bordered="false" class="card-wrapper">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-18px font-medium">工作量配置列表</div>
          <NButton type="primary" @click="handleAdd">新增</NButton>
        </div>
      </template>

      <div class="h-full flex-col gap-16px">
        <!-- 表格 -->
        <NDataTable
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :scroll-x="1200"
          :pagination="pagination"
          flex-height
          remote
          class="flex-1-hidden"
        />
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.card-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.flex-1-hidden {
  flex: 1 1 0;
  min-height: 0;
}
</style>
