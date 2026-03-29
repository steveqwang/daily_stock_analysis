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
  // 只使用真实数据：优先 details 直接字段（后端已提取），无则为空
  const financialReport = (details?.financialReport && typeof details.financialReport === 'object' && Object.keys(details.financialReport).length > 0)
    ? details.financialReport as any
    : null;

  const dividendMetrics = (details?.dividendMetrics && typeof details.dividendMetrics === 'object' && Object.keys(details.dividendMetrics).length > 0)
    ? details.dividendMetrics as any
    : null;

  const belongBoards = (Array.isArray(details?.belongBoards) && details.belongBoards.length > 0)
    ? details.belongBoards as any[]
    : null;

  const sectorRankings = (details?.sectorRankings && typeof details.sectorRankings === 'object' && (
    (Array.isArray(details.sectorRankings.top) && details.sectorRankings.top.length > 0) ||
    (Array.isArray(details.sectorRankings.bottom) && details.sectorRankings.bottom.length > 0)
  ))
    ? details.sectorRankings as any
    : null;

  const hasAnyData = financialReport || dividendMetrics || belongBoards || sectorRankings;

  const labels = {
    zh: {
      fundamental: '基本面',
      noData: '暂无基本面数据，重新分析可获取',
      financialReport: '财务数据',
      reportDate: '报告期',
      revenue: '营业收入',
      netProfit: '归母净利润',
      operatingCashFlow: '经营现金流',
      roe: 'ROE',
      dividend: '分红指标',
      ttmDividend: 'TTM每股分红',
      ttmYield: 'TTM股息率',
      belongBoards: '所属板块',
      sectorRankings: '板块资金',
      topGainers: '净流入TOP',
      topLosers: '净流出TOP',
    },
    en: {
      fundamental: 'Fundamentals',
      noData: 'No fundamental data. Re-analyze to fetch.',
      financialReport: 'Financial Report',
      reportDate: 'Report Date',
      revenue: 'Revenue',
      netProfit: 'Net Profit',
      operatingCashFlow: 'Operating Cash Flow',
      roe: 'ROE',
      dividend: 'Dividend',
      ttmDividend: 'TTM Dividend/Share',
      ttmYield: 'TTM Yield',
      belongBoards: 'Sectors',
      sectorRankings: 'Sector Flow',
      topGainers: 'Top Inflow',
      topLosers: 'Top Outflow',
    },
  };

  const t = labels[language] || labels.zh;

  return (
    <Card variant="gradient" padding="md" className="animate-fade-in">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-foreground">{t.fundamental}</h3>
      </div>

      {!hasAnyData ? (
        <p className="text-sm text-secondary-text">{t.noData}</p>
      ) : (
        <div className="space-y-4">
          {/* 财务数据 */}
          {financialReport && (
            <div className="rounded-lg bg-surface/50 p-3">
              <p className="text-xs font-semibold text-secondary-text mb-2 uppercase tracking-wide">{t.financialReport}</p>
              <div className="space-y-2">
                {financialReport.report_date && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary-text">{t.reportDate}</span>
                    <span className="font-mono text-foreground">{String(financialReport.report_date)}</span>
                  </div>
                )}
                {financialReport.revenue != null && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary-text">{t.revenue}</span>
                    <span className="font-mono text-foreground">{formatCurrency(financialReport.revenue as number)}</span>
                  </div>
                )}
                {financialReport.net_profit_parent != null && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary-text">{t.netProfit}</span>
                    <span className={`font-mono ${Number(financialReport.net_profit_parent) >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatCurrency(financialReport.net_profit_parent as number)}
                    </span>
                  </div>
                )}
                {financialReport.operating_cash_flow != null && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary-text">{t.operatingCashFlow}</span>
                    <span className={`font-mono ${Number(financialReport.operating_cash_flow) >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatCurrency(financialReport.operating_cash_flow as number)}
                    </span>
                  </div>
                )}
                {financialReport.roe != null && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary-text">{t.roe}</span>
                    <span className="font-mono text-foreground">{formatPercent(financialReport.roe as number)}</span>
                  </div>
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
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary-text">{t.ttmDividend}</span>
                    <span className="font-mono text-foreground">{formatNumber(dividendMetrics.ttm_cash_dividend_per_share as number, 4)} 元</span>
                  </div>
                )}
                {dividendMetrics.ttm_dividend_yield_pct != null && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary-text">{t.ttmYield}</span>
                    <span className="font-mono text-foreground">{formatPercent(dividendMetrics.ttm_dividend_yield_pct as number)}</span>
                  </div>
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

          {/* 板块资金 */}
          {sectorRankings && (
            <div className="rounded-lg bg-surface/50 p-3">
              <p className="text-xs font-semibold text-secondary-text mb-2 uppercase tracking-wide">{t.sectorRankings}</p>
              <div className="grid grid-cols-2 gap-3">
                {Array.isArray(sectorRankings.top) && sectorRankings.top.length > 0 && (
                  <div>
                    <p className="text-xs text-success mb-1.5">{t.topGainers}</p>
                    {sectorRankings.top.slice(0, 3).map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs py-0.5">
                        <span className="text-secondary-text truncate">{item.name}</span>
                        <span className="text-success font-mono ml-1">{item.net_inflow != null ? formatCurrency(item.net_inflow) : formatPercent(item.change_pct)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {Array.isArray(sectorRankings.bottom) && sectorRankings.bottom.length > 0 && (
                  <div>
                    <p className="text-xs text-danger mb-1.5">{t.topLosers}</p>
                    {sectorRankings.bottom.slice(0, 3).map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs py-0.5">
                        <span className="text-secondary-text truncate">{item.name}</span>
                        <span className="text-danger font-mono ml-1">{item.net_inflow != null ? formatCurrency(item.net_inflow) : formatPercent(item.change_pct)}</span>
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
