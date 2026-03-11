const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

en.outreach.modal = {
  "close": "Close",
  "cancel": "Cancel",
  "save_to_tasks": "Save to Tasks",
  "subject": "Subject",
  "message_body": "Message Body",
  "candidate_not_found": "Candidate details not found.",
  "draft_saved": "Draft saved to tasks!",
  "collab_inquiry": "Collaboration Inquiry",
  "draft_template": "Hi Team at {{domain}},\n\nI was reading your recent posts and really loved your content, especially the resource page at {{targetUrl}}.\n\nI'm reaching out from {{productName}}. We have some highly relevant resources that I believe would be a great addition to your page and provide value to your readers.\n\nWould you be open to a quick chat about a potential collaboration?\n\nBest regards,\n[Your Name]"
};

zh.outreach.modal = {
  "close": "关闭",
  "cancel": "取消",
  "save_to_tasks": "保存到任务",
  "subject": "邮件主题",
  "message_body": "正文内容",
  "candidate_not_found": "未找到候选详情。",
  "draft_saved": "草稿已保存到任务！",
  "collab_inquiry": "合作咨询",
  "draft_template": "你好，{{domain}} 团队：\n\n我阅读了你们最近的文章，非常喜欢你们的内容，特别是 {{targetUrl}} 上的资源页面。\n\n我是来自 {{productName}} 的代表。我们有一些高度相关的资源，相信会是你们页面的一个很好的补充，并能为你们的读者提供价值。\n\n不知道你们是否愿意就潜在的合作进行简短的交流？\n\n顺祝商祺，\n[你的名字]"
};

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
