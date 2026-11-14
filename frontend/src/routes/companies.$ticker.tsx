import {
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { filingsQueryOptions, useFilings } from '../services/filings/filings.hooks';

export const Route = createFileRoute('/companies/$ticker')({
  // Prefetch on navigation/hover; the component reads from the same query cache.
  // Errors are swallowed here so the component renders them via useFilings().
  loader: async ({ context: { queryClient }, params: { ticker } }) => {
    await queryClient.query(filingsQueryOptions(ticker)).catch(() => undefined);
  },
  component: CompanyFilingsPage,
});

// TODO: replace with server-side pagination + form-type filter + sort controls.
const PREVIEW_LIMIT = 50;

function CompanyFilingsPage() {
  const { ticker } = Route.useParams();
  const { data: filings, isPending, error } = useFilings(ticker);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{ticker.toUpperCase()} filings</Typography>

      {isPending && <CircularProgress />}
      {error && <Alert severity="error">{error.message}</Alert>}

      {filings && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Filed</TableCell>
                <TableCell>Form</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Document</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filings.slice(0, PREVIEW_LIMIT).map((f) => (
                <TableRow key={f.accessionNumber} hover>
                  <TableCell>{f.filingDate}</TableCell>
                  <TableCell>{f.form}</TableCell>
                  <TableCell>{f.primaryDocDescription || '—'}</TableCell>
                  {/* TODO: link to sec.gov once the backend returns a document URL */}
                  <TableCell>{f.primaryDocument}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}
