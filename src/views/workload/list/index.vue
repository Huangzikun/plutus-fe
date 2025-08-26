<script setup lang="ts">
import { h, onMounted, reactive, ref, watch } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NDataTable, NSpace, NTag } from 'naive-ui';
import mockData from './mock.json';

interface WorkLoadConfig {
  id: number;
  semester: string;
  configName: string;
  createTime: string;
  updateTime: string;
}

const loading = ref(false);

// 表格数据
const tableData = ref<WorkLoadConfig[]>([]);

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
const columns: DataTableColumns<WorkLoadConfig> = [
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
function handleEdit(row: WorkLoadConfig) {
  window.$message?.info(`编辑: ${row.configName}`);
}

// 导出操作
function handleExport(row: WorkLoadConfig) {
  window.$message?.success(`正在导出: ${row.configName}`);
}

// 加载数据
function loadData() {
  loading.value = true;

  // 模拟异步加载
  setTimeout(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;

    tableData.value = mockData.slice(startIndex, endIndex);
    pagination.itemCount = mockData.length;

    loading.value = false;
  }, 500);
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
        <div class="text-18px font-medium">工作量配置列表</div>
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
