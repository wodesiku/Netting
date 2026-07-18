// Off-chain netting engine (mirrors netting-engine/src/netting.ts).
export interface Obligation {
  debtor: string;
  creditor: string;
  amount: bigint;
}
export interface Transfer {
  from: string;
  to: string;
  amount: bigint;
}
export interface NettingResult {
  transfers: Transfer[];
  grossAmount: bigint;
  netAmount: bigint;
  savedAmount: bigint;
  savingsBps: bigint;
}

export function netObligations(obligations: Obligation[]): NettingResult {
  const pos = new Map<string, bigint>();
  const bump = (a: string, d: bigint) => pos.set(a, (pos.get(a) ?? 0n) + d);
  for (const o of obligations) {
    bump(o.debtor, -o.amount);
    bump(o.creditor, o.amount);
  }
  const gross = obligations.reduce((s, o) => s + o.amount, 0n);

  const creditors: Array<[string, bigint]> = [];
  const debtors: Array<[string, bigint]> = [];
  for (const [a, p] of pos) {
    if (p > 0n) creditors.push([a, p]);
    else if (p < 0n) debtors.push([a, -p]);
  }
  creditors.sort((a, b) => (b[1] > a[1] ? 1 : -1));
  debtors.sort((a, b) => (b[1] > a[1] ? 1 : -1));

  const transfers: Transfer[] = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const [dA, dAmt] = debtors[i];
    const [cA, cAmt] = creditors[j];
    const pay = dAmt < cAmt ? dAmt : cAmt;
    if (pay > 0n) transfers.push({ from: dA, to: cA, amount: pay });
    debtors[i][1] = dAmt - pay;
    creditors[j][1] = cAmt - pay;
    if (debtors[i][1] === 0n) i++;
    if (creditors[j][1] === 0n) j++;
  }

  const net = transfers.reduce((s, t) => s + t.amount, 0n);
  const saved = gross > net ? gross - net : 0n;
  const savingsBps = gross > 0n ? (saved * 10000n) / gross : 0n;
  return { transfers, grossAmount: gross, netAmount: net, savedAmount: saved, savingsBps };
}
