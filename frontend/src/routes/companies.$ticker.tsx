import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  LinearProgress,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { useState } from 'react';
import {
  COMMON_FORMS,
  type FilingsQuery,
  filingsQuerySchema,
} from '../services/filings/filings.domain';
import { filingsQueryOptions, useFilings } from '../services/filings/filings.hooks';

export const Route = createFileRoute('/companies/$ticker')({
  // Filters, sort and page live in the URL, e.g. ?form=["10-K"]&sort=asc&page=2
  validateSearch: filingsQuerySchema,
  // Keep the URL clean: leave out params that equal their defaults
  search: { middlewares: [stripSearchParams(filingsQuerySchema.parse({}))] },
  loaderDeps: ({ search }) => search,
  // Start fetching on navigation/hover without blocking render, so the page shows a spinner
  // instead of staying blank. Errors are rendered by the component via useFilings().
  loader: ({ context: { queryClient }, params: { ticker }, deps }) => {
    void queryClient.query(filingsQueryOptions(ticker, deps)).catch(() => undefined);
  },
  component: CompanyFilingsPage,
});

function CompanyFilingsPage() {
  const { ticker } = Route.useParams();
  const query = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isPending, isFetching, error } = useFilings(ticker, query);

  const updateQuery = (changes: Partial<FilingsQuery>) => {
    void navigate({ search: (prev) => ({ ...prev, ...changes }) });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{ticker.toUpperCase()} filings</Typography>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        {/* key resets the input when the ticker in the URL changes */}
        <CompanySwitcher key={ticker} ticker={ticker} />
        <Autocomplete
          multiple
          freeSolo
          size="small"
          options={COMMON_FORMS}
          value={query.form}
          onChange={(_, forms) => {
            updateQuery({ form: forms.map((f) => f.trim().toUpperCase()), page: 1 });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Form types" placeholder="All forms" />
          )}
          sx={{ minWidth: 320 }}
        />
      </Stack>

      {isPending && <CircularProgress />}
      {error && <Alert severity="error">{error.message}</Alert>}

      {data && (
        <Paper>
          {isFetching && <LinearProgress />}
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sortDirection={query.sort}>
                    <TableSortLabel
                      active
                      direction={query.sort}
                      onClick={() => {
                        updateQuery({ sort: query.sort === 'desc' ? 'asc' : 'desc', page: 1 });
                      }}
                    >
                      Filed
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Form</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Document</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>No filings match these filters.</TableCell>
                  </TableRow>
                )}
                {data.data.map((f) => (
                  <TableRow key={f.accessionNumber} hover>
                    <TableCell>{f.filingDate}</TableCell>
                    <TableCell>{f.form}</TableCell>
                    <TableCell>{f.primaryDocDescription || '—'}</TableCell>
                    <TableCell>
                      <Link href={f.url} target="_blank" rel="noreferrer">
                        {f.primaryDocument}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={data.pagination.totalItems}
            page={query.page - 1} // MUI pages are 0-based, the API's are 1-based
            rowsPerPage={query.pageSize}
            rowsPerPageOptions={[10, 25, 50, 100]}
            onPageChange={(_, page) => {
              updateQuery({ page: page + 1 });
            }}
            onRowsPerPageChange={(e) => {
              updateQuery({ pageSize: Number(e.target.value), page: 1 });
            }}
          />
        </Paper>
      )}
    </Stack>
  );
}

function CompanySwitcher({ ticker }: { ticker: string }) {
  const navigate = Route.useNavigate();
  const [value, setValue] = useState(ticker.toUpperCase());

  return (
    <Stack
      component="form"
      direction="row"
      spacing={1}
      onSubmit={(e) => {
        e.preventDefault();
        // New company: reset filters and paging
        void navigate({ to: '/companies/$ticker', params: { ticker: value.trim() }, search: {} });
      }}
    >
      <TextField
        label="Ticker"
        size="small"
        value={value}
        onChange={(e) => {
          setValue(e.target.value.toUpperCase());
        }}
        sx={{ width: 120 }}
      />
      <Button type="submit" variant="outlined" disabled={!value.trim()}>
        Go
      </Button>
    </Stack>
  );
}
