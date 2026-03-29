import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { ApiErrorAlert, EmptyState } from '../components/common';
import { StockAutocomplete } from '../components/StockAutocomplete';
import { ReportFundamental } from '../components/report/ReportFundamental';
import type { ParsedApiError } from '../api/error';
import { getParsedApiError } from '../api/error';

const FundamentalPage: React.FC = () => {
  useEffect(() => {
    document.title = '基本面分析 - DSA';
  }, []);

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ParsedApiError | null>(null);
  const [details, setDetails] = useState<any | null>(null);
  const [stockName, setStockName] = useState('');
  const [stockCode, setStockCode] = useState('');

  const fetchFundamentalData = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);
    setDetails(null);
    try {
      const response = await fetch('/api/v1/analysis/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_code: code }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `请求失败: ${response.status}`);
      }
      const data = await response.json();
      // 兼容同步响应（report）和异步响应
      const report = data.report ?? data;
      setDetails(report?.details ?? null);
      setStockName(report?.meta?.stockName || report?.meta?.stock_name || code);
      setStockCode(report?.meta?.stockCode || report?.meta?.stock_code || code);
    } catch (err) {
      setError(getParsedApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    (stockCodeArg?: string) => {
      const code = stockCodeArg || query;
      if (code) {
        void fetchFundamentalData(code);
        setQuery('');
      }
    },
    [fetchFundamentalData, query],
  );

  return (
    <div className="min-h-full flex flex-col rounded-[1.5rem] bg-transparent">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-white/5 px-3 py-3 sm:px-4">
        <div className="flex max-w-5xl flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <StockAutocomplete
              value={query}
              onChange={setQuery}
              onSubmit={(code) => handleSubmit(code)}
              placeholder="输入股票代码或名称，如 600519、贵州茅台、AAPL"
              disabled={isLoading}
            />
          </div>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!query || isLoading}
            className="btn-primary flex h-10 flex-shrink-0 items-center gap-1.5 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                分析中...
              </>
            ) : (
              '查询基本面'
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
              <p className="text-secondary-text text-sm">正在获取基本面数据（约 10-15 秒）...</p>
            </div>
          </div>
        ) : details ? (
          <div className="max-w-2xl space-y-2 pb-8">
            {stockName && (
              <div className="mb-2 px-1">
                <h1 className="text-xl font-bold text-foreground">{stockName}</h1>
                <p className="text-xs text-secondary-text font-mono">{stockCode}</p>
              </div>
            )}
            <ReportFundamental details={details} language="zh" />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <EmptyState
              title="查询基本面数据"
              description="输入股票代码，获取估值、财务、成长、资金流等完整基本面信息"
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
