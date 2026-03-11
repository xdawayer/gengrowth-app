const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  legal: {
    title: "Legal Center",
    subtitle: "Manage legal documents and version history",
    new_doc: "New Document",
    tabs: {
      documents: "Documents",
      editor: "Editor",
      history: "Version History"
    },
    table: {
      type: "Document Type",
      version: "Version",
      effective_date: "Effective Date",
      status: "Status",
      actions: "Actions"
    },
    editor: {
      editing: "Editing Draft",
      preview: "Preview",
      publish: "Publish Version"
    },
    history: {
      title: "Version History"
    }
  }
};

const newZh = {
  legal: {
    title: "法务中心",
    subtitle: "管理法律文档和版本历史",
    new_doc: "新建文档",
    tabs: {
      documents: "文档",
      editor: "编辑器",
      history: "版本历史"
    },
    table: {
      type: "文档类型",
      version: "版本",
      effective_date: "生效日期",
      status: "状态",
      actions: "操作"
    },
    editor: {
      editing: "正在编辑草稿",
      preview: "预览",
      publish: "发布版本"
    },
    history: {
      title: "版本历史"
    }
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
