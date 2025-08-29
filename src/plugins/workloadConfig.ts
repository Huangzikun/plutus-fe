import type { App } from 'vue';
import { useWorkloadConfig } from '@/hooks/useWorkloadConfig';

export default {
  install(app: App) {
    // 注册全局配置
    app.config.globalProperties.$workloadConfig = useWorkloadConfig();

    // 提供全局配置作为可注入的依赖
    app.provide('workloadConfig', useWorkloadConfig());
  }
};
