# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

SoybeanAdmin 是一个基于 Vue3 + Vite7 + TypeScript + NaiveUI + UnoCSS 的现代化后台管理模板，采用 pnpm monorepo 架构。

## 技术栈

- **前端框架**: Vue3 + TypeScript
- **构建工具**: Vite7
- **UI框架**: NaiveUI 2.42.0
- **样式**: UnoCSS + SCSS
- **状态管理**: Pinia 3.0.3
- **路由**: Vue Router 4.5.1 + Elegant Router
- **图标**: Iconify + UnoCSS Icons
- **工具链**: ESLint + TypeScript + Vue-TSC

## 项目结构

```
├── src/                          # 主应用源码
│   ├── components/               # 通用组件
│   ├── layouts/                  # 布局组件
│   ├── views/                    # 页面视图
│   ├── router/                   # 路由配置
│   ├── store/                    # 状态管理
│   ├── service/                  # API服务层
│   ├── hooks/                    # 组合式函数
│   ├── utils/                    # 工具函数
│   ├── constants/                # 常量定义
│   └── plugins/                  # 插件配置
├── packages/                     # monorepo子包
│   ├── axios/                    # axios封装
│   ├── hooks/                    # 通用hooks
│   ├── utils/                    # 通用工具
│   ├── color/                    # 颜色处理
│   └── scripts/                  # 构建脚本
├── build/                        # 构建配置
│   ├── config/                   # 构建配置
│   └── plugins/                  # vite插件
└── package.json                  # 项目配置
```

## 常用命令

### 开发
```bash
# 安装依赖
pnpm install

# 开发模式启动
pnpm dev                 # 测试环境
pnpm dev:prod           # 生产环境

# 构建
pnpm build              # 生产构建
pnpm build:test         # 测试构建

# 代码检查
pnpm lint               # ESLint检查并修复
pnpm typecheck          # TypeScript类型检查

# 预览
pnpm preview            # 预览构建结果
```

### 路由管理
```bash
# 生成路由
pnpm gen-route          # 自动生成路由配置
```

### 代码提交
```bash
# 规范化提交
pnpm commit             # 交互式提交
pnpm commit:zh          # 中文交互式提交
```

## 核心架构

### 1. 路由系统
- 使用 **Elegant Router** 自动生成路由
- 支持前端静态路由和后端动态路由
- 自动生成路由导入、声明和类型

### 2. 状态管理
- **Pinia** 作为全局状态管理
- 模块化设计：auth、theme、route、tab、app
- 持久化存储集成

### 3. 布局系统
- **BaseLayout**: 基础布局
- **BlankLayout**: 空白布局
- 响应式设计，支持移动端
- 主题切换和布局配置

### 4. 权限系统
- 基于角色的权限控制
- 路由守卫实现权限验证
- 动态菜单生成

### 5. 组件体系
- **NaiveUI** 基础组件
- 自定义业务组件
- 主题配置和样式定制
- 图标系统（Iconify + SVG）

## 开发规范

### 代码风格
- 使用 ESLint 统一代码风格
- TypeScript 严格模式
- Git 提交规范（Conventional Commits）

### 预提交检查
```bash
# 自动执行：
- TypeScript类型检查
- ESLint代码检查
- Git提交信息验证
```

### 文件命名
- 组件: PascalCase.vue
- 组合式函数: camelCase.ts
- 工具函数: camelCase.ts
- 常量: UPPER_SNAKE_CASE.ts

## 环境配置

### 环境变量
- `.env` - 默认环境
- `.env.development` - 开发环境
- `.env.production` - 生产环境

### 端口配置
- 开发服务器: 9527
- 预览服务器: 9725

## 依赖管理

### Monorepo结构
- 使用 pnpm workspace
- 公共包在 `packages/` 目录下
- 内部包以 `@sa/` 前缀命名

### 核心依赖版本
- Node.js: >=20.19.0
- pnpm: >=10.5.0
- Vue: 3.5.17
- Vite: 7.0.4
- TypeScript: 5.8.3
- 这个项目是一个用于教师工作量计算的系统，所有规范均遵守SoybeanAdmin的核心架构、常用命令、技术栈和开发规范。采用NaiveUI的组件进行页面创建。
- 这个系统包含两个端，分别是用户端和管理员端。我会在创建每个页面时告诉你该页面属于哪个端。
- 项目中的所有时间相关的显示均采用年-月-日 小时:分钟:秒的格式，如2025-01-01 12:13:30