const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  outreach: {
    title: "Link Outreach",
    subtitle: "Manage backlink candidates, outreach tasks, and link monitoring",
    manual_check: "Manual Check",
    batch_verify: "Batch Verify",
    warning: "Strictly adhere to search engine spam policies. High-risk bulk link building is prohibited. High-risk candidates are automatically downgraded or blocked. Outreach drafts must not promise link exchanges or paid links.",
    tabs: {
      candidates: "Candidate Pool",
      tasks: "Outreach Tasks",
      monitoring: "Link Monitoring",
      lost_alerts: "Lost Alerts"
    },
    table: {
      domain_type: "Domain / Type",
      relevance: "Relevance",
      quality: "Quality",
      spam_risk: "Spam Risk",
      pos_score: "Position Score",
      stability: "Stability",
      suggested_action: "Suggested Action",
      actions: "Actions",
      candidate: "Candidate",
      method: "Method",
      exchange: "Exchange",
      mark_sent: "Mark Sent",
      draft: "Generate Draft",
      domain_target: "Domain / Target URL",
      status: "Status",
      indexable: "Indexable",
      rel_attr: "Rel Attribute",
      anchor_text: "Anchor Text",
      last_checked: "Last Checked",
      live: "Live",
      lost: "Lost",
      crawlable: "Crawlable",
      target_indexable: "Target Indexable",
      view_details: "View Details",
      draft_content: "Draft Content",
      reason: "Reason",
      verify: "Verify"
    },
    actions: {
      outreach: "Outreach",
      downgrade: "Downgrade",
      block: "Block"
    }
  }
};

const newZh = {
  outreach: {
    title: "外链管理",
    subtitle: "管理外链候选发现、质量评分、外联任务和验链状态",
    manual_check: "手动验链",
    batch_verify: "批量验链",
    warning: "默认遵循搜索引擎垃圾链接政策，禁止高风险批量建链策略。风险过高的候选自动降级或阻断。外联草稿中禁止承诺交换链接、付费购买等违规行为。",
    tabs: {
      candidates: "候选池",
      tasks: "外联任务",
      monitoring: "验链状态",
      lost_alerts: "失效告警"
    },
    table: {
      domain_type: "候选域名 / 类型",
      relevance: "相关性评分",
      quality: "质量评分",
      spam_risk: "垃圾风险",
      pos_score: "链接位置评分",
      stability: "历史稳定性",
      suggested_action: "建议动作",
      actions: "操作",
      candidate: "候选 ID",
      method: "发送方式",
      exchange: "价值交换",
      mark_sent: "标记已发送",
      draft: "生成草稿",
      domain_target: "域名 / 目标落地页",
      status: "状态",
      indexable: "可索引",
      rel_attr: "rel 属性",
      anchor_text: "锚文本",
      last_checked: "最后检查",
      live: "存活",
      lost: "失效",
      crawlable: "可抓取",
      target_indexable: "目标页可索引",
      view_details: "查看候选",
      draft_content: "草稿内容",
      reason: "原因",
      verify: "验证"
    },
    actions: {
      outreach: "外联",
      downgrade: "降级",
      block: "阻断"
    }
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
