const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  playbook: {
    title: "Playbook & Patterns",
    subtitle: "Validated SEO strategies and anti-patterns",
    filter: "Advanced Filter",
    search: "Search playbook...",
    tabs: {
      all: "All Patterns",
      success: "Success Patterns",
      failure: "Anti-Patterns"
    },
    steps: "Steps",
    effect: "Effect",
    scope: "Scope",
    source: "Source Strategy",
    reuse: "Reuse Pattern",
    mark_anti: "Mark as Anti-Pattern",
    types: {
      success_pattern: "Success Pattern",
      failure_pattern: "Failure Pattern"
    }
  }
};

const newZh = {
  playbook: {
    title: "剧本与模式",
    subtitle: "经过验证的 SEO 策略和反模式",
    filter: "高级筛选",
    search: "搜索剧本...",
    tabs: {
      all: "所有模式",
      success: "成功模式",
      failure: "反模式"
    },
    steps: "步骤",
    effect: "效果",
    scope: "适用范围",
    source: "来源策略",
    reuse: "复用模式",
    mark_anti: "标记为反模式",
    types: {
      success_pattern: "成功模式",
      failure_pattern: "失败模式"
    }
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
