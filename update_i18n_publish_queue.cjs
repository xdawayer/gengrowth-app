const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  publish_queue: {
    title: "Publish Queue",
    subtitle: "Manage and schedule content across platforms",
    settings: "Settings",
    tabs: {
      queue: "Queue",
      blocked: "Blocked",
      logs: "Logs"
    },
    table: {
      content: "Content Summary",
      target: "Target",
      level_risk: "Level / Risk",
      schedule: "Schedule",
      actions: "Actions",
      platform: "Platform",
      approval: "Approval",
      time_hash: "Time / Hash",
      response: "Response"
    },
    actions: {
      reject: "Reject",
      approve: "Approve",
      view_fix: "View & Fix"
    },
    reason: "Reason"
  }
};

const newZh = {
  publish_queue: {
    title: "发布队列",
    subtitle: "管理和安排跨平台内容",
    settings: "设置",
    tabs: {
      queue: "队列",
      blocked: "已拦截",
      logs: "日志"
    },
    table: {
      content: "内容摘要",
      target: "目标",
      level_risk: "级别 / 风险",
      schedule: "计划",
      actions: "操作",
      platform: "平台",
      approval: "审批",
      time_hash: "时间 / 哈希",
      response: "响应"
    },
    actions: {
      reject: "拒绝",
      approve: "批准",
      view_fix: "查看并修复"
    },
    reason: "原因"
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
