import {
  Alert,
  Autocomplete,
  CircularProgress,
  LinearProgress,
  Link as MuiLink,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { createFileRoute, createLink, stripSearchParams } from '@tanstack/react-router';
import { z } from 'zod';
import { DEFAULT_TICKERS, MAIN_FORMS } from '../services/summary/summary.domain';
import { summaryQueryOptions, useSummary } from '../services/summary/summary.hooks';

/** MUI-styled link that navigates with the router (type-safe `to` / `params`). */
const RouterLink = createLink(MuiLink);

const summarySearchSchema = z.object({
  tickers: z.array(z.string()).default(DEFAULT_TICKERS).catch(DEFAULT_TICKERS),
});

export const Route = createFileRoute('/summary')({
  validateSearch: summarySearchSchema,
  search: { middlewares: [stripSearchParams({ tickers: DEFAULT_TICKERS })] },
  loaderDeps: ({ search }) => search,
  // Start fetching without blocking render; errors are rendered by the component.
  loader: ({ context: { queryClient }, deps: { tickers } }) => {
    void queryClient.query(summaryQueryOptions(tickers)).catch(() => undefined);
  },
  component: SummaryPage,
});

function SummaryPage() {
  const { tickers } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: rows, isPending, isFetching, error } = useSummary(tickers);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Filing summary</Typography>
      <Typography color="text.secondary">
        Filings per form type over the last 12 months, and each company&apos;s latest annual report.
      </Typography>

      <Autocomplete
        multiple
        freeSolo
        size="small"
        options={[]}
        value={tickers}
        onChange={(_, values) => {
          void navigate({ search: { tickers: values.map((t) => t.trim().toUpperCase()) } });
        }}
        renderInput={(params) => (
          <TextField {...params} label="Companies" placeholder="Add a ticker and press Enter" />
        )}
        sx={{ maxWidth: 600 }}
      />

      {tickers.length === 0 && <Alert severity="info">Add at least one ticker.</Alert>}
      {isPending && tickers.length > 0 && <CircularProgress />}
      {error && <Alert severity="error">{error.message}</Alert>}

      {rows && tickers.length > 0 && (
        <Paper>
          {isFetching && <LinearProgress />}
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Latest annual report</TableCell>
                  {MAIN_FORMS.map((form) => (
                    <TableCell key={form} align="right">
                      {form}
                    </TableCell>
                  ))}
                  <TableCell align="right">Other</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.ticker} hover>
                    <TableCell>
                      <RouterLink to="/companies/$ticker" params={{ ticker: row.ticker }}>
                        {row.ticker}
                      </RouterLink>
                    </TableCell>
                    <TableCell>
                      {row.latestAnnualReport
                        ? `${row.latestAnnualReport.form} · ${row.latestAnnualReport.filingDate}`
                        : '—'}
                    </TableCell>
                    {MAIN_FORMS.map((form) => (
                      <TableCell key={form} align="right">
                        {row.mainForms[form]}
                      </TableCell>
                    ))}
                    <TableCell align="right">{row.other}</TableCell>
                    <TableCell align="right">
                      <strong>{row.total}</strong>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Stack>
  );
}
