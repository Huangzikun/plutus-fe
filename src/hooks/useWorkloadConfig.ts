import { computed, ref } from 'vue';

// 工作量配置接口定义
export interface WorkloadConfig {
  code: string;
  msg: string;
  data: {
    coefficient: {
      label: string;
      value: string;
      children?: {
        label: string;
        value: string | number;
        children?: {
          label: string;
          value: number;
        }[];
      }[];
    }[];
    scale: {
      name: string;
      value: number;
    }[];
    theory?: {
      coefficient: {
        label: string;
        value: string;
        children?: {
          label: string;
          value: string | number;
          children?: {
            label: string;
            value: number;
          }[];
        }[];
      }[];
      scale: {
        name: string;
        value: number;
      }[];
    };
  };
}

// 全局缓存
const globalConfigCache = new Map<string, any>();

// 空配置，强制从接口获取
const emptyConfig: WorkloadConfig = {
  code: '',
  msg: '',
  data: {
    coefficient: [],
    scale: [],
    theory: {
      coefficient: [],
      scale: []
    }
  }
};

// 配置状态
const config = ref<WorkloadConfig>(emptyConfig);
const loading = ref(false);
const error = ref<string | null>(null);

/**
 * 获取工作量配置（从真实接口获取）
 */
async function fetchWorkloadConfig(): Promise<WorkloadConfig> {
  try {
    loading.value = true;
    error.value = null;

    // 使用真实API调用，添加时间戳防止缓存
    const response = await fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/workload/config?t=${Date.now()}`);

    if (!response.ok) {
      throw new Error(`接口请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // 只要接口调用和解析成功即可视为成功
    if (data && data.data) {
      config.value = data;
      // 存储到全局缓存
      globalConfigCache.set('工作量配置', config.value);
      return config.value;
    }
    throw new Error(data.message || data.msg || '配置数据格式不正确');
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取配置失败';
    // 清空配置，不返回任何兜底数据
    config.value = emptyConfig;

    // 抛出错误，让调用方处理
    throw new Error(`无法获取工作量配置: ${error.value}`);
  } finally {
    loading.value = false;
  }
}

/**
 * 重新加载配置
 */
async function reloadConfig(): Promise<WorkloadConfig> {
  return await fetchWorkloadConfig();
}

/**
 * 从缓存中获取配置
 */
function getConfigFromCache(): WorkloadConfig | null {
  return globalConfigCache.get('工作量配置') || null;
}

/**
 * 检查配置是否已加载
 */
function isConfigLoaded(): boolean {
  return Object.keys(config.value).length > 0;
}

// 计算属性：课程规模系数选项（只显示名称）
const scaleOptions = computed(() => {
  // 优先使用theory对象中的配置
  const theoryScale = config.value?.data?.theory?.scale;
  if (theoryScale && theoryScale.length > 0) {
    return theoryScale.map(item => ({
      label: `${item.name}`,
      value: item.value
    }));
  }
  // 如果没有theory配置，使用根级别的scale
  if (config.value?.data?.scale) {
    return config.value.data.scale.map(item => ({
      label: `${item.name}`,
      value: item.value
    }));
  }
  return [];
});

// 计算属性：课程系数级联选项（三级级联，只显示label）
const coefficientOptions = computed(() => {
  // 优先使用theory对象中的配置
  const theoryCoefficient = config.value?.data?.theory?.coefficient;
  if (theoryCoefficient && theoryCoefficient.length > 0) {
    return theoryCoefficient.map(item => {
      if (item.children) {
        return {
          label: `${item.label}`,
          value: item.value,
          children: item.children.map(child => {
            if (child.children) {
              return {
                label: `${child.label}`,
                value: child.value,
                children: child.children.map(grandChild => ({
                  label: `${grandChild.label}`,
                  value: grandChild.value
                }))
              };
            }
            return {
              label: `${child.label}`,
              value: child.value
            };
          })
        };
      }
      return item;
    });
  }
  // 如果没有theory配置，使用根级别的coefficient
  if (config.value?.data?.coefficient) {
    return config.value.data.coefficient.map(item => {
      if (item.children) {
        return {
          label: `${item.label}`,
          value: item.value,
          children: item.children.map(child => {
            if (child.children) {
              return {
                label: `${child.label}`,
                value: child.value,
                children: child.children.map(grandChild => ({
                  label: `${grandChild.label}`,
                  value: grandChild.value
                }))
              };
            }
            return {
              label: `${child.label}`,
              value: child.value
            };
          })
        };
      }
      return item;
    });
  }
  return [];
});

export function useWorkloadConfig() {
  return {
    // 状态
    config,
    loading,
    error,

    // 方法
    fetchWorkloadConfig,
    reloadConfig,
    getConfigFromCache,
    isConfigLoaded,

    // 计算属性
    scaleOptions,
    coefficientOptions
  };
}

// 导出全局缓存以供其他模块使用
export { globalConfigCache };
