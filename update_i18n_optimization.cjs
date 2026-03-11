const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

const newEn = {
  optimization: {
    title: "Optimization Decisions",
    subtitle: "AI-driven strategy adjustments for {{product}}",
    guided_ops: {
      enter: "Enter Guided Ops",
      exit: "Exit Guided Ops",
      mode: "Guided Ops Mode",
      goal: "1. This Week's Goal",
      goal_value: "Maximize Organic Traffic",
      trajectory: "Current trajectory: +12% (Target: +15%)",
      actions: "2. Recommended Actions",
      expand: "Expand",
      expand_desc: "High ROI. Shift resources from STR-78.",
      pause: "Pause",
      pause_desc: "Underperforming for 2 weeks.",
      execute: "3. Execute & Review",
      one_click: "1-Click Execute",
      auto_postmortem: "Auto-postmortem scheduled for next cycle."
    },
    decision: {
      override: "Override",
      confirm: "Confirm",
      current_score: "Current Score",
      view_trend: "View Trend",
      threshold: "Threshold Match",
      window: "Consecutive Window",
      reallocation: "Reallocation",
      reasoning: "Reasoning"
    },
    types: {
      expand: "expand",
      iterate: "iterate",
      pause: "pause"
    }
  }
};

const newZh = {
  optimization: {
    title: "优化决策",
    subtitle: "{{product}} 的 AI 驱动策略调整",
    guided_ops: {
      enter: "进入引导操作",
      exit: "退出引导操作",
      mode: "引导操作模式",
      goal: "1. 本周目标",
      goal_value: "最大化自然流量",
      trajectory: "当前轨迹: +12% (目标: +15%)",
      actions: "2. 推荐操作",
      expand: "扩展",
      expand_desc: "高 ROI。从 STR-78 转移资源。",
      pause: "暂停",
      pause_desc: "连续 2 周表现不佳。",
      execute: "3. 执行与评估",
      one_click: "一键执行",
      auto_postmortem: "自动复盘已安排在下个周期。"
    },
    decision: {
      override: "覆盖",
      confirm: "确认",
      current_score: "当前评分",
      view_trend: "查看趋势",
      threshold: "阈值匹配",
      window: "连续窗口",
      reallocation: "资源重新分配",
      reasoning: "推理"
    },
    types: {
      expand: "扩展",
      iterate: "迭代",
      pause: "暂停"
    }
  }
};

Object.assign(en, newEn);
Object.assign(zh, newZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
