# 基本面分析模块集成 - 首页报告

## ✅ 完成内容

已成功在**首页股票分析报告中集成基本面分析模块**，用户在查看股票分析时可直接看到基本面信息。

## 📁 文件变更

### 新增
- `apps/dsa-web/src/components/report/ReportFundamental.tsx` - 基本面分析组件

### 修改
- `apps/dsa-web/src/components/report/ReportSummary.tsx` - 集成基本面模块
- `apps/dsa-web/src/components/report/index.ts` - 导出基本面组件

## 📊 基本面模块包含内容

### 1. 财务报告 (Financial Report)
- 报告期 (Report Date)
- 营业收入 (Revenue)
- 归母净利润 (Net Profit)
- 经营现金流 (Operating Cash Flow)
- ROE (Return on Equity)

### 2. 分红指标 (Dividend Metrics)
- TTM每股分红 (TTM Dividend Per Share)
- TTM分红收益率 (TTM Dividend Yield)

### 3. 所属板块 (Related Sectors)
- 显示股票所属的行业/板块标签
- 支持多个板块展示

### 4. 板块涨跌 (Sector Performance)
- 涨幅TOP板块 (Top Gainers)
- 跌幅TOP板块 (Top Losers)
- 显示涨跌幅百分比

## 🎨 设计特点

- ✓ 卡片式设计，与现有报告风格一致
- ✓ 响应式布局
- ✓ 数据格式化：
  - 货币：自动转换为 B/M/K 单位
  - 百分比：保留2位小数
  - 日期：原始格式显示
- ✓ 颜色编码：
  - 涨幅：绿色 (success)
  - 跌幅：红色 (danger)
- ✓ 多语言支持 (中文/英文)
- ✓ 智能显示：无数据时自动隐藏

## 📍 报告展示顺序

```
1. 概览区 (ReportOverview)
   ↓
2. 策略点位区 (ReportStrategy)
   ↓
3. 基本面分析区 (ReportFundamental) ← 新增
   ↓
4. 资讯区 (ReportNews)
   ↓
5. 透明度与追溯区 (ReportDetails)
   ↓
6. 分析模型标记
```

## 🔄 数据流

```
API Response (AnalysisReport)
    ↓
ReportSummary (主容器)
    ↓
ReportFundamental (基本面模块)
    ├── details.financialReport
    ├── details.dividendMetrics
    ├── details.belongBoards
    └── details.sectorRankings
```

## 💡 后端集成要求

为了显示基本面数据，后端需要在 `ReportDetails` 中提供以下字段：

```typescript
interface ReportDetails {
  financialReport?: {
    report_date?: string;
    revenue?: number;
    net_profit_parent?: number;
    operating_cash_flow?: number;
    roe?: number;
  };
  dividendMetrics?: {
    ttm_cash_dividend_per_share?: number;
    ttm_dividend_yield_pct?: number;
  };
  belongBoards?: Array<{
    name: string;
    code?: string;
    type?: string;
  }>;
  sectorRankings?: {
    top?: Array<{ name: string; changePct?: number }>;
    bottom?: Array<{ name: string; changePct?: number }>;
  };
}
```

## 🚀 使用方式

1. **重启 Web 服务**
   ```bash
   python main.py --webui
   ```

2. **访问首页**
   ```
   http://localhost:8000
   ```

3. **进行股票分析**
   - 输入股票代码（如 600519）
   - 点击"分析"按钮
   - 查看报告中的基本面分析模块

## ✨ 特色功能

- ✓ 自动格式化数据显示
- ✓ 智能单位转换（B/M/K）
- ✓ 颜色编码涨跌
- ✓ 多语言支持
- ✓ 无数据时自动隐藏
- ✓ 响应式布局
- ✓ 与现有设计风格一致

## 📝 代码示例

### 组件使用
```tsx
<ReportFundamental 
  details={details} 
  language="zh" 
/>
```

### 数据格式化
```tsx
formatCurrency(5000000000)  // → "5.00B"
formatPercent(25.5)         // → "25.50%"
formatNumber(1.234, 4)      // → "1.2340"
```

## 🔍 验证清单

- [ ] 重启 Web 服务
- [ ] 访问首页进行股票分析
- [ ] 查看报告中是否显示基本面模块
- [ ] 验证数据格式化是否正确
- [ ] 测试多语言切换
- [ ] 验证响应式布局

## 📌 注意事项

- 当前使用模拟数据演示，需要后端 API 提供真实数据
- 基本面模块会自动根据数据可用性显示/隐藏
- 所有数据格式化都在前端进行，无需后端处理
- 支持中文和英文两种语言

## 🎯 下一步

1. 后端在分析流程中调用 `AkshareFundamentalAdapter`
2. 将基本面数据添加到 `ReportDetails` 中
3. 实现 fail-open 降级逻辑
4. 前端会自动显示基本面信息

