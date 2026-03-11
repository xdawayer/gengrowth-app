const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

en.dashboard.alerts = {
  "alert1": {
    "title": "Data Connection Failure",
    "description": "Product \"AstroGrowth\" lost connection to Google Search Console.",
    "action": "Fix Connection"
  },
  "alert2": {
    "title": "Compliance Warning",
    "description": "3 outreach links pending legal review for GDPR compliance.",
    "action": "Review Links"
  },
  "alert3": {
    "title": "New Opportunity Detected",
    "description": "AI found a high-potential keyword gap for \"zodiac compatibility\".",
    "action": "View Opportunity"
  }
};

en.dashboard.strategies = {
  "strat1": { "name": "SEO Content Expansion", "decision": "Expand" },
  "strat2": { "name": "Backlink Outreach", "decision": "Iterate" },
  "strat3": { "name": "Technical Debt Cleanup", "decision": "Pause" },
  "strat4": { "name": "Social Signal Boost", "decision": "Fix" }
};

en.dashboard.decisions = {
  "dec1": { "label": "Budget Expanded", "description": "Increased budget for high-performing SEO content by 20%." },
  "dec2": { "label": "Strategy Iterated", "description": "Updated keywords for Backlink Outreach based on new discovery data." },
  "dec3": { "label": "Execution Paused", "description": "Paused Technical Debt Cleanup due to high error rate in deployment." }
};

zh.dashboard.alerts = {
  "alert1": {
    "title": "数据连接失败",
    "description": "产品 \"AstroGrowth\" 失去了与 Google Search Console 的连接。",
    "action": "修复连接"
  },
  "alert2": {
    "title": "合规警告",
    "description": "3 个外联链接正在等待 GDPR 合规的法律审查。",
    "action": "审查链接"
  },
  "alert3": {
    "title": "发现新机会",
    "description": "AI 发现了“星座兼容性”的高潜力关键词缺口。",
    "action": "查看机会"
  }
};

zh.dashboard.strategies = {
  "strat1": { "name": "SEO 内容扩展", "decision": "扩展" },
  "strat2": { "name": "外链拓展", "decision": "迭代" },
  "strat3": { "name": "技术债务清理", "decision": "暂停" },
  "strat4": { "name": "社交信号提升", "decision": "修复" }
};

zh.dashboard.decisions = {
  "dec1": { "label": "预算增加", "description": "将表现良好的 SEO 内容预算增加了 20%。" },
  "dec2": { "label": "策略迭代", "description": "根据新的发现数据更新了外链拓展的关键词。" },
  "dec3": { "label": "执行暂停", "description": "由于部署错误率高，暂停了技术债务清理。" }
};

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
