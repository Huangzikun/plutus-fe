import { computed, ref } from 'vue';

// 工作量配置项定义
interface ConfigItem {
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
}

interface ScaleItem {
  name: string;
  value: number;
}

// 单个工作量类型配置
interface WorkloadTypeConfig {
  coefficient: ConfigItem[];
  scale: ScaleItem[];
}

// 工作量配置接口定义
export interface WorkloadConfig {
  code: string;
  msg: string;
  data: {
    theory: WorkloadTypeConfig;
    expirement: WorkloadTypeConfig;
    online: WorkloadTypeConfig;
    internship?: {
      guidance_type?: ConfigItem[];
      coefficient?: ConfigItem[];
    };
    paper?: {
      guidance_type?: ConfigItem[];
      coefficient?: ConfigItem[];
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
    theory: {
      coefficient: [],
      scale: []
    },
    expirement: {
      coefficient: [],
      scale: []
    },
    online: {
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

// 计算属性：理论教学课程规模系数选项
const theoryScaleOptions = computed(() => {
  const theoryScale = config.value?.data?.theory?.scale;
  if (theoryScale && theoryScale.length > 0) {
    return theoryScale.map(item => ({
      label: `${item.name}`,
      value: item.value
    }));
  }
  return [];
});

// 计算属性：理论教学课程系数级联选项
const theoryCoefficientOptions = computed(() => {
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
  return [];
});

// 计算属性：实验教学课程规模系数选项
const experimentScaleOptions = computed(() => {
  const experimentScale = config.value?.data?.expirement?.scale;
  if (experimentScale && experimentScale.length > 0) {
    return experimentScale.map(item => ({
      label: `${item.name}`,
      value: item.value
    }));
  }
  return [];
});

// 计算属性：实验教学课程系数级联选项
const experimentCoefficientOptions = computed(() => {
  const experimentCoefficient = config.value?.data?.expirement?.coefficient;
  if (experimentCoefficient && experimentCoefficient.length > 0) {
    return experimentCoefficient.map(item => {
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

// 计算属性：网络课程教学课程规模系数选项
const onlineScaleOptions = computed(() => {
  const onlineScale = config.value?.data?.online?.scale;
  if (onlineScale && onlineScale.length > 0) {
    return onlineScale.map(item => ({
      label: `${item.name}`,
      value: item.value
    }));
  }
  return [];
});

// 计算属性：网络课程教学课程系数级联选项
const onlineCoefficientOptions = computed(() => {
  const onlineCoefficient = config.value?.data?.online?.coefficient;
  if (onlineCoefficient && onlineCoefficient.length > 0) {
    return onlineCoefficient.map(item => {
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

// 计算属性：毕业实习指导类型级联选项
const internshipGuidanceTypeOptions = computed(() => {
  const guidanceType = config.value?.data?.internship?.guidance_type;
  if (guidanceType && guidanceType.length > 0) {
    return guidanceType.map(item => {
      if (item.children) {
        return {
          label: `${item.label}`,
          value: item.value,
          children: item.children.map(child => ({
            label: `${child.label}`,
            value: child.value
          }))
        };
      }
      return {
        label: `${item.label}`,
        value: item.value
      };
    });
  }
  return [];
});

// 计算属性：毕业实习指导系数选项
const internshipCoefficientOptions = computed(() => {
  const coefficient = config.value?.data?.internship?.coefficient;
  if (coefficient && coefficient.length > 0) {
    return coefficient.map(item => {
      if (item.children) {
        return {
          label: `${item.label}`,
          value: item.value,
          children: item.children.map(child => ({
            label: `${child.label}`,
            value: child.value
          }))
        };
      }
      return {
        label: `${item.label}`,
        value: item.value
      };
    });
  }
  return [];
});

// 计算属性：论文指导类型级联选项
const paperTypeOptions = computed(() => {
  const guidanceType = config.value?.data?.paper?.guidance_type;
  if (guidanceType && guidanceType.length > 0) {
    return guidanceType.map(item => {
      if (item.children) {
        return {
          label: `${item.label}`,
          value: item.value,
          children: item.children.map(child => ({
            label: `${child.label}`,
            value: child.value
          }))
        };
      }
      return {
        label: `${item.label}`,
        value: item.value
      };
    });
  }
  return [];
});

// 计算属性：论文指导系数选项
const paperCoefficientOptions = computed(() => {
  const coefficient = config.value?.data?.paper?.coefficient;
  if (coefficient && coefficient.length > 0) {
    return coefficient.map(item => {
      if (item.children) {
        return {
          label: `${item.label}`,
          value: item.value,
          children: item.children.map(child => ({
            label: `${child.label}`,
            value: child.value
          }))
        };
      }
      return {
        label: `${item.label}`,
        value: item.value
      };
    });
  }
  return [];
});

// 为了向后兼容，保留原来的scaleOptions和coefficientOptions，默认使用theory配置
const scaleOptions = computed(() => theoryScaleOptions.value);
const coefficientOptions = computed(() => theoryCoefficientOptions.value);

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

    // 计算属性 - 通用（默认使用theory）
    scaleOptions,
    coefficientOptions,

    // 计算属性 - 理论教学专用
    theoryScaleOptions,
    theoryCoefficientOptions,

    // 计算属性 - 实验教学专用
    experimentScaleOptions,
    experimentCoefficientOptions,

    // 计算属性 - 网络课程教学专用
    onlineScaleOptions,
    onlineCoefficientOptions,

    // 计算属性 - 毕业实习指导专用
    internshipGuidanceTypeOptions,
    internshipCoefficientOptions,

    // 计算属性 - 论文专用
    paperTypeOptions,
    paperCoefficientOptions
  };
}

// 导出全局缓存以供其他模块使用
export { globalConfigCache };
