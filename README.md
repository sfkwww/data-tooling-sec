# SEC Filings

Browse SEC EDGAR filings per company, and compare filing activity across companies.

- `backend/`: Express API that reads from SEC EDGAR.
- `frontend/`: React + MUI app.

## Requirements

- Node 22 or later (see `.nvmrc`)
- pnpm 10

## Setup

```bash
pnpm install
cp backend/.env.example backend/.env
```

Then set `SEC_USER_AGENT` in `backend/.env` to your name or company and an email address, e.g. `"Acme Inc dev@acme.com"`. SEC rejects requests that don't send one.

## Run

```bash
pnpm dev
```

This starts both apps:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

In development, the frontend proxies `/api/*` to the backend.

## API

- `GET /companies/:ticker/filings?form=10-K,8-K&sort=desc&page=1&pageSize=20`: a company's recent filings, with links to each document on sec.gov.
- `GET /filings/summary?tickers=AAPL,SPOT,JPM`: filings per form type over the last 12 months, and each company's latest annual report.

## Other scripts

```bash
pnpm build        # build both apps
pnpm typecheck
pnpm lint
pnpm format       # format with Prettier
```
