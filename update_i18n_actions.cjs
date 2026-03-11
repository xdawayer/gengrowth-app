const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

en.products.actions = {
  ...en.products.actions,
  "add_product": "Add Product",
  "view_details": "View Details",
  "copy_template": "Copy Template",
  "delete_product": "Delete Product"
};

zh.products.actions = {
  ...zh.products.actions,
  "add_product": "添加产品",
  "view_details": "查看详情",
  "copy_template": "复制模板",
  "delete_product": "删除产品"
};

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
