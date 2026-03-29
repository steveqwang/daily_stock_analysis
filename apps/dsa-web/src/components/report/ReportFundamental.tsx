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
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(0);
};

const formatPercent = (value?: number | string): string => {
  if (value === undefined || value === null || value === '') return '--';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '--';
  return `${num.toFixed(2)}%`;
};

/**
 * 从 contextSnapshot 中提取基本面数据
 */
const extractFundamentalFromContext = (contextSnapshot: any): { financialReport?: any; dividendMetrics?: any } => {
  if (!contextSnapshot) return {};
  
  try {
    const snapshot = typeof contextSnapshot === 'string' ? JSON.parse(contextSnapshot) : contextSnapshot;
    const enhancedContext = snapshot?.enhanced_context;
    const fundamentalContext = enhancedContext?.fundamental_context;
    
    if (!fundamentalContext) return {};
    
    const earnings = fundamentalContext.earnings;
    if (!earnings || !earnings.payload) return {};
    
    return {
      financialReport: earnings.payload?.financial_report,
      dividendMetrics: earnings.payload?.dividend,
    };
  } catch (e) {
    console.debug('Failed to extract fundamental data from context:', e);
    return {};
  }
};

// Mock data for demonstration
const MOCK_FUNDAMENTAL_DATA = {
  financialReport: {
    report_date: '2024-12-31',
    revenue: 5000000000,
    net_profit_parent: 800000000,
    operating_cash_flow: 600000000,
    roe: 18.5,
  },
  dividendMetrics: {
    ttm_cash_dividend_per_share: 1.0,
    ttm_dividend_yield_pct: 2.5,
  },
  belongBoards: [
    { name: '电子' },
    { name: '计算机' },
    { name: '消费' },
  ],
  sectorRankings: {
    top: [
      { name: '电子', change_pct: 3.5 },
      { name: '计算机', change_pct: 2.8 },
    ],
    bottom: [
      { name: '房地产', change_pct: -2.1 },
      { name: '煤炭', change_pct: -1.8 },
    ],
  },
};

export const ReportFundamental: React.FC<ReportFundamentalProps> = ({
  details,
  language = 'zh',
}) => {
  // 优先从 contextSnapshot 中提取真实数据，其次使用 details 中的数据，最后使用 mock 数据
  const contextExtracted = extractFundamentalFromContext(details?.contextSnapshot);
  
  const fundamentalData = {
    financialReport: 
      (contextExtracted.financialReport && Object.keys(contextExtracted.financialReport).length > 0)
        ? contextExtracted.financialReport
        : (details?.financialReport && Object.keys(details.financialReport).length > 0)
          ? details.financialReport
          : MOCK_FUNDAMENTAL_DATA.financialReport,
    dividendMetrics: 
      (contextExtracted.dividendMetrics && Object.keys(contextExtracted.dividendMetrics).length > 0)
        ? contextExtracted.dividendMetrics
        : (details?.dividendMetrics && Object.keys(details.dividendMetrics).length > 0)
          ? details.dividendMetrics
          : MOCK_FUNDAMENTAL_DATA.dividendMetrics,
    belongBoards: 
      (details?.belongBoards && details.belongBoards.length > 0)
        ? details.belongBoards
        : MOCK_FUNDAMENTAL_DATA.belongBoards,
    sectorRankings: 
      (details?.sectorRankings && (
        (details.sectorRankings.top && details.sectorRankings.top.length > 0) ||
        (details.sectorRankings.bottom && details.sectorRankings.bottom.length > 0)
      ))
        ? details.sectorRankings
        : MOCK_FUNDAMENTAL_DATA.sectorRankings,
  };

  const hasFinancialReport = fundamentalData?.financialReport && typeof fundamentalData.financialReport === 'object' && Object.keys(fundamentalData.financialReport).length > 0;
  const hasDividendMetrics = fundamentalData?.dividendMetrics && typeof fundamentalData.dividendMetrics === 'object' && Object.keys(fundamentalData.dividendMetrics).length > 0;
  const hasBoards = Array.isArray(fundamentalData?.belongBoards) && fundamentalData.belongBoards.length > 0;
  const hasSectorRankings = fundamentalData?.sectorRankings && typeof fundamentalData.sectorRankings === 'object' && (
    (Array.isArray(fundamentalData.sectorRankings.top) && fundamentalData.sectorRankings.top.length > 0) ||
    (Array.isArray(fundamentalData.sectorRankings.bottom) && fundamentalData.sectorRankings.bottom.length > 0)
  );

  if (!hasFinancialReport && !hasDividendMetrics && !hasBoards && !hasSectorRankings) {
    return null;
  }

  const labels = {
    zh: {
      fundamental: '基本面分析',
      financialReport: '财务报告',
      reportDate: '报告期',
      revenue: '营业收入',
      netProfit: '归母净利润',
      operatingCashFlow: '经营现金流',
      roe: 'ROE',
      dividend: '分红指标',
      ttmDividend: 'TTM每股分红',
      ttmYield: 'TTM分红收益率',
      belongBoards: '所属板块',
      sectorRankings: '板块涨跌',
      topGainers: '涨幅TOP',
      topLosers: '跌幅TOP',
    },
    en: {
      fundamental: 'Fundamental Analysis',
      financialReport: 'Financial Report',
      reportDate: 'Report Date',
      revenue: 'Revenue',
      netProfit: 'Net Profit',
      operatingCashFlow: 'Operating Cash Flow',
      roe: 'ROE',
      dividend: 'Dividend Metrics',
      ttmDividend: 'TTM Dividend Per Share',
      ttmYield: 'TTM Dividend Yield',
      belongBoards: 'Related Sectors',
      sectorRankings: 'Sector Performance',
      topGainers: 'Top Gainers',
      topLosers: 'Top Losers',
    },
  };

  const t = labels[language] || labels.zh;

  return (
    <Card variant="gradient" padding="md" className="animate-fade-in">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{t.fundamental}</h3>
      </div>

      <div className="space-y-4">
        {/* 财务报告 */}
        {hasFinancialReport && (
          <div className="rounded-lg bg-surface/50 p-3">
            <p className="text-xs font-semibold text-secondary-text mb-2 uppercase">{t.financialReport}</p>
            <div className="space-y-2">
              {(fundamentalData.financialReport as any)?.report_date && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-text">{t.reportDate}</span>
                  <span className="font-mono text-foreground">{String((fundamentalData.financialReport as any).report_date)}</span>
                </div>
              )}
              {(fundamentalData.financialReport as any)?.revenue && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-text">{t.revenue}</span>
                  <span className="font-mono text-foreground">{formatCurrency((fundamentalData.financialReport as any).revenue as number)}</span>
                </div>
              )}
              {(fundamentalData.financialReport as any)?.net_profit_parent && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-text">{t.netProfit}</span>
                  <span className="font-mono text-foreground">{formatCurrency((fundamentalData.financialReport as any).net_profit_parent as number)}</span>
                </div>
              )}
              {(fundamentalData.financialReport as any)?.operating_cash_flow && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-text">{t.operatingCashFlow}</span>
                  <span className="font-mono text-foreground">{formatCurrency((fundamentalData.financialReport as any).operating_cash_flow as number)}</span>
                </div>
              )}
              {(fundamentalData.financialReport as any)?.roe && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-text">{t.roe}</span>
                  <span className="font-mono text-foreground">{formatPercent((fundamentalData.financialReport as any).roe as number)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 分红指标 */}
        {hasDividendMetrics && (
          <div className="rounded-lg bg-surface/50 p-3">
            <p className="text-xs font-semibold text-secondary-text mb-2 uppercase">{t.dividend}</p>
            <div className="space-y-2">
              {(fundamentalData.dividendMetrics as any)?.ttm_cash_dividend_per_share && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-text">{t.ttmDividend}</span>
                  <span className="font-mono text-foreground">{formatNumber((fundamentalData.dividendMetrics as any).ttm_cash_dividend_per_share as number, 4)} 元</span>
                </div>
              )}
              {(fundamentalData.dividendMetrics as any)?.ttm_dividend_yield_pct && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-text">{t.ttmYield}</span>
                  <span className="font-mono text-foreground">{formatPercent((fundamentalData.dividendMetrics as any).ttm_dividend_yield_pct as number)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 所属板块 */}
        {hasBoards && (
          <div className="rounded-lg bg-surface/50 p-3">
            <p className="text-xs font-semibold text-secondary-text mb-2 uppercase">{t.belongBoards}</p>
            <div className="flex flex-wrap gap-1.5">
              {(fundamentalData.belongBoards as any)?.map((board: any, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                >
                  {board.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 板块涨跌 */}
        {hasSectorRankings && (
          <div className="rounded-lg bg-surface/50 p-3">
            <p className="text-xs font-semibold text-secondary-text mb-2 uppercase">{t.sectorRankings}</p>
            <div className="grid grid-cols-2 gap-3">
              {(fundamentalData.sectorRankings as any)?.top && (fundamentalData.sectorRankings as any).top.length > 0 && (
                <div>
                  <p className="text-xs text-success mb-1.5">{t.topGainers}</p>
                  {(fundamentalData.sectorRankings as any).top.slice(0, 3).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-0.5">
                      <span className="text-secondary-text truncate">{item.name}</span>
                      <span className="text-success font-mono ml-1">{formatPercent(item.change_pct)}</span>
                    </div>
                  ))}
                </div>
              )}
              {(fundamentalData.sectorRankings as any)?.bottom && (fundamentalData.sectorRankings as any).bottom.length > 0 && (
                <div>
                  <p className="text-xs text-danger mb-1.5">{t.topLosers}</p>
                  {(fundamentalData.sectorRankings as any).bottom.slice(0, 3).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-0.5">
                      <span className="text-secondary-text truncate">{item.name}</span>
                      <span className="text-danger font-mono ml-1">{formatPercent(item.change_pct)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
