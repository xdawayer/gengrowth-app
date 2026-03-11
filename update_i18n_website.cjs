const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  website: {
    title: "Website Management",
    subtitle: "Manage pages, navigation, and global settings",
    preview: "Preview",
    tabs: {
      pages: "Pages",
      navigation: "Navigation",
      footer: "Footer"
    },
    table: {
      title: "Page Title",
      path: "Path",
      type: "Type",
      status: "Status",
      last_updated: "Last Updated"
    },
    navigation: {
      header: "Header Navigation",
      add_item: "Add Navigation Item"
    }
  }
};

const newZh = {
  website: {
    title: "网站管理",
    subtitle: "管理页面、导航和全局设置",
    preview: "预览",
    tabs: {
      pages: "页面",
      navigation: "导航",
      footer: "页脚"
    },
    table: {
      title: "页面标题",
      path: "路径",
      type: "类型",
      status: "状态",
      last_updated: "最后更新"
    },
    navigation: {
      header: "头部导航",
      add_item: "添加导航项"
    }
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
