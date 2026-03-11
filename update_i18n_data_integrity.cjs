const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  data_integrity: {
    title: "Data Integrity",
    subtitle: "Automated acceptance of data definition, collection, delivery, and reconciliation",
    trigger: "Trigger Acceptance",
    tabs: {
      overview: "Overview",
      auto: "Auto Results",
      manual: "Manual Review"
    },
    overview: {
      status_review: "Status: Review Required",
      status_desc: "Limited execution allowed. Auto-scaling disabled due to Pipeline warnings.",
      dimensions: {
        schema: "Schema",
        coverage: "Coverage",
        pipeline: "Pipeline",
        reconciliation: "Reconciliation",
        attribution: "Attribution",
        consent: "Consent"
      }
    },
    auto: {
      validation: "{{name}} Validation"
    },
    manual: {
      fallback: "Pipeline Fallback",
      task: "Task",
      issue: "End-to-end delivery rate dropped below 99%",
      desc: "Analyst required to perform sample playback and log verification.",
      claim: "Claim Task (Analyst)",
      conditional: "Conditional Approval (PM/Owner)"
    },
    status: {
      accept: "accept",
      review: "review",
      reject: "reject"
    }
  }
};

const newZh = {
  data_integrity: {
    title: "数据完整性",
    subtitle: "数据定义、收集、交付和对账的自动验收",
    trigger: "触发验收",
    tabs: {
      overview: "概览",
      auto: "自动结果",
      manual: "人工审核"
    },
    overview: {
      status_review: "状态：需要审核",
      status_desc: "允许有限执行。由于管道警告，自动扩展已禁用。",
      dimensions: {
        schema: "模式",
        coverage: "覆盖率",
        pipeline: "管道",
        reconciliation: "对账",
        attribution: "归因",
        consent: "同意"
      }
    },
    auto: {
      validation: "{{name}} 验证"
    },
    manual: {
      fallback: "管道回退",
      task: "任务",
      issue: "端到端交付率降至 99% 以下",
      desc: "需要分析师执行样本回放和日志验证。",
      claim: "认领任务 (分析师)",
      conditional: "有条件批准 (PM/所有者)"
    },
    status: {
      accept: "接受",
      review: "审核",
      reject: "拒绝"
    }
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
