import type { Submissions } from './repository/edgar.schema.js';
import type { Filing } from './sec.schema.js';

// Could improve this with helper functions for fun but probably not necessary right now
export function submissionsToRecentFilings(submissions: Submissions): Filing[] {
  const {
    accessionNumber,
    filingDate,
    reportDate,
    acceptanceDateTime,
    act,
    form,
    fileNumber,
    filmNumber,
    items,
    core_type,
    size,
    isXBRL,
    isInlineXBRL,
    isXBRLNumeric,
    primaryDocument,
    primaryDocDescription,
  } = submissions.filings.recent;

  return accessionNumber.map((accessionNumber, i) => ({
    accessionNumber,
    filingDate: filingDate[i] ?? '',
    reportDate: reportDate[i] ?? '',
    acceptanceDateTime: acceptanceDateTime[i] ?? '',
    act: act[i] ?? '',
    form: form[i] ?? '',
    fileNumber: fileNumber[i] ?? '',
    filmNumber: filmNumber[i] ?? '',
    items: items[i] ?? '',
    core_type: core_type[i] ?? '',
    size: size[i] ?? 0,
    isXBRL: isXBRL[i] ?? 0,
    isInlineXBRL: isInlineXBRL[i] ?? 0,
    isXBRLNumeric: isXBRLNumeric[i] ?? null,
    primaryDocument: primaryDocument[i] ?? '',
    primaryDocDescription: primaryDocDescription[i] ?? '',
  }));
}
