<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWorkloadConfig } from '@/hooks/useWorkloadConfig';

const router = useRouter();
const route = useRoute();

// 定义各个工作量的数据类型
interface TheoryTeaching {
  id: number;
  major: string;
  grade: string;
  class_name: string[];
  course_code: string;
  course_name: string;
  class_scale_coefficient: number;
  total_hours: number;
  course_coefficient: number;
  student_count: number;
  teacher_id: string;
  standard_workload: number;
}

interface ExperimentTeaching {
  id: number;
  major: string;
  grade: string;
  class_name: string[];
  course_code: string;
  course_name: string;
  class_scale_coefficient: number;
  total_hours: number;
  course_coefficient: number;
  student_count: number;
  teacher_id: string;
  standard_workload: number;
}

interface GraduationInternship {
  id: number;
  guidance_type: string;
  student_count: number;
  standard_workload: number;
}

// 使用全局配置
const { fetchWorkloadConfig } = useWorkloadConfig();

// 动态理论教学工作量列表
const theoryTeachingList = ref<TheoryTeaching[]>([]);

// 动态实验教学工作量列表
const experimentTeachingList = ref<ExperimentTeaching[]>([]);

// 动态网络课程教学工作量列表
const onlineTeachingList = ref<TheoryTeaching[]>([]);

// 动态毕业实习指导工作量列表
const internshipList = ref<GraduationInternship[]>([]);

// 获取理论教学工作量列表
const fetchTheoryWorkloadList = async () => {
  try {
    const workloadId = route.params.id;
    const response = await fetch(
      `${import.meta.env.VITE_SERVICE_BASE_URL}/workload/theory/list?workload_id=${workloadId}`
    );
    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE && result.data) {
      theoryTeachingList.value = result.data.theory_list || [];
    } else {
      theoryTeachingList.value = [];
    }
  } catch (error) {
    console.error('获取理论教学工作量失败:', error);
    theoryTeachingList.value = [];
  }
};

// 获取实验教学工作量列表
const fetchExperimentWorkloadList = async () => {
  try {
    const workloadId = route.params.id;
    const response = await fetch(
      `${import.meta.env.VITE_SERVICE_BASE_URL}/workload/experiment/list?workload_id=${workloadId}`
    );
    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE && result.data) {
      experimentTeachingList.value = result.data.experiment_list || [];
    } else {
      experimentTeachingList.value = [];
    }
  } catch (error) {
    console.error('获取实验教学工作量失败:', error);
    experimentTeachingList.value = [];
  }
};

// 获取网络课程教学工作量列表
const fetchOnlineWorkloadList = async () => {
  try {
    const workloadId = route.params.id;
    const response = await fetch(
      `${import.meta.env.VITE_SERVICE_BASE_URL}/workload/online/list?workload_id=${workloadId}`
    );
    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE && result.data) {
      onlineTeachingList.value = result.data.online_list || [];
    } else {
      onlineTeachingList.value = [];
    }
  } catch {
    onlineTeachingList.value = [];
  }
};

// 获取毕业实习指导工作量列表
const fetchInternshipList = async () => {
  try {
    const workloadId = route.params.id;
    const response = await fetch(
      `${import.meta.env.VITE_SERVICE_BASE_URL}/workload/internship/list?workload_id=${workloadId}`
    );
    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE && result.data) {
      internshipList.value = result.data.internship_list || [];
    } else {
      internshipList.value = [];
    }
  } catch {
    internshipList.value = [];
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  await fetchWorkloadConfig();
  await fetchTheoryWorkloadList();
  await fetchExperimentWorkloadList();
  await fetchOnlineWorkloadList();
  await fetchInternshipList();
});

// 跳转到理论教学工作量添加页面
const handleAddTheoryTeaching = () => {
  const teacherId = router.currentRoute.value.params.id;
  router.push(`/workload/theory/${teacherId}`);
};

// 跳转到理论教学工作量修改页面
const handleEditTheoryTeaching = (item: TheoryTeaching) => {
  const teacherId = router.currentRoute.value.params.id;
  router.push(`/workload/theory/${teacherId}?theory_id=${item.id}`);
};

// 删除理论教学工作量记录
const handleDeleteTheoryTeaching = async (item: TheoryTeaching) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/workload/theory/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        theory_id: item.id
      })
    });

    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE) {
      window.$message?.success('删除成功');
      // 删除后刷新列表
      await fetchTheoryWorkloadList();
    } else {
      window.$message?.error(result.message || '删除失败');
    }
  } catch (error) {
    console.error('删除理论教学工作量失败:', error);
    window.$message?.error('删除请求失败，请稍后重试');
  }
};

// 跳转到实验教学工作量添加页面
const handleAddExperimentTeaching = () => {
  const teacherId = router.currentRoute.value.params.id;
  router.push(`/workload/experiment/${teacherId}`);
};

// 跳转到实验教学工作量修改页面
const handleEditExperimentTeaching = (item: ExperimentTeaching) => {
  const teacherId = router.currentRoute.value.params.id;
  router.push(`/workload/experiment/${teacherId}?experiment_id=${item.id}`);
};

// 删除实验教学工作量记录
const handleDeleteExperimentTeaching = async (item: ExperimentTeaching) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/workload/experiment/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        experiment_id: item.id
      })
    });

    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE) {
      window.$message?.success('删除成功');
      // 删除后刷新列表
      await fetchExperimentWorkloadList();
    } else {
      window.$message?.error(result.message || '删除失败');
    }
  } catch (error) {
    console.error('删除实验教学工作量失败:', error);
    window.$message?.error('删除请求失败，请稍后重试');
  }
};

// 跳转到网络课程教学工作量添加页面
const handleAddOnlineTeaching = () => {
  const teacherId = router.currentRoute.value.params.id;
  router.push(`/workload/online/${teacherId}`);
};

// 跳转到网络课程教学工作量修改页面
const handleEditOnlineTeaching = (item: any) => {
  const teacherId = router.currentRoute.value.params.id;
  router.push(`/workload/online/${teacherId}?online_id=${item.id}`);
};

// 删除网络课程教学工作量记录
const handleDeleteOnlineTeaching = async (item: any) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/workload/online/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        online_id: item.id
      })
    });

    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE) {
      window.$message?.success('删除成功');
      // 删除后刷新列表
      await fetchOnlineWorkloadList();
    } else {
      window.$message?.error(result.message || '删除失败');
    }
  } catch (error) {
    console.error('删除网络课程教学工作量失败:', error);
    window.$message?.error('删除请求失败，请稍后重试');
  }
};

// 计算理论教学标准学时
const calculateStandardHours = (item: TheoryTeaching) => {
  return item.standard_workload.toFixed(2);
};

// 计算实验教学标准学时
const calculateExperimentStandardHours = (item: ExperimentTeaching) => {
  return item.standard_workload.toFixed(2);
};

// 计算网络课程教学标准学时
const calculateOnlineStandardHours = (item: any) => {
  return item.standard_workload.toFixed(2);
};

// 跳转到毕业实习指导工作量添加页面
const handleAddInternship = () => {
  const teacherId = router.currentRoute.value.params.id;
  router.push(`/workload/internship/${teacherId}`);
};

// 跳转到毕业实习指导工作量修改页面
const handleEditInternship = (item: GraduationInternship) => {
  const teacherId = router.currentRoute.value.params.id;
  router.push(`/workload/internship/${teacherId}?internship_id=${item.id}`);
};

// 删除毕业实习指导工作量记录
const handleDeleteInternship = async (item: GraduationInternship) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/workload/internship/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        internship_id: item.id
      })
    });

    const result = await response.json();

    if (result.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE) {
      window.$message?.success('删除成功');
      // 删除后刷新列表
      await fetchInternshipList();
    } else {
      window.$message?.error(result.message || '删除失败');
    }
  } catch (error) {
    console.error('删除毕业实习指导工作量失败:', error);
    window.$message?.error('删除请求失败，请稍后重试');
  }
};
</script>

<template>
  <div class="h-full flex-col">
    <div class="mb-16px">
      <div class="text-20px font-medium">教师工作量详情</div>
    </div>

    <div class="flex-1 space-y-32px">
      <!-- 理论教学工作量 -->
      <div>
        <div class="mb-16px flex items-center justify-between">
          <h3 class="text-18px font-medium">理论教学工作量</h3>
          <NButton type="primary" @click="handleAddTheoryTeaching">
            <template #icon>
              <icon-ic:round-add />
            </template>
            新增
          </NButton>
        </div>
        <NTable :bordered="true" :single-line="false">
          <thead>
            <tr>
              <th>开课专业</th>
              <th>开课年级</th>
              <th>开课班级</th>
              <th>课程代码</th>
              <th>课程名称</th>
              <th>课程规模系数</th>
              <th>总学时</th>
              <th>课程系数</th>
              <th>人数</th>
              <th>标准学时</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in theoryTeachingList" :key="item.id">
              <td>{{ item.major || '-' }}</td>
              <td>{{ item.grade || '-' }}</td>
              <td>{{ item.class_name?.join(', ') || '-' }}</td>
              <td>{{ item.course_code || '-' }}</td>
              <td>{{ item.course_name || '-' }}</td>
              <td>{{ item.class_scale_coefficient || 0 }}</td>
              <td>{{ item.total_hours || 0 }}</td>
              <td>{{ item.course_coefficient || 0 }}</td>
              <td>{{ item.student_count || 0 }}</td>
              <td>{{ calculateStandardHours(item) }}</td>
              <td>
                <NSpace size="small">
                  <NButton size="small" type="primary" @click="handleEditTheoryTeaching(item)">修改</NButton>
                  <NButton size="small" type="error" @click="handleDeleteTheoryTeaching(item)">删除</NButton>
                </NSpace>
              </td>
            </tr>
            <tr v-if="theoryTeachingList.length === 0">
              <td colspan="11" class="py-16px text-center text-gray-500">暂无理论教学工作量记录</td>
            </tr>
          </tbody>
        </NTable>
      </div>

      <!-- 实验教学工作量 -->
      <div>
        <div class="mb-16px flex items-center justify-between">
          <h3 class="text-18px font-medium">实验教学工作量</h3>
          <NButton type="primary" @click="handleAddExperimentTeaching">
            <template #icon>
              <icon-ic:round-add />
            </template>
            新增
          </NButton>
        </div>
        <NTable :bordered="true" :single-line="false">
          <thead>
            <tr>
              <th>开课专业</th>
              <th>开课年级</th>
              <th>开课班级</th>
              <th>课程代码</th>
              <th>课程名称</th>
              <th>课程规模系数</th>
              <th>总学时</th>
              <th>课程系数</th>
              <th>人数</th>
              <th>标准学时</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in experimentTeachingList" :key="item.id">
              <td>{{ item.major || '-' }}</td>
              <td>{{ item.grade || '-' }}</td>
              <td>{{ item.class_name?.join(', ') || '-' }}</td>
              <td>{{ item.course_code || '-' }}</td>
              <td>{{ item.course_name || '-' }}</td>
              <td>{{ item.class_scale_coefficient || 0 }}</td>
              <td>{{ item.total_hours || 0 }}</td>
              <td>{{ item.course_coefficient || 0 }}</td>
              <td>{{ item.student_count || 0 }}</td>
              <td>{{ calculateExperimentStandardHours(item) }}</td>
              <td>
                <NSpace size="small">
                  <NButton size="small" type="primary" @click="handleEditExperimentTeaching(item)">修改</NButton>
                  <NButton size="small" type="error" @click="handleDeleteExperimentTeaching(item)">删除</NButton>
                </NSpace>
              </td>
            </tr>
            <tr v-if="experimentTeachingList.length === 0">
              <td colspan="11" class="py-16px text-center text-gray-500">暂无实验教学工作量记录</td>
            </tr>
          </tbody>
        </NTable>
      </div>

      <!-- 网络课程教学工作量 -->
      <div>
        <div class="mb-16px flex items-center justify-between">
          <h3 class="text-18px font-medium">网络课程教学工作量</h3>
          <NButton type="primary" @click="handleAddOnlineTeaching">
            <template #icon>
              <icon-ic:round-add />
            </template>
            新增
          </NButton>
        </div>
        <NTable :bordered="true" :single-line="false">
          <thead>
            <tr>
              <th>开课专业</th>
              <th>开课年级</th>
              <th>开课班级</th>
              <th>课程代码</th>
              <th>课程名称</th>
              <th>课程规模系数</th>
              <th>总学时</th>
              <th>课程系数</th>
              <th>人数</th>
              <th>标准学时</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in onlineTeachingList" :key="item.id">
              <td>{{ item.major || '-' }}</td>
              <td>{{ item.grade || '-' }}</td>
              <td>{{ item.class_name?.join(', ') || '-' }}</td>
              <td>{{ item.course_code || '-' }}</td>
              <td>{{ item.course_name || '-' }}</td>
              <td>{{ item.class_scale_coefficient || 0 }}</td>
              <td>{{ item.total_hours || 0 }}</td>
              <td>{{ item.course_coefficient || 0 }}</td>
              <td>{{ item.student_count || 0 }}</td>
              <td>{{ calculateOnlineStandardHours(item) }}</td>
              <td>
                <NSpace size="small">
                  <NButton size="small" type="primary" @click="handleEditOnlineTeaching(item)">修改</NButton>
                  <NButton size="small" type="error" @click="handleDeleteOnlineTeaching(item)">删除</NButton>
                </NSpace>
              </td>
            </tr>
            <tr v-if="onlineTeachingList.length === 0">
              <td colspan="11" class="py-16px text-center text-gray-500">暂无网络课程教学工作量记录</td>
            </tr>
          </tbody>
        </NTable>
      </div>

      <!-- 毕业实习指导工作量 -->
      <div>
        <div class="mb-16px flex items-center justify-between">
          <h3 class="text-18px font-medium">毕业实习指导工作量</h3>
          <NButton type="primary" @click="handleAddInternship">
            <template #icon>
              <icon-ic:round-add />
            </template>
            新增
          </NButton>
        </div>
        <NTable :bordered="true" :single-line="false">
          <thead>
            <tr>
              <th>指导类型</th>
              <th>学生人数</th>
              <th>标准学时</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in internshipList" :key="index">
              <td>{{ item.guidance_type || '-' }}</td>
              <td>{{ item.student_count || 0 }}</td>
              <td>{{ Number(item.standard_workload || 0).toFixed(2) }}</td>
              <td>
                <NSpace size="small">
                  <NButton size="small" type="primary" @click="handleEditInternship(item)">修改</NButton>
                  <NButton size="small" type="error" @click="handleDeleteInternship(item)">删除</NButton>
                </NSpace>
              </td>
            </tr>
            <tr v-if="internshipList.length === 0">
              <td colspan="4" class="py-16px text-center text-gray-500">暂无毕业实习指导工作量记录</td>
            </tr>
          </tbody>
        </NTable>
      </div>

      <!-- 毕业论文指导工作量 -->
      <div>
        <h3 class="mb-16px text-18px font-medium">毕业论文指导工作量</h3>
        <NTable :bordered="true" :single-line="false">
          <thead>
            <tr>
              <th>学生姓名</th>
              <th>学号</th>
              <th>论文类型</th>
              <th>开始日期</th>
              <th>结束日期</th>
              <th>进度</th>
              <th>学期</th>
              <th>系数</th>
              <th>总工作量</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="9" class="py-16px text-center text-gray-500">暂无毕业论文指导工作量记录</td>
            </tr>
          </tbody>
        </NTable>
      </div>

      <!-- 学科竞赛指导工作量 -->
      <div>
        <h3 class="mb-16px text-18px font-medium">学科竞赛指导工作量</h3>
        <NTable :bordered="true" :single-line="false">
          <thead>
            <tr>
              <th>竞赛名称</th>
              <th>竞赛类型</th>
              <th>学生人数</th>
              <th>获奖等级</th>
              <th>活动课时</th>
              <th>学期</th>
              <th>系数</th>
              <th>总工作量</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="8" class="py-16px text-center text-gray-500">暂无学科竞赛指导工作量记录</td>
            </tr>
          </tbody>
        </NTable>
      </div>

      <!-- 教学服务工作量 -->
      <div>
        <h3 class="mb-16px text-18px font-medium">教学服务工作量</h3>
        <NTable :bordered="true" :single-line="false">
          <thead>
            <tr>
              <th>服务类型</th>
              <th>服务内容</th>
              <th>服务课时</th>
              <th>服务日期</th>
              <th>学期</th>
              <th>系数</th>
              <th>总工作量</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="7" class="py-16px text-center text-gray-500">暂无教学服务工作量记录</td>
            </tr>
          </tbody>
        </NTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-tabs-pane-wrapper) {
  height: 100%;
}
</style>
