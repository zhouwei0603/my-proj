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
      emptyDescription: "没有通知"
    },
    commands: {
      save: "保存",
      close: "关闭",
      cancel: "取消",
    },
    timeSpan: {
      second: "小于1分钟之前",
      minute: "${value}分钟之前",
      hour: "${value}小时之前",
      day: "${value}天之前"
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
    }
  },
} as const;
