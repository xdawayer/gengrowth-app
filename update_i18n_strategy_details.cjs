const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

en.strategy.evidence = {
  "discovery": "Discovery",
  "competitor_analysis": "Competitor Analysis",
  "resource_check": "Resource Check",
  "roi_projection": "ROI Projection",
  "audit": "Audit",
  "impact_analysis": "Impact Analysis",
  "link_intersect": "Link Intersect",
  "prospecting": "Prospecting",
  
  "ev_1_1": "Identified 120k/mo search volume gap for 'compatibility' topics.",
  "ev_1_2": "Top 3 competitors have thin content (<800 words) on these topics.",
  "ev_1_3": "Current team capacity allows for 5 pillar pages/week.",
  "ev_1_4": "Estimated 15k new visitors * $0.30 CPC = $4,500/mo value.",
  
  "ev_2_1": "LCP is 4.2s on mobile product pages (failing CWV).",
  "ev_2_2": "Pages failing CWV have 15% higher bounce rate.",
  "ev_2_3": "Improving LCP to <2.5s projected to lift CVR by 0.5%.",
  
  "ev_3_1": "Found 45 domains linking to competitors but not us.",
  "ev_3_2": "Filtered to DR 50+ sites with relevant 'tools' resource pages.",
  "ev_3_3": "Acquiring 5 links expected to boost core rankings by 2 positions."
};

zh.strategy.evidence = {
  "discovery": "发现",
  "competitor_analysis": "竞品分析",
  "resource_check": "资源检查",
  "roi_projection": "ROI 预测",
  "audit": "审计",
  "impact_analysis": "影响分析",
  "link_intersect": "外链交集",
  "prospecting": "潜在客户挖掘",
  
  "ev_1_1": "发现“兼容性”主题存在每月 12 万的搜索量缺口。",
  "ev_1_2": "排名前三的竞品在这些主题上的内容较薄弱（少于 800 字）。",
  "ev_1_3": "当前团队产能允许每周产出 5 篇核心文章。",
  "ev_1_4": "预计 1.5 万新访客 * 0.30 美元 CPC = 每月 4,500 美元价值。",
  
  "ev_2_1": "移动端产品页面的 LCP 为 4.2 秒（未通过核心网页指标）。",
  "ev_2_2": "未通过 CWV 的页面跳出率高出 15%。",
  "ev_2_3": "将 LCP 提升至 2.5 秒以内预计可提升 0.5% 的转化率。",
  
  "ev_3_1": "发现 45 个域名链接到竞品但未链接到我们。",
  "ev_3_2": "筛选出 DR 大于 50 且包含相关“工具”资源页面的网站。",
  "ev_3_3": "获取 5 个外链预计可将核心排名提升 2 个位置。"
};

en.strategy.names = {
  "strat_1": "SEO Content Expansion: Zodiac Compatibility",
  "strat_2": "Technical Debt: Core Web Vitals Optimization",
  "strat_3": "Backlink Outreach: Astrology Tools"
};

zh.strategy.names = {
  "strat_1": "SEO 内容扩展：星座兼容性",
  "strat_2": "技术债务：核心网页指标优化",
  "strat_3": "外链拓展：占星工具"
};

en.strategy.impacts = {
  "imp_1": "Organic Traffic (+15%)",
  "imp_2": "Conversion Rate (+0.5%)",
  "imp_3": "Domain Authority (+2)"
};

zh.strategy.impacts = {
  "imp_1": "自然流量 (+15%)",
  "imp_2": "转化率 (+0.5%)",
  "imp_3": "域名权重 (+2)"
};

en.strategy.costs = {
  "cost_1": "2 Writers, 1 Editor",
  "cost_2": "1 Developer (2 sprints)",
  "cost_3": "1 Outreach Specialist"
};

zh.strategy.costs = {
  "cost_1": "2 名作者，1 名编辑",
  "cost_2": "1 名开发人员（2 个冲刺）",
  "cost_3": "1 名外联专员"
};

en.strategy.risks = {
  "Low": "Low",
  "Medium": "Medium",
  "High": "High"
};

zh.strategy.risks = {
  "Low": "低",
  "Medium": "中",
  "High": "高"
};

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
