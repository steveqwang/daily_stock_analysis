import React from 'react';
import { Card } from '../common';
import type { ReportDetails } from '../../types/analysis';

interface ReportFundamentalProps {
  details?: ReportDetails | any;
  language?: 'zh' | 'en';
}

const formatNumber = (value?: number | string, decimals = 2): string => {
  if (value === undefined || value === null || value === '') return '--';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '--';
  return num.toFixed(decimals);
};

const formatCurrency = (value?: number | string): string => {
  if (value === undefined || value === null || value === '') return '--';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '--';
  if (Math.abs(num) >= 1e8) return `${(num / 1e8).toFixed(2)}亿`;
  if (Math.abs(num) >= 1e4) return `${(num / 1e4).toFixed(2)}万`;
  return num.toFixed(0);
};

const formatPercent = (value?: number | string): string => {
  if (value === undefined || value === null || value === '') return '--';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '--';
  return `${num.toFixed(2)}%`;
};

export const ReportFundamental: React.FC<ReportFundamentalProps> = ({
  details,
  language = 'zh',
}) => {
  // 直接提取字段（后端已提取到 details 顶层）
  const financialReport = (details?.financialReport && typeof details.financialReport === 'object' && Object.keys(details.financialReport).length > 0)
    ? details.financialReport as any
    : null;

  const dividendMetrics = (details?.dividendMetrics && typeof details.dividendMetrics === 'object' && Object.keys(details.dividendMetrics).length > 0)
    ? details.dividendMetrics as any
    : null;

  const belongBoards = (Array.isArray(details?.belongBoards) && details.belongBoards.length > 0)
    ? details.belongBoards as any[]
    : null;

  // 从 contextSnapshot 提取更丰富的基本面数据
  const fc = details?.contextSnapshot?.enhanced_context?.fundamental_context as any;

  // 优先用 capital_flow 里的 sector_rankings（含 net_inflow），其次用顶层 sectorRankings（含 change_pct）
  const capitalFlowSectorRankings = fc?.capital_flow?.data?.sector_rankings ?? null;
  const sectorRankings = (() => {
    const src = capitalFlowSectorRankings ?? details?.sectorRankings;
    if (!src || typeof src !== 'object') return null;
    if ((Array.isArray(src.top) && src.top.length > 0) || (Array.isArray(src.bottom) && src.bottom.length > 0)) return src as any;
    return null;
  })();
  const valuation = fc?.valuation?.data ?? null;
  const growth = fc?.growth?.data ?? null;
  const capitalFlow = fc?.capital_flow?.data ?? null;
  const dragonTiger = fc?.dragon_tiger?.data ?? null;

  const hasAnyData = financialReport || dividendMetrics || belongBoards || sectorRankings || valuation || growth;

  const labels = {
    zh: {
      fundamental: '基本面',
      noData: '暂无基本面数据，重新分析可获取',
      valuation: '估值指标',
      pe: '市盈率(PE)',
      pb: '市净率(PB)',
      totalMv: '总市值',
      financialReport: '财务数据',
      reportDate: '报告期',
      revenue: '营业收入',
      netProfit: '归母净利润',
      operatingCashFlow: '经营现金流',
      roe: 'ROE',
      growth: '成长能力',
      revenueYoy: '营收同比',
      netProfitYoy: '净利润同比',
      grossMargin: '毛利率',
      capitalFlow: '资金动向',
      mainNetInflow: '主力净流入',
      dragonTiger: '龙虎榜',
      dtCount: '近期上榜',
      dtLatest: '最近上榜日',
      dividend: '分红指标',
      ttmDividend: 'TTM每股分红',
      ttmYield: 'TTM股息率',
      belongBoards: '所属板块',
      sectorRankings: '板块涨跌榜',
      topGainers: '涨幅TOP',
      topLosers: '跌幅TOP',
    },
    en: {
      fundamental: 'Fundamentals',
      noData: 'No fundamental data. Re-analyze to fetch.',
      valuation: 'Valuation',
      pe: 'PE Ratio',
      pb: 'PB Ratio',
      totalMv: 'Market Cap',
      financialReport: 'Financial Report',
      reportDate: 'Report Date',
      revenue: 'Revenue',
      netProfit: 'Net Profit',
      operatingCashFlow: 'Operating CF',
      roe: 'ROE',
      growth: 'Growth',
      revenueYoy: 'Revenue YoY',
      netProfitYoy: 'Net Profit YoY',
      grossMargin: 'Gross Margin',
      capitalFlow: 'Capital Flow',
      mainNetInflow: 'Main Net Inflow',
      dragonTiger: 'Dragon Tiger',
      dtCount: 'Recent Listed',
      dtLatest: 'Latest Date',
      dividend: 'Dividend',
      ttmDividend: 'TTM Div/Share',
      ttmYield: 'TTM Yield',
      belongBoards: 'Sectors',
      sectorRankings: 'Sector Ranking',
      topGainers: 'Top Gainers',
      topLosers: 'Top Losers',
    },
  };

  const t = labels[language] || labels.zh;

  // 带颜色的数值行
  const Row = ({ label, value, colored = false, reverse = false }: { label: string; value: string; colored?: boolean; reverse?: boolean }) => {
    let colorClass = 'text-foreground';
    if (colored) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        colorClass = (reverse ? num <= 0 : num >= 0) ? 'text-success' : 'text-danger';
      }
    }
    return (
      <div className="flex justify-between items-center text-sm">
        <span className="text-secondary-text">{label}</span>
        <span className={`font-mono ${colorClass}`}>{value}</span>
      </div>
    );
  };

  return (
    <Card variant="gradient" padding="md" className="animate-fade-in">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-foreground">{t.fundamental}</h3>
      </div>

      {!hasAnyData ? (
        <p className="text-sm text-secondary-text">{t.noData}</p>
      ) : (
        <div className="space-y-4">

          {/* 估值指标 */}
          {valuation && (
            <div className="rounded-lg bg-surface/50 p-3">
              <p className="text-xs font-semibold text-secondary-text mb-2 uppercase tracking-wide">{t.valuation}</p>
              <div className="grid grid-cols-3 gap-2">
                {valuation.pe_ratio != null && (
                  <div className="text-center">
                    <p className="text-xs text-secondary-text">{t.pe}</p>
                    <p className="font-mono text-sm text-foreground font-semibold">{formatNumber(valuation.pe_ratio)}x</p>
                  </div>
                )}
                {valuation.pb_ratio != null && (
                  <div className="text-center">
                    <p className="text-xs text-secondary-text">{t.pb}</p>
                    <p className="font-mono text-sm text-foreground font-semibold">{formatNumber(valuation.pb_ratio)}x</p>
                  </div>
                )}
                {valuation.total_mv != null && (
                  <div className="text-center">
                    <p className="text-xs text-secondary-text">{t.totalMv}</p>
                    <p className="font-mono text-sm text-foreground font-semibold">{formatCurrency(valuation.total_mv)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 财务数据 */}
          {financialReport && (
            <div className="rounded-lg bg-surface/50 p-3">
              <p className="text-xs font-semibold text-secondary-text mb-2 uppercase tracking-wide">{t.financialReport}</p>
              <div className="space-y-2">
                {financialReport.report_date && (
                  <Row label={t.reportDate} value={String(financialReport.report_date)} />
                )}
                {financialReport.revenue != null && (
                  <Row label={t.revenue} value={formatCurrency(financialReport.revenue)} />
                )}
                {financialReport.net_profit_parent != null && (
                  <Row label={t.netProfit} value={formatCurrency(financialReport.net_profit_parent)} colored />
                )}
                {financialReport.operating_cash_flow != null && (
                  <Row label={t.operatingCashFlow} value={formatCurrency(financialReport.operating_cash_flow)} colored />
                )}
                {financialReport.roe != null && (
                  <Row label={t.roe} value={formatPercent(financialReport.roe)} />
                )}
              </div>
            </div>
          )}

          {/* 成长能力 */}
          {growth && (
            <div className="rounded-lg bg-surface/50 p-3">
              <p className="text-xs font-semibold text-secondary-text mb-2 uppercase tracking-wide">{t.growth}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {growth.revenue_yoy != null && (
                  <Row label={t.revenueYoy} value={formatPercent(growth.revenue_yoy)} colored />
                )}
                {growth.net_profit_yoy != null && (
                  <Row label={t.netProfitYoy} value={formatPercent(growth.net_profit_yoy)} colored />
                )}
                {growth.gross_margin != null && (
                  <Row label={t.grossMargin} value={formatPercent(growth.gross_margin)} />
                )}
                {growth.roe != null && (
                  <Row label={t.roe} value={formatPercent(growth.roe)} />
                )}
              </div>
            </div>
          )}

          {/* 资金动向 */}
          {capitalFlow && (
            <div className="rounded-lg bg-surface/50 p-3">
              <p className="text-xs font-semibold text-secondary-text mb-2 uppercase tracking-wide">{t.capitalFlow}</p>
              <div className="space-y-2">
                {capitalFlow.stock_flow?.main_net_inflow != null && (
                  <Row
                    label={t.mainNetInflow}
                    value={formatCurrency(capitalFlow.stock_flow.main_net_inflow)}
                    colored
                  />
                )}
                {capitalFlow.stock_flow?.inflow_5d != null && (
                  <Row
                    label="5日净流入"
                    value={formatCurrency(capitalFlow.stock_flow.inflow_5d)}
                    colored
                  />
                )}
                {capitalFlow.stock_flow?.inflow_10d != null && (
                  <Row
                    label="10日净流入"
                    value={formatCurrency(capitalFlow.stock_flow.inflow_10d)}
                    colored
                  />
                )}
              </div>
            </div>
          )}

          {/* 分红指标 */}
          {dividendMetrics && (
            <div className="rounded-lg bg-surface/50 p-3">
              <p className="text-xs font-semibold text-secondary-text mb-2 uppercase tracking-wide">{t.dividend}</p>
              <div className="space-y-2">
                {dividendMetrics.ttm_cash_dividend_per_share != null && (
                  <Row label={t.ttmDividend} value={`${formatNumber(dividendMetrics.ttm_cash_dividend_per_share, 4)} 元`} />
                )}
                {dividendMetrics.ttm_dividend_yield_pct != null && (
                  <Row label={t.ttmYield} value={formatPercent(dividendMetrics.ttm_dividend_yield_pct)} />
                )}
              </div>
            </div>
          )}

          {/* 龙虎榜 */}
          {dragonTiger && dragonTiger.recent_count > 0 && (
            <div className="rounded-lg bg-surface/50 p-3">
              <p className="text-xs font-semibold text-secondary-text mb-2 uppercase tracking-wide">{t.dragonTiger}</p>
              <div className="space-y-2">
                <Row label={t.dtCount} value={`${dragonTiger.recent_count} 次`} />
                {dragonTiger.latest_date && (
                  <Row label={t.dtLatest} value={String(dragonTiger.latest_date)} />
                )}
              </div>
            </div>
          )}

          {/* 所属板块 */}
          {belongBoards && (
            <div className="rounded-lg bg-surface/50 p-3">
              <p className="text-xs font-semibold text-secondary-text mb-2 uppercase tracking-wide">{t.belongBoards}</p>
              <div className="flex flex-wrap gap-1.5">
                {belongBoards.map((board: any, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                  >
                    {board.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 板块涨跌榜 */}
          {sectorRankings && (
            <div className="rounded-lg bg-surface/50 p-3">
              <p className="text-xs font-semibold text-secondary-text mb-2 uppercase tracking-wide">{t.sectorRankings}</p>
              <div className="grid grid-cols-2 gap-3">
                {Array.isArray(sectorRankings.top) && sectorRankings.top.length > 0 && (
                  <div>
                    <p className="text-xs text-success mb-1.5">{t.topGainers}</p>
                    {sectorRankings.top.slice(0, 5).map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs py-0.5">
                        <span className="text-secondary-text truncate">{item.name}</span>
                        <span className="text-success font-mono ml-1">
                          {item.net_inflow != null ? formatCurrency(item.net_inflow) : formatPercent(item.change_pct)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {Array.isArray(sectorRankings.bottom) && sectorRankings.bottom.length > 0 && (
                  <div>
                    <p className="text-xs text-danger mb-1.5">{t.topLosers}</p>
                    {sectorRankings.bottom.slice(0, 5).map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs py-0.5">
                        <span className="text-secondary-text truncate">{item.name}</span>
                        <span className="text-danger font-mono ml-1">
                          {item.net_inflow != null ? formatCurrency(item.net_inflow) : formatPercent(item.change_pct)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </Card>
  );
};
