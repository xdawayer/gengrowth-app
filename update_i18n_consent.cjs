const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  consent: {
    title: "Consent Management",
    subtitle: "Configure cookie rules and regional policies",
    export: "Export Logs",
    rules: {
      title: "Consent Rules",
      necessary: "Necessary",
      necessary_desc: "Required for core site functionality.",
      always_on: "Always On",
      analytics: "Analytics",
      analytics_desc: "Used for tracking performance.",
      marketing: "Marketing",
      marketing_desc: "Used for targeted advertising."
    },
    regional: {
      title: "Regional Policies",
      eu: "EU / UK (GDPR)",
      opt_in: "Opt-In",
      ca: "California (CCPA)",
      opt_out: "Opt-Out",
      row: "Rest of World",
      implied: "Implied Consent"
    }
  }
};

const newZh = {
  consent: {
    title: "同意管理",
    subtitle: "配置 Cookie 规则和区域政策",
    export: "导出日志",
    rules: {
      title: "同意规则",
      necessary: "必要",
      necessary_desc: "核心网站功能所需。",
      always_on: "始终开启",
      analytics: "分析",
      analytics_desc: "用于跟踪性能。",
      marketing: "营销",
      marketing_desc: "用于定向广告。"
    },
    regional: {
      title: "区域政策",
      eu: "欧盟 / 英国 (GDPR)",
      opt_in: "选择加入",
      ca: "加利福尼亚州 (CCPA)",
      opt_out: "选择退出",
      row: "世界其他地区",
      implied: "默示同意"
    }
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
