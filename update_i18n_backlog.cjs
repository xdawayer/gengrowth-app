const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  backlog: {
    title: "Execution Backlog",
    subtitle: "Batched task queue for {{product}}",
    filter: "Filter",
    approve_batch: "Approve Current Batch",
    social_probe: {
      title: "Social-First Probing Active",
      status: "Monitoring",
      active_probes: "Active Probes",
      top_signal: "Top Signal (Reddit)",
      baseline: "Baseline",
      promoted: "Topic Promoted to Batch-0"
    },
    batch: {
      highest_priority: "Highest Priority",
      tasks: "Tasks",
      priority: "Priority",
      dep: "Dep",
      expected: "Expected Output",
      override: "Override Priority"
    }
  }
};

const newZh = {
  backlog: {
    title: "执行队列",
    subtitle: "{{product}} 的批处理任务队列",
    filter: "筛选",
    approve_batch: "批准当前批次",
    social_probe: {
      title: "社媒优先探测活跃中",
      status: "监控中",
      active_probes: "活跃探测",
      top_signal: "最高信号 (Reddit)",
      baseline: "基线",
      promoted: "主题已晋升至 Batch-0"
    },
    batch: {
      highest_priority: "最高优先级",
      tasks: "任务",
      priority: "优先级",
      dep: "依赖",
      expected: "预期输出",
      override: "覆盖优先级"
    }
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
