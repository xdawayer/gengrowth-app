const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  playbook: {
    title: "Playbook",
    subtitle: "Knowledge base of success and failure patterns",
    tabs: { all: "All", success: "Success Pattern", failure: "Failure Pattern" },
    search: "Search patterns...",
    reuse: "1-Click Reuse",
    mark_anti: "Mark Anti-Pattern",
    conditions: "Conditions",
    steps: "Key Steps",
    effect: "Historical Effect",
    scope: "Applicable Scope",
    source: "Source Strategy"
  },
  outreach: {
    title: "Link Outreach",
    subtitle: "Manage backlink candidates, outreach tasks, and link monitoring",
    tabs: { candidates: "Candidate Pool", tasks: "Outreach Tasks", monitoring: "Link Monitoring" },
    warning: "Strict adherence to search engine spam policies. High-risk bulk link building is prohibited.",
    manual_check: "Manual Check",
    batch_verify: "Batch Verify Links",
    candidate: { domain: "Candidate Domain", type: "Type", relevance: "Relevance", quality: "Quality", spam_risk: "Spam Risk", position: "Position Score", stability: "Stability", action: "Suggested Action" },
    task: { target: "Target Domain", method: "Method", value: "Value Exchange", status: "Status" },
    monitor: { domain: "Domain / Target", status: "Status", indexable: "Indexable", rel: "Rel Attribute", anchor: "Anchor Text", last_checked: "Last Checked" }
  },
  publish_queue: {
    title: "Publish Queue",
    subtitle: "Manage social media publishing, risk blocking, and rate limits",
    tabs: { queue: "Pending Queue", blocked: "Blocked", logs: "Publish Logs" },
    settings: "Level Settings",
    queue_table: { content: "Content Summary", target: "Target", level: "Level / Risk", schedule: "Schedule", actions: "Actions" },
    blocked_table: { reason: "Reason", view_fix: "View & Fix" },
    logs_table: { content: "Content", platform: "Platform", approval: "Approval", time_hash: "Time / Hash", response: "Response" }
  },
  website: {
    title: "Website Management",
    subtitle: "Manage pages, navigation, and footer configuration",
    tabs: { pages: "Pages", navigation: "Navigation", footer: "Footer" },
    preview: "Preview Site",
    pages_table: { title: "Page Title", path: "Path", type: "Type", status: "Status", last_updated: "Last Updated" },
    nav_header: "Header Navigation",
    add_link: "Add Link",
    footer_legal: "Legal Links",
    footer_contact: "Contact & Social",
    save: "Save Changes"
  },
  compliance: {
    title: "Compliance & Risk",
    subtitle: "Automated content risk checks and approvals",
    tabs: { overview: "Risk Overview", checklists: "Checklists", blocked: "Blocked Records" },
    batch_check: "Batch Check",
    high_risk: "High Risk",
    medium_risk: "Medium Risk",
    low_risk: "Low Risk",
    table: { id: "ID / Target", type: "Check Type", risk: "Risk Level", status: "Status", actions: "Actions" }
  },
  data_integrity: {
    title: "Data Integrity",
    subtitle: "Automated acceptance of data definition, collection, delivery, and reconciliation",
    tabs: { overview: "Overview", auto: "Auto Results", manual: "Manual Review" },
    trigger: "Trigger Acceptance",
    status_review: "Status: Review Required",
    status_desc: "Limited execution allowed. Auto-scaling disabled due to Pipeline warnings.",
    validation: "Validation"
  },
  legal_center: {
    title: "Legal Center",
    subtitle: "Manage legal documents and version history",
    tabs: { documents: "Documents", editor: "Editor", history: "Version History" },
    new_doc: "New Document",
    table: { type: "Document Type", version: "Version", date: "Effective Date", status: "Status", actions: "Actions" }
  },
  consent_center: {
    title: "Consent Management",
    subtitle: "Configure cookie rules and regional policies",
    export: "Export Logs",
    rules: "Consent Rules",
    regions: "Regional Policies"
  },
  integrations: {
    title: "Integrations & OAuth",
    subtitle: "Manage secure connections with least privilege",
    new_conn: "New Connection",
    scopes: "Granted Scopes",
    encrypted: "Encrypted in Vault",
    last_used: "Last used"
  }
};

const newZh = {
  playbook: {
    title: "知识库",
    subtitle: "成功与失败模式的知识库",
    tabs: { all: "全部", success: "成功模式", failure: "失败模式" },
    search: "搜索模式...",
    reuse: "一键复用",
    mark_anti: "标记为反模式",
    conditions: "适用条件",
    steps: "关键步骤",
    effect: "历史效果",
    scope: "适用范围",
    source: "来源策略"
  },
  outreach: {
    title: "外链管理",
    subtitle: "管理外链候选发现、外联任务和验链状态",
    tabs: { candidates: "候选池", tasks: "外联任务", monitoring: "验链状态" },
    warning: "严格遵循搜索引擎垃圾链接政策。禁止高风险批量建链策略。",
    manual_check: "手动验链",
    batch_verify: "批量验链",
    candidate: { domain: "候选域名", type: "候选类型", relevance: "相关性评分", quality: "质量评分", spam_risk: "垃圾风险", position: "链接位置评分", stability: "历史稳定性", action: "建议动作" },
    task: { target: "目标域名", method: "发送方式", value: "价值交换", status: "状态" },
    monitor: { domain: "域名 / 目标页", status: "状态", indexable: "可索引", rel: "Rel 属性", anchor: "锚文本", last_checked: "最后检查" }
  },
  publish_queue: {
    title: "发布队列",
    subtitle: "管理社媒待发布内容的审批、风控阻断与限流保护",
    tabs: { queue: "待发布队列", blocked: "阻断记录", logs: "发布日志" },
    settings: "等级设置",
    queue_table: { content: "内容摘要", target: "目标", level: "等级 / 风险", schedule: "排期时间", actions: "操作" },
    blocked_table: { reason: "阻断原因", view_fix: "查看并修复" },
    logs_table: { content: "内容", platform: "平台", approval: "审批", time_hash: "时间 / 哈希", response: "响应" }
  },
  website: {
    title: "官网后台管理",
    subtitle: "管理官网结构配置、导航、Footer 和页面发布状态",
    tabs: { pages: "页面列表", navigation: "导航配置", footer: "Footer 配置" },
    preview: "预览网站",
    pages_table: { title: "页面标题", path: "路径", type: "类型", status: "状态", last_updated: "最后更新" },
    nav_header: "Header 导航",
    add_link: "添加链接",
    footer_legal: "法务链接",
    footer_contact: "联系与社媒",
    save: "保存更改"
  },
  compliance: {
    title: "合规风控",
    subtitle: "自动检查内容风险，分级处理并支持阻断与升级审批",
    tabs: { overview: "风险概览", checklists: "检查列表", blocked: "阻断记录" },
    batch_check: "批量检查",
    high_risk: "高风险",
    medium_risk: "中风险",
    low_risk: "低风险",
    table: { id: "ID / 目标", type: "检查类型", risk: "风险等级", status: "状态", actions: "操作" }
  },
  data_integrity: {
    title: "数据完整性验收",
    subtitle: "自动验收数据定义、采集、送达和对账的完整性",
    tabs: { overview: "验收总览", auto: "自动验收结果", manual: "人工复核队列" },
    trigger: "触发验收",
    status_review: "状态：需要复核",
    status_desc: "允许有限执行。由于 Pipeline 告警，自动扩量已禁用。",
    validation: "校验"
  },
  legal_center: {
    title: "法务中心",
    subtitle: "管理法务文档的 CRUD 与版本历史",
    tabs: { documents: "文档列表", editor: "编辑器", history: "版本历史" },
    new_doc: "新建文档",
    table: { type: "文档类型", version: "版本", date: "生效日期", status: "状态", actions: "操作" }
  },
  consent_center: {
    title: "同意管理中心",
    subtitle: "配置同意规则、管理地区策略",
    export: "导出日志",
    rules: "同意规则",
    regions: "地区策略"
  },
  integrations: {
    title: "集成中心",
    subtitle: "管理安全连接与最小权限",
    new_conn: "新建连接",
    scopes: "已授权 Scopes",
    encrypted: "Vault 加密存储",
    last_used: "最近使用"
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
