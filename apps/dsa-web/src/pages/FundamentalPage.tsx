import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { ApiErrorAlert, Card, Badge, EmptyState } from '../components/common';
import { StockAutocomplete } from '../components/StockAutocomplete';
import type { ParsedApiError } from '../api/error';
import { getParsedApiError } from '../api/error';

interface FundamentalData {
  stock_code: string;
  stock_name: string;
  valuation?: {
    pe?: number;
    pb?: number;
    ps?: number;
  };
  growth?: {
    revenue_yoy?: number;
    net_profit_yoy?: number;
    roe?: number;
    gross_margin?: number;
  };
  earnings?: {
    financial_report?: {
      report_date?: string;
      revenue?: number;
      net_profit_parent?: number;
      operating_cash_flow?: number;
      roe?: number;
    };
    dividend?: {
      events?: Array<{
        event_date: string;
        cash_dividend_per_share: number;
        is_pre_tax: boolean;
      }>;
      ttm_cash_dividend_per_share?: number;
      ttm_dividend_yield_pct?: number;
    };
  };
  institution?: {
    institution_holding_change?: number;
    top10_holder_change?: number;
  };
  capital_flow?: {
    stock_flow?: {
      main_net_inflow?: number;
      inflow_5d?: number;
      inflow_10d?: number;
    };
    sector_rankings?: {
      top?: Array<{ name: string; net_inflow: number }>;
      bottom?: Array<{ name: string; net_inflow: number }>;
    };
  };
  dragon_tiger?: {
    is_on_list?: boolean;
    recent_count?: number;
    latest_date?: string;
  };
  boards?: {
    data?: {
      top?: Array<{ name: string; change_pct: number }>;
      bottom?: Array<{ name: string; change_pct: number }>;
    };
  };
}

const FundamentalPage: React.FC = () => {
  useEffect(() => {
    document.title = '基本面分析 - DSA';
  }, []);

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ParsedApiError | null>(null);
  const [fundamentalData, setFundamentalData] = useState<FundamentalData | null>(null);

  const fetchFundamentalData = useCallback(async (stockCode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API endpoint when available
      // const response = await fetch(`/api/v1/fundamental/${stockCode}`);
      // const data = await response.json();
      // setFundamentalData(data);
      
      // Mock data for now
      setFundamentalData({
        stock_code: stockCode,
        stock_name: '示例股票',
        valuation: {
          pe: 25.5,
          pb: 3.2,
          ps: 2.1,
        },
        growth: {
          revenue_yoy: 15.3,
          net_profit_yoy: 22.5,
          roe: 18.5,
          gross_margin: 35.2,
        },
        earnings: {
          financial_report: {
            report_date: '2024-12-31',
            revenue: 5000000000,
            net_profit_parent: 800000000,
            operating_cash_flow: 600000000,
            roe: 18.5,
          },
          dividend: {
            events: [
              {
                event_date: '2024-06-15',
                cash_dividend_per_share: 0.5,
                is_pre_tax: true,
              },
            ],
            ttm_cash_dividend_per_share: 1.0,
            ttm_dividend_yield_pct: 2.5,
          },
        },
        institution: {
          institution_holding_change: 2.5,
          top10_holder_change: -1.2,
        },
        capital_flow: {
          stock_flow: {
            main_net_inflow: 50000000,
            inflow_5d: 30000000,
            inflow_10d: 80000000,
          },
          sector_rankings: {
            top: [
              { name: '电子', net_inflow: 500000000 },
              { name: '计算机', net_inflow: 450000000 },
            ],
            bottom: [
              { name: '房地产', net_inflow: -300000000 },
              { name: '煤炭', net_inflow: -250000000 },
            ],
          },
        },
        dragon_tiger: {
          is_on_list: true,
          recent_count: 3,
          latest_date: '2024-12-20',
        },
        boards: {
          data: {
            top: [
              { name: '电子', change_pct: 3.5 },
              { name: '计算机', change_pct: 2.8 },
            ],
            bottom: [
              { name: '房地产', change_pct: -2.1 },
              { name: '煤炭', change_pct: -1.8 },
            ],
          },
        },
      });
    } catch (err) {
      setError(getParsedApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    (stockCode?: string) => {
      if (stockCode) {
        void fetchFundamentalData(stockCode);
        setQuery('');
      }
    },
    [fetchFundamentalData],
  );

  const formatNumber = (value?: number, decimals = 2): string => {
    if (value === undefined || value === null) return '--';
    return value.toFixed(decimals);
  };

  const formatCurrency = (value?: number): string => {
    if (value === undefined || value === null) return '--';
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    return value.toFixed(0);
  };

  const formatPercent = (value?: number): string => {
    if (value === undefined || value === null) return '--';
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-full flex flex-col rounded-[1.5rem] bg-transparent">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-white/5 px-3 py-3 sm:px-4">
        <div className="flex max-w-5xl flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <StockAutocomplete
              value={query}
              onChange={setQuery}
              onSubmit={(stockCode) => {
                handleSubmit(stockCode);
              }}
              placeholder="输入股票代码或名称，如 600519、贵州茅台、AAPL"
              disabled={isLoading}
            />
          </div>
          <button
            type="button"
            onClick={() => handleSubmit(query)}
            disabled={!query || isLoading}
            className="btn-primary flex h-10 flex-shrink-0 items-center gap-1.5 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                分析中
              </>
            ) : (
              '分析'
            )}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        {error ? (
          <ApiErrorAlert error={error} className="mb-4" />
        ) : null}

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-secondary-text text-sm">加载基本面数据中...</p>
            </div>
          </div>
        ) : fundamentalData ? (
          <div className="max-w-6xl space-y-4 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {fundamentalData.stock_name}
                </h1>
                <p className="text-sm text-secondary-text">{fundamentalData.stock_code}</p>
              </div>
            </div>

            {/* Valuation Section */}
            {fundamentalData.valuation && (
              <Card variant="gradient" padding="md">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-foreground">估值指标</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-xs text-secondary-text mb-1">市盈率 (PE)</p>
                    <p className="text-xl font-semibold text-foreground">
                      {formatNumber(fundamentalData.valuation.pe)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-xs text-secondary-text mb-1">市净率 (PB)</p>
                    <p className="text-xl font-semibold text-foreground">
                      {formatNumber(fundamentalData.valuation.pb)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-xs text-secondary-text mb-1">市销率 (PS)</p>
                    <p className="text-xl font-semibold text-foreground">
                      {formatNumber(fundamentalData.valuation.ps)}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Growth Section */}
            {fundamentalData.growth && (
              <Card variant="gradient" padding="md">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-foreground">增长指标</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-xs text-secondary-text mb-1">营收同比增长</p>
                    <p className={`text-xl font-semibold ${(fundamentalData.growth.revenue_yoy ?? 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatPercent(fundamentalData.growth.revenue_yoy)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-xs text-secondary-text mb-1">净利润同比增长</p>
                    <p className={`text-xl font-semibold ${(fundamentalData.growth.net_profit_yoy ?? 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatPercent(fundamentalData.growth.net_profit_yoy)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-xs text-secondary-text mb-1">净资产收益率 (ROE)</p>
                    <p className="text-xl font-semibold text-foreground">
                      {formatPercent(fundamentalData.growth.roe)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-xs text-secondary-text mb-1">毛利率</p>
                    <p className="text-xl font-semibold text-foreground">
                      {formatPercent(fundamentalData.growth.gross_margin)}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Earnings Section */}
            {fundamentalData.earnings && (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Financial Report */}
                {fundamentalData.earnings.financial_report && (
                  <Card variant="gradient" padding="md">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-foreground">财务报告</h2>
                      <p className="text-xs text-secondary-text">
                        报告期: {fundamentalData.earnings.financial_report.report_date || '--'}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-secondary-text">营业收入</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(fundamentalData.earnings.financial_report.revenue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-secondary-text">归母净利润</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(fundamentalData.earnings.financial_report.net_profit_parent)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-secondary-text">经营现金流</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(fundamentalData.earnings.financial_report.operating_cash_flow)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-secondary-text">ROE</span>
                        <span className="font-semibold text-foreground">
                          {formatPercent(fundamentalData.earnings.financial_report.roe)}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Dividend */}
                {fundamentalData.earnings.dividend && (
                  <Card variant="gradient" padding="md">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-foreground">分红指标</h2>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-secondary-text">TTM 每股分红</span>
                        <span className="font-semibold text-foreground">
                          {formatNumber(fundamentalData.earnings.dividend.ttm_cash_dividend_per_share, 4)} 元
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-secondary-text">TTM 分红收益率</span>
                        <span className="font-semibold text-foreground">
                          {formatPercent(fundamentalData.earnings.dividend.ttm_dividend_yield_pct)}
                        </span>
                      </div>
                      {fundamentalData.earnings.dividend.events && fundamentalData.earnings.dividend.events.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                          <p className="text-xs text-secondary-text mb-2">最近分红事件</p>
                          {fundamentalData.earnings.dividend.events.slice(0, 3).map((event, idx) => (
                            <div key={idx} className="text-xs text-secondary-text py-1">
                              {event.event_date}: {event.cash_dividend_per_share} 元/股
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Institution Section */}
            {fundamentalData.institution && (
              <Card variant="gradient" padding="md">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-foreground">机构持仓</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-xs text-secondary-text mb-1">机构持仓变化</p>
                    <p className={`text-xl font-semibold ${(fundamentalData.institution.institution_holding_change ?? 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatPercent(fundamentalData.institution.institution_holding_change)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-xs text-secondary-text mb-1">前十大股东变化</p>
                    <p className={`text-xl font-semibold ${(fundamentalData.institution.top10_holder_change ?? 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatPercent(fundamentalData.institution.top10_holder_change)}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Capital Flow Section */}
            {fundamentalData.capital_flow && (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Stock Flow */}
                {fundamentalData.capital_flow.stock_flow && (
                  <Card variant="gradient" padding="md">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-foreground">资金流向</h2>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-secondary-text">主力净流入</span>
                        <span className={`font-semibold ${(fundamentalData.capital_flow.stock_flow.main_net_inflow ?? 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                          {formatCurrency(fundamentalData.capital_flow.stock_flow.main_net_inflow)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-secondary-text">5日净流入</span>
                        <span className={`font-semibold ${(fundamentalData.capital_flow.stock_flow.inflow_5d ?? 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                          {formatCurrency(fundamentalData.capital_flow.stock_flow.inflow_5d)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-secondary-text">10日净流入</span>
                        <span className={`font-semibold ${(fundamentalData.capital_flow.stock_flow.inflow_10d ?? 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                          {formatCurrency(fundamentalData.capital_flow.stock_flow.inflow_10d)}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Sector Rankings */}
                {fundamentalData.capital_flow.sector_rankings && (
                  <Card variant="gradient" padding="md">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-foreground">板块资金排名</h2>
                    </div>
                    <div className="space-y-4">
                      {fundamentalData.capital_flow.sector_rankings.top && fundamentalData.capital_flow.sector_rankings.top.length > 0 && (
                        <div>
                          <p className="text-xs text-secondary-text mb-2">资金净流入 TOP</p>
                          {fundamentalData.capital_flow.sector_rankings.top.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-1 text-sm">
                              <span className="text-secondary-text">{item.name}</span>
                              <span className="text-success font-semibold">{formatCurrency(item.net_inflow)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {fundamentalData.capital_flow.sector_rankings.bottom && fundamentalData.capital_flow.sector_rankings.bottom.length > 0 && (
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-xs text-secondary-text mb-2">资金净流出 TOP</p>
                          {fundamentalData.capital_flow.sector_rankings.bottom.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-1 text-sm">
                              <span className="text-secondary-text">{item.name}</span>
                              <span className="text-danger font-semibold">{formatCurrency(item.net_inflow)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Dragon Tiger Section */}
            {fundamentalData.dragon_tiger && (
              <Card variant="gradient" padding="md">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-foreground">龙虎榜</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-xs text-secondary-text mb-1">是否上榜</p>
                    <Badge variant={fundamentalData.dragon_tiger.is_on_list ? 'success' : 'default'}>
                      {fundamentalData.dragon_tiger.is_on_list ? '已上榜' : '未上榜'}
                    </Badge>
                  </div>
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-xs text-secondary-text mb-1">近期上榜次数</p>
                    <p className="text-xl font-semibold text-foreground">
                      {fundamentalData.dragon_tiger.recent_count || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-xs text-secondary-text mb-1">最近上榜日期</p>
                    <p className="text-sm font-semibold text-foreground">
                      {fundamentalData.dragon_tiger.latest_date || '--'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Boards Section */}
            {fundamentalData.boards?.data && (
              <Card variant="gradient" padding="md">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-foreground">板块涨跌榜</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {fundamentalData.boards.data.top && fundamentalData.boards.data.top.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-success mb-3">涨幅 TOP</p>
                      {fundamentalData.boards.data.top.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-sm text-secondary-text">{item.name}</span>
                          <span className="text-success font-semibold">{formatPercent(item.change_pct)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {fundamentalData.boards.data.bottom && fundamentalData.boards.data.bottom.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-danger mb-3">跌幅 TOP</p>
                      {fundamentalData.boards.data.bottom.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-sm text-secondary-text">{item.name}</span>
                          <span className="text-danger font-semibold">{formatPercent(item.change_pct)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <EmptyState
              title="开始分析"
              description="输入股票代码进行基本面分析"
              className="max-w-xl border-dashed"
              icon={(
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default FundamentalPage;

