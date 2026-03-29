# Phase-01 Iteration-001：环境初始化 & 首次试跑

## 基本信息
- 期数：001
- 日期：2026-03-28
- 阶段：phase-01（试运行）
- 负责人：Steve Wang

---

## 本期目标（需求视角）
1. 克隆项目，初始化 Python 环境
2. 配置 MiniMax API Key（新闻搜索）+ 国产 AI 模型（分析）
3. 启动 Web 界面，手动分析 1~2 只股票
4. 记录第一轮体验、速度、输出质量、问题

---

## 本期改动（技术视角）

### 环境初始化
```bash
cd /Users/stevewang/dev/daily_stock_analysis
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 配置文件
- 复制 `.env.example` → `.env`
- 填入：
  - `MINIMAX_API_KEYS=sk-api-U4KSkiEblraUK8gs_in4hjDzpWhqhi31HcAsF_RSf1-vXsQQyUyGsEH84_MCaD_zQSfnLKTvHM-4ew2d9foc6oNKRlTbN0nI0Oh50m8ya8oLUO3lSYI1XHk`
  - `LITELLM_MODEL=openai/deepseek-chat`（或 Ollama）
  - `STOCK_LIST=600519,000001`（茅台、平安）

### 启动命令
```bash
python main.py --webui-only
```

---

## 验证结果（事实证据）

### 待验证项
- [ ] 环境依赖安装成功
- [ ] `.env` 配置无语法错误
- [ ] Web 服务启动成功（`http://127.0.0.1:8000`）
- [ ] 首页能加载
- [ ] 手动分析 600519（茅台）完成
- [ ] 报告生成且可读
- [ ] 历史记录可查看
- [ ] 大盘复盘可运行

### 通过项
（待填）

### 失败项
（待填）

### 关键日志/截图位置
- 启动日志：`logs/`
- 首次分析报告：Web 历史记录

---

## 风险与影响

### 外部依赖
- MiniMax API（新闻搜索）：需要网络连接
- AI 模型 API（分析）：需要配置正确的 Base URL 和 Key
- 行情数据源（AkShare/Tushare）：需要网络连接

### 回归风险
- 无（首次试跑）

### 已知限制
- 非交易日可能无法获取实时行情
- 新闻搜索依赖 MiniMax 配额

---

## 决策记录

### 保留
- Web 工作台（便于观察和调试）
- 完整的分析流程（技术面 + 舆情 + 基本面）
- 历史记录功能

### 删除
- 暂无（先跑通再说）

### 延后
- 推送通知配置（先本地验证）
- 定时任务配置（先手动验证）
- Agent 策略问股（先看基础分析）

---

## 下期计划
- 完成本期所有验证项
- 记录第一轮体验反馈
- 评估输出质量是否符合预期
- 决定是否进入 Phase-02（调试成事实型输出）

