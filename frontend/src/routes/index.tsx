import { Button, Stack, TextField, Typography } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [ticker, setTicker] = useState('AAPL');

  return (
    <Stack spacing={2} sx={{ maxWidth: 384 }}>
      <Typography variant="h4">Look up a company</Typography>
      <Stack
        component="form"
        direction="row"
        spacing={1}
        onSubmit={(e) => {
          e.preventDefault();
          void navigate({ to: '/companies/$ticker', params: { ticker: ticker.trim() } });
        }}
      >
        <TextField
          label="Ticker"
          size="small"
          value={ticker}
          onChange={(e) => {
            setTicker(e.target.value.toUpperCase());
          }}
        />
        <Button type="submit" variant="contained" disabled={!ticker.trim()}>
          Go
        </Button>
      </Stack>
    </Stack>
  );
}
