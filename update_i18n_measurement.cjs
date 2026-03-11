const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  measurement: {
    title: "Measurement & Attribution",
    subtitle: "Unified attribution and experiment reviews",
    export: "Export Data",
    health: {
      title: "Channel Isolation Health",
      desc: "Monitoring UTM integrity and cross-channel conflicts",
      utm: "UTM Integrity",
      conflict: "Conflict Rate",
      valid: "Isolation Valid"
    },
    dashboard: {
      channel: "Channel",
      content: "Content",
      page: "Page",
      last_30: "Last 30 Days",
      viz_title: "{{dimension}} Dimension Visualization",
      viz_desc: "Traffic, Conversions, and ROI breakdown"
    },
    reviews: {
      title: "Measurement Reviews",
      strategy: "Strategy",
      confidence: "Confidence",
      target: "Target",
      actual: "Actual",
      utm_match: "UTM Match",
      postmortem: "View Postmortem",
      status: {
        achieved: "Achieved",
        failed: "Failed",
        insufficient: "Insufficient Data"
      }
    }
  }
};

const newZh = {
  measurement: {
    title: "衡量与归因",
    subtitle: "统一的归因和实验评估",
    export: "导出数据",
    health: {
      title: "渠道隔离健康度",
      desc: "监控 UTM 完整性和跨渠道冲突",
      utm: "UTM 完整性",
      conflict: "冲突率",
      valid: "隔离有效性"
    },
    dashboard: {
      channel: "渠道",
      content: "内容",
      page: "页面",
      last_30: "过去 30 天",
      viz_title: "{{dimension}} 维度可视化",
      viz_desc: "流量、转化和 ROI 细分"
    },
    reviews: {
      title: "衡量评估",
      strategy: "策略",
      confidence: "置信度",
      target: "目标",
      actual: "实际",
      utm_match: "UTM 匹配度",
      postmortem: "查看复盘",
      status: {
        achieved: "已达成",
        failed: "失败",
        insufficient: "数据不足"
      }
    }
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
