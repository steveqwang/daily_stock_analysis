# 基本面分析页面 - 快速开始

## 🎯 已完成

✅ 创建了完整的基本面分析页面  
✅ 集成到 Web 界面导航  
✅ 支持 8 大基本面维度展示  
✅ 响应式设计（移动端/平板/桌面）  
✅ 参考现有页面设计风格  

## 📁 新增/修改文件

### 新增
- `apps/dsa-web/src/pages/FundamentalPage.tsx` - 基本面分析页面

### 修改
- `apps/dsa-web/src/App.tsx` - 添加路由
- `apps/dsa-web/src/components/layout/SidebarNav.tsx` - 添加导航菜单

## 🚀 如何使用

### 1. 启动 Web 服务
```bash
cd /Users/stevewang/dev/daily_stock_analysis
python main.py --webui
```

### 2. 访问页面
打开浏览器访问：`http://localhost:8000`

### 3. 导航到基本面分析
- 点击左侧边栏的"基本面"菜单
- 或直接访问：`http://localhost:8000/fundamental`

### 4. 查看基本面数据
- 输入股票代码（如 600519、AAPL）
- 点击"分析"按钮
- 查看完整的基本面分析数据

## 📊 页面包含的数据维度

| 维度 | 包含指标 |
|------|---------|
| **估值指标** | PE、PB、PS |
| **增长指标** | 营收同比、净利润同比、ROE、毛利率 |
| **财务报告** | 营收、净利润、经营现金流、ROE |
| **分红指标** | TTM分红、分红收益率、历史分红事件 |
| **机构持仓** | 机构持仓变化、前十大股东变化 |
| **资金流向** | 主力净流入、5日/10日净流入 |
| **板块排名** | 板块资金TOP、板块涨跌TOP |
| **龙虎榜** | 是否上榜、上榜次数、最近上榜日期 |

## 🔧 后续集成步骤

### 后端集成（Python）
1. 在 `src/analyzer.py` 中调用基本面适配器
2. 实现 fail-open 降级逻辑
3. 创建 API 端点：`GET /api/v1/fundamental/{stock_code}`

### 前端集成（TypeScript/React）
1. 在 `FundamentalPage.tsx` 中替换模拟数据为真实 API 调用
2. 添加缓存机制
3. 支持数据刷新

## 💡 设计参考

页面设计参考了现有页面：
- **首页** (HomePage)：搜索栏、历史记录、报告展示
- **回测页** (BacktestPage)：卡片布局、数据表格、性能指标

## 🎨 UI 特点

- ✨ 深色主题支持（浅色/深色主题切换）
- 📱 完全响应式设计
- 🎯 清晰的数据层级
- 🔢 智能数据格式化（百分比、货币、数字）
- 🎨 颜色编码（正数绿、负数红）

## 📝 模拟数据说明

当前页面使用模拟数据演示，实际使用时需要：

1. 后端提供真实数据接口
2. 前端调用 API 获取数据
3. 实现缓存和错误处理

## 🔗 相关文件

- 详细实现说明：`FUNDAMENTAL_PAGE_IMPLEMENTATION.md`
- 基本面适配器：`data_provider/fundamental_adapter.py`
- API 规范：`docs/architecture/api_spec.json`

## ❓ 常见问题

**Q: 为什么看不到真实数据？**  
A: 当前使用模拟数据。需要后端 API 支持才能显示真实数据。

**Q: 如何自定义显示的指标？**  
A: 修改 `FundamentalPage.tsx` 中的 `FundamentalData` 接口和渲染逻辑。

**Q: 支持哪些股票市场？**  
A: 支持 A股、港股、美股（取决于后端数据源）。

## 📞 需要帮助？

查看详细文档：`FUNDAMENTAL_PAGE_IMPLEMENTATION.md`
