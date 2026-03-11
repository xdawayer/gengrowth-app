const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

en.products.details = {
  ...en.products.details,
  "probe_steps": {
    "sitemap_label": "Sitemap Discovery",
    "sitemap_found": "Found",
    "sitemap_not_found": "Not Found",
    "sitemap_desc": "Checking for /sitemap.xml and robots.txt references.",
    "page_type_label": "Page Type Identification",
    "page_type_desc": "Analyzing DOM structure to identify product, category, and blog pages.",
    "language_label": "Language Detection",
    "language_unknown": "Unknown",
    "language_desc": "Detected primary content language via meta tags and NLP."
  }
};

zh.products.details = {
  ...zh.products.details,
  "probe_steps": {
    "sitemap_label": "站点地图发现",
    "sitemap_found": "已找到",
    "sitemap_not_found": "未找到",
    "sitemap_desc": "检查 /sitemap.xml 和 robots.txt 引用。",
    "page_type_label": "页面类型识别",
    "page_type_desc": "分析 DOM 结构以识别产品、类别和博客页面。",
    "language_label": "语言检测",
    "language_unknown": "未知",
    "language_desc": "通过元标签和 NLP 检测主要内容语言。"
  }
};

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
