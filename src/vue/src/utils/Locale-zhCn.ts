import { type Strings } from "./LocaleCore";

export const strings: Strings = {
  app: {
    header: {
      notification: "通知",
      settings: "设置",
    },
    navigator: {
      overview: "概览",
      management: "管理",
      po: "采购订单",
      part: "零件",
      help: "帮助",
      document: "文档",
      about: "关于",
    },
    settings: {
      title: "配置",
      language: "语言",
    },
    notification: {
      title: "通知",
      remove: "清除",
      removeAllButton: "清除所有",
      emptyDescription: "没有通知",
    },
    common: {
      loading: "加载中",
      noData: "无数据",
      error: "错误",
      yes: "是",
      no: "否",
      ok: "确定",
    },
    commands: {
      save: "保存",
      close: "关闭",
      cancel: "取消",
    },
    timeSpan: {
      second: "小于1分钟之前",
      minute: "{value}分钟之前",
      hour: "{value}小时之前",
      day: "{value}天之前",
    },
    views: {
      part: {
        create: "添加新零件",
        update: "编辑零件",
      },
      poitem: {
        create: "添加新采购订单项",
        update: "编辑采购订单项",
      },
      po: {
        create: "添加新采购订单",
        update: "编辑采购订单",
      },
    },
  },
  part: {
    name: "名称",
  },
  po: {
    title: "标题",
  },
  views: {
    created: "创建于",
    modified: "修改于",
    createdBy: "创建者",
    modifiedBy: "修改者",
    refresh: "刷新",
    deleteErrorTitle: "删除错误",
    deleteSuccessTitle: "删除成功",
    deleteInProgressTitle: "正在删除",
    updateErrorTitle: "更新错误",
    updateSuccessTitle: "更新成功",
    updateInProgressTitle: "正在更新",
    createErrorTitle: "创建错误",
    createSuccessTitle: "创建成功",
    createInProgressTitle: "正在创建",
    part: {
      searchByName: "按名称搜索",
    },
    po: {
      searchByTitle: "按标题搜索",
      create: "创建新采购订单",
      update: "编辑采购订单",
      delete: "删除采购订单",
      confirmDelete: "确定要删除所选采购订单吗？此操作不可撤销。",
      deleteErrorMessage: "删除采购订单 {name} 失败。可能存在相关的采购订单项。\n{msg}",
      deleteSuccessMessage: "所选采购订单 {name} 已成功删除。",
      deleteInProgressMessage: "正在删除采购订单 {name}...",
      updateErrorMessage: "更新采购订单 {name} 失败。\n{msg}",
      updateSuccessMessage: "采购订单 {name} 已成功更新。",
      updateInProgressMessage: "正在更新采购订单 {name}...",
      createErrorMessage: "创建采购订单 {name} 失败。\n{msg}",
      createSuccessMessage: "采购订单 {name} 已成功创建。",
      createInProgressMessage: "正在创建采购订单 {name}...",
    },
  },
} as const;
