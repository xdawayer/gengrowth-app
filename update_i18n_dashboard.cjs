const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

en.dashboard.title = "Dashboard";
en.dashboard.subtitle = "Global view of your growth engine";
en.dashboard.refresh_data = "Refresh Data";
en.dashboard.active_products = "Active Products";
en.dashboard.approved_strategies = "Approved Strategies";
en.dashboard.completed_executions = "Completed Executions";
en.dashboard.active_strategies = "Active Strategies";
en.dashboard.performance_overview = "Performance Overview";
en.dashboard.last_3_months = "Last 3 months";
en.dashboard.view_all = "View All";
en.dashboard.automated_decisions = "Automated Decisions";
en.dashboard.optimization_center = "Optimization Center";
en.dashboard.portfolio_health = "Portfolio Health";
en.dashboard.risk_alerts = "Risk Alerts";

en.dashboard.columns = {
  "strategy_name": "Strategy Name",
  "score": "Score",
  "status": "Status",
  "last_decision": "Last Decision"
};

zh.dashboard.title = "仪表盘";
zh.dashboard.subtitle = "增长引擎全局视图";
zh.dashboard.refresh_data = "刷新数据";
zh.dashboard.active_products = "活跃产品";
zh.dashboard.approved_strategies = "已批准策略";
zh.dashboard.completed_executions = "已完成执行";
zh.dashboard.active_strategies = "活跃策略";
zh.dashboard.performance_overview = "性能概览";
zh.dashboard.last_3_months = "过去 3 个月";
zh.dashboard.view_all = "查看全部";
zh.dashboard.automated_decisions = "自动决策";
zh.dashboard.optimization_center = "优化中心";
zh.dashboard.portfolio_health = "投资组合健康度";
zh.dashboard.risk_alerts = "风险预警";

zh.dashboard.columns = {
  "strategy_name": "策略名称",
  "score": "评分",
  "status": "状态",
  "last_decision": "最新决策"
};

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
