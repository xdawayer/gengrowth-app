const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

en.products.delete_dialog = {
  "title": "Delete Product",
  "description": "Are you sure you want to delete this product? This action will archive the product and stop all active strategies. This cannot be undone.",
  "confirm": "Delete Product"
};

zh.products.delete_dialog = {
  "title": "删除产品",
  "description": "您确定要删除此产品吗？此操作将归档该产品并停止所有活动的策略。此操作无法撤销。",
  "confirm": "删除产品"
};

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
