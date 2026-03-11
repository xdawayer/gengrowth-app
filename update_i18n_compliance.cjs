const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  compliance: {
    title: "Compliance & Risk",
    subtitle: "Automated content risk checks and approvals",
    batch_check: "Batch Check",
    tabs: {
      overview: "Risk Overview",
      checklists: "Checklists",
      blocked: "Blocked Records"
    },
    overview: {
      high_risk: "High Risk",
      high_risk_desc: "Auto-blocked. Needs Owner approval.",
      medium_risk: "Medium Risk",
      medium_risk_desc: "Alerted. Needs PM confirmation.",
      low_risk: "Low Risk",
      low_risk_desc: "Logged. No action required."
    },
    table: {
      id_target: "ID / Target",
      check_type: "Check Type",
      risk_level: "Risk Level",
      status: "Status",
      actions: "Actions"
    },
    actions: {
      approve: "Approve (Owner)",
      confirm: "Confirm (PM)",
      view_details: "View Details"
    }
  }
};

const newZh = {
  compliance: {
    title: "合规与风险",
    subtitle: "自动内容风险检查和审批",
    batch_check: "批量检查",
    tabs: {
      overview: "风险概览",
      checklists: "检查清单",
      blocked: "已拦截记录"
    },
    overview: {
      high_risk: "高风险",
      high_risk_desc: "自动拦截。需要所有者审批。",
      medium_risk: "中风险",
      medium_risk_desc: "已警报。需要 PM 确认。",
      low_risk: "低风险",
      low_risk_desc: "已记录。无需操作。"
    },
    table: {
      id_target: "ID / 目标",
      check_type: "检查类型",
      risk_level: "风险等级",
      status: "状态",
      actions: "操作"
    },
    actions: {
      approve: "审批 (所有者)",
      confirm: "确认 (PM)",
      view_details: "查看详情"
    }
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
