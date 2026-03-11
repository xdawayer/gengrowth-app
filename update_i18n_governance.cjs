const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  governance: {
    title: "Governance Center",
    subtitle: "Audit logs, approvals, and intervention tracking",
    compare: "Version Compare",
    alert: {
      title: "Intervention Alert",
      desc: "3 consecutive manual overrides resulted in negative 7-day ROI.",
      trigger: "Trigger Postmortem"
    },
    log: {
      title: "Manual Override Log",
      last_30: "Last 30 Days",
      reason: "Reason",
      scope: "Scope",
      score_before: "Score Before",
      score_after: "Score After",
      effect_7d: "7-Day Effect",
      effect_14d: "14-Day Effect"
    }
  }
};

const newZh = {
  governance: {
    title: "治理中心",
    subtitle: "审计日志、审批和干预跟踪",
    compare: "版本对比",
    alert: {
      title: "干预警报",
      desc: "连续 3 次手动覆盖导致 7 天 ROI 为负。",
      trigger: "触发复盘"
    },
    log: {
      title: "手动覆盖日志",
      last_30: "过去 30 天",
      reason: "原因",
      scope: "范围",
      score_before: "覆盖前评分",
      score_after: "覆盖后评分",
      effect_7d: "7 天影响",
      effect_14d: "14 天影响"
    }
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
