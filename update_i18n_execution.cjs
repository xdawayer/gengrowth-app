const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  execution: {
    title: "Execution Management",
    subtitle: "Track SEO and Social execution progress",
    pause_all: "Pause All",
    resume_all: "Resume All",
    tabs: {
      seo: "SEO Logs",
      social: "Social Logs",
      exceptions: "Exceptions"
    },
    seo_table: {
      task: "Task ID / Title",
      status: "Status",
      duration: "Duration",
      output: "Output",
      indexed: "Indexed",
      internal_links: "Internal Links",
      sitemap: "Sitemap",
      actions: "Actions"
    },
    social_table: {
      task: "Task ID / Platform",
      type: "Type",
      status: "Status",
      impressions: "Impressions",
      clicks: "Clicks",
      ctr: "CTR",
      utm: "UTM / Signal",
      actions: "Actions"
    },
    exceptions_table: {
      id: "Exception ID / Task",
      type: "Type",
      message: "Message",
      retries: "Retries",
      status: "Status",
      actions: "Actions"
    },
    actions: {
      view: "View",
      retry: "Retry",
      escalate: "Escalate",
      resolve: "Resolve"
    }
  }
};

const newZh = {
  execution: {
    title: "执行管理",
    subtitle: "跟踪 SEO 和社媒执行进度",
    pause_all: "全部暂停",
    resume_all: "全部恢复",
    tabs: {
      seo: "SEO 日志",
      social: "社媒日志",
      exceptions: "异常记录"
    },
    seo_table: {
      task: "任务 ID / 标题",
      status: "状态",
      duration: "耗时",
      output: "输出",
      indexed: "已索引",
      internal_links: "内链",
      sitemap: "站点地图",
      actions: "操作"
    },
    social_table: {
      task: "任务 ID / 平台",
      type: "类型",
      status: "状态",
      impressions: "曝光",
      clicks: "点击",
      ctr: "点击率",
      utm: "UTM / 信号",
      actions: "操作"
    },
    exceptions_table: {
      id: "异常 ID / 任务",
      type: "类型",
      message: "信息",
      retries: "重试次数",
      status: "状态",
      actions: "操作"
    },
    actions: {
      view: "查看",
      retry: "重试",
      escalate: "升级",
      resolve: "解决"
    }
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
