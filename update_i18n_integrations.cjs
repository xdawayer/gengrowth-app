const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  integrations: {
    title: "Integrations & OAuth",
    subtitle: "Manage secure connections with least privilege",
    new_connection: "New Connection",
    granted_scopes: "Granted Scopes",
    encrypted: "Encrypted in Vault",
    last_used: "Last used"
  }
};

const newZh = {
  integrations: {
    title: "集成与 OAuth",
    subtitle: "以最小权限管理安全连接",
    new_connection: "新建连接",
    granted_scopes: "已授予的权限",
    encrypted: "在保管库中加密",
    last_used: "最后使用"
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
