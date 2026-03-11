const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

en.products = {
  ...en.products,
  "clone_template": "Clone Template",
  "edit_config": "Edit Config",
  "input_profile": "Input Profile",
  "target_regions": "Target Regions",
  "experiment_goal": "Experiment Goal",
  "conversion_event": "Conversion Event",
  "language_override": "Language Override",
  "production_cap": "Production Cap",
  "brand_safety": "Brand Safety",
  "auto_detect": "Auto-Detect",
  "auto": "Auto",
  "pages_week": "pages/week",
  "default_policy": "Default Policy",
  "site_probe_results": "Site Auto-Probe Results",
  "connection_status": "Connection Status",
  "probe_summary": "Probe Summary",
  "completion_rate": "Completion Rate",
  "probe_desc": "Site structure identified as E-commerce / SaaS Hybrid. Detected {{count}} distinct page templates."
};

zh.products = {
  ...zh.products,
  "clone_template": "克隆模板",
  "edit_config": "编辑配置",
  "input_profile": "输入配置 (Input Profile)",
  "target_regions": "目标地区",
  "experiment_goal": "实验目标",
  "conversion_event": "转化事件",
  "language_override": "语言覆盖",
  "production_cap": "产能上限",
  "brand_safety": "品牌安全策略",
  "auto_detect": "自动检测",
  "auto": "自动",
  "pages_week": "页/周",
  "default_policy": "默认策略",
  "site_probe_results": "站点自动探测结果",
  "connection_status": "连接状态",
  "probe_summary": "探测摘要",
  "completion_rate": "完成率",
  "probe_desc": "站点结构识别为电商 / SaaS 混合型。检测到 {{count}} 个不同的页面模板。"
};

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
