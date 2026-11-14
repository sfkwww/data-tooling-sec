import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import { toSummaryRow } from './summary.domain';
import { fetchSummary } from './summary.service';

export const summaryKeys = {
  all: ['summary'] as const,
  byTickers: (tickers: string[]) => [...summaryKeys.all, tickers] as const,
};

export const summaryQueryOptions = (tickers: string[]) =>
  queryOptions({
    queryKey: summaryKeys.byTickers(tickers),
    queryFn: () => fetchSummary(tickers),
    // Turn the API response into table rows (main forms + "Other") once, in the domain layer.
    select: (summary) => summary.data.map(toSummaryRow),
    enabled: tickers.length > 0,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

export function useSummary(tickers: string[]) {
  return useQuery(summaryQueryOptions(tickers));
}
