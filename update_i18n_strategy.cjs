const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));

en.strategy.override_reason_prompt = "Please provide a reason for overriding this strategy's priority:";
en.strategy.override_applied = "Override applied successfully.";
en.strategy.compare_strategies = "Select 2-3 strategies to compare.";
en.strategy.compare_limit = "You can only compare up to 3 strategies.";
en.strategy.view_history = "Viewing strategy portfolio history.";
en.strategy.insufficient_candidates = "Less than 3 candidates available. Showing existing candidates.";
en.strategy.conflict_warning = "Resource conflict detected. Please select one strategy to proceed.";
en.strategy.approved = "Approved";

zh.strategy.override_reason_prompt = "请提供覆盖此策略优先级的理由：";
zh.strategy.override_applied = "覆盖应用成功。";
zh.strategy.compare_strategies = "请选择 2-3 个策略进行对比。";
zh.strategy.compare_limit = "最多只能选择 3 个策略进行对比。";
zh.strategy.view_history = "查看策略组合历史。";
zh.strategy.insufficient_candidates = "可用候选少于 3 个。显示现有候选。";
zh.strategy.conflict_warning = "检测到资源冲突。请选择一个策略继续。";
zh.strategy.approved = "已批准";

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
