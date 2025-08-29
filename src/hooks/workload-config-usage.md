# 工作量配置组件使用说明

## 概述

全局配置组件"工作量配置"已成功创建，它从后端接口 `/workload/config` 获取配置数据，并将其存储在全局缓存中，方便各个页面使用。

## 核心文件

1. **主要hook文件**: `src/hooks/useWorkloadConfig.ts`
2. **组合式函数**: `src/composables/useWorkloadConfig.ts`
3. **插件注册**: `src/plugins/workloadConfig.ts`

## 使用方法

### 1. 在组件中使用

```vue
<script setup lang="ts">
import { useWorkloadConfig } from '@/composables/useWorkloadConfig';
import { onMounted } from 'vue';

const {
  config,                    // 配置数据
  loading,                   // 加载状态
  error,                     // 错误信息
  fetchWorkloadConfig,       // 获取配置方法
  majors,                    // 专业列表
  semesters,                 // 学期列表
  classScaleCoefficients,    // 课程规模系数
  courseCoefficients,        // 课程系数
  isConfigLoaded             // 配置是否已加载
} = useWorkloadConfig();

// 组件挂载时加载配置
onMounted(async () => {
  if (!isConfigLoaded()) {
    await fetchWorkloadConfig();
  }
});
</script>

<template>
  <div>
    <!-- 使用专业列表 -->
    <NSelect 
      v-model:value="selectedMajor"
      :options="majors.map(m => ({ label: m, value: m }))"
      placeholder="请选择专业"
    />
    
    <!-- 使用课程规模系数 -->
    <NSelect
      v-model:value="selectedCoefficient"
      :options="Object.entries(classScaleCoefficients || {}).map(([key, value]) => ({
        label: `${key}: ${value}`,
        value: value
      }))"
      placeholder="请选择规模系数"
    />
  </div>
</template>
```

### 2. 获取特定配置值

```typescript
import { useConfigValue } from '@/composables/useWorkloadConfig';

// 获取特定配置值
const semesters = useConfigValue('semesters', []);
const majors = useConfigValue('majors', []);
```

### 3. 从全局缓存获取

```typescript
import { globalConfigCache } from '@/hooks/useWorkloadConfig';

// 从缓存中获取配置
const workloadConfig = globalConfigCache.get('工作量配置');
```

## 配置数据结构

接口 `/workload/config` 返回的数据结构：

```typescript
interface WorkloadConfig {
  // 课程规模系数配置
  classScaleCoefficients?: {
    smallClass: number;      // 小班系数
    mediumClass: number;     // 中班系数
    largeClass: number;      // 大班系数
    extraLargeClass: number; // 超大班系数
  };
  
  // 课程系数配置
  courseCoefficients?: {
    basicCourse: number;        // 基础课系数
    professionalCourse: number; // 专业课系数
    practiceCourse: number;     // 实践课系数
    onlineCourse: number;       // 网络课系数
  };
  
  // 教学工作量计算配置
  teachingWorkload?: {
    theoryTeaching: {
      baseHours: number;
      studentThreshold: number;
    };
    practiceTeaching: {
      baseHours: number;
      groupSize: number;
    };
    onlineTeaching: {
      baseHours: number;
      completionRate: number;
    };
  };
  
  // 指导工作量配置
  guidanceWorkload?: {
    graduationInternship: {
      baseWeeks: number;
      weeklyHours: number;
    };
    graduationThesis: {
      baseHours: number;
      progressPhases: string[];
    };
    competitionGuidance: {
      baseHours: number;
      awardCoefficients: { [key: string]: number };
    };
  };
  
  // 学期配置
  semesters?: string[];
  
  // 专业配置
  majors?: string[];
}
```

## 全局缓存使用

全局缓存名称：**工作量配置**

```typescript
// 在任何地方使用
import { globalConfigCache } from '@/hooks/useWorkloadConfig';

const config = globalConfigCache.get('工作量配置');
console.log('当前配置:', config);
```

## 已集成的页面

1. **理论教学工作量详情页**: `src/views/workload/detail/[id].vue`
2. **理论教学工作量添加页**: `src/views/workload/theory/[id].vue`

这些页面已自动加载配置，并使用其中的专业列表、课程规模系数等数据。

## 注意事项

1. **自动加载**：配置会在组件挂载时自动加载，无需手动调用
2. **缓存机制**：配置数据会被缓存，避免重复请求
3. **响应式**：所有配置数据都是响应式的，会自动更新
4. **错误处理**：包含完整的错误处理和加载状态管理

## 示例后端响应格式

```json
{
  "classScaleCoefficients": {
    "smallClass": 1.0,
    "mediumClass": 1.2,
    "largeClass": 1.5,
    "extraLargeClass": 2.0
  },
  "courseCoefficients": {
    "basicCourse": 1.0,
    "professionalCourse": 1.2,
    "practiceCourse": 0.8,
    "onlineCourse": 0.6
  },
  "semesters": ["2024-2025-1", "2024-2025-2"],
  "majors": ["计算机科学", "软件工程", "人工智能"],
  "teachingWorkload": {
    "theoryTeaching": {
      "baseHours": 48,
      "studentThreshold": 30
    }
  }
}
```