/**
 * Netting engine: compute minimum transfers that settle a set of bilateral obligations.
 *
 * Input:  list of obligations { debtor, creditor, amount }
 * Output: list of transfers { from, to, amount } whose sum = net residual moved
 *
 * Algorithm (greedy, O(n log n)):
 *   1. Compute net position per party  (received - paid).
 *   2. Split into creditors (positive) and debtors (negative).
 *   3. Greedily match largest creditor with largest debtor.
 *
 * The result minimizes the NUMBER of transfers (≤ n-1 for n parties) and
 * the TOTAL amount moved is the minimum possible (= sum of positive positions).
 */
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
  grossAmount: bigint;   // sum of all original obligations
  netAmount: bigint;     // sum of netted transfers
  savedAmount: bigint;   // gross - net
  savingsBps: bigint;    // (saved * 10000) / gross
  positions: Record<string, bigint>; // net position per address
}

export function computeNetPositions(obligations: Obligation[]): Map<string, bigint> {
  const pos = new Map<string, bigint>();
  const bump = (addr: string, delta: bigint) =>
    pos.set(addr, (pos.get(addr) ?? 0n) + delta);

  for (const o of obligations) {
    bump(o.debtor, -o.amount);   // debtor pays
    bump(o.creditor, o.amount);  // creditor receives
  }
  return pos;
}

export function netObligations(obligations: Obligation[]): NettingResult {
  const positions = computeNetPositions(obligations);

  const gross = obligations.reduce((s, o) => s + o.amount, 0n);

  // split creditors / debtors, sorted by |position| desc
  const creditors: Array<[string, bigint]> = [];
  const debtors: Array<[string, bigint]> = [];
  for (const [addr, p] of positions) {
    if (p > 0n) creditors.push([addr, p]);
    else if (p < 0n) debtors.push([addr, -p]); // store as positive debt
  }
  creditors.sort((a, b) => (b[1] > a[1] ? 1 : b[1] < a[1] ? -1 : 0));
  debtors.sort((a, b) => (b[1] > a[1] ? 1 : b[1] < a[1] ? -1 : 0));

  const transfers: Transfer[] = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const [dAddr, dAmt] = debtors[i];
    const [cAddr, cAmt] = creditors[j];
    const pay = dAmt < cAmt ? dAmt : cAmt;
    if (pay > 0n) transfers.push({ from: dAddr, to: cAddr, amount: pay });
    debtors[i][1] = dAmt - pay;
    creditors[j][1] = cAmt - pay;
    if (debtors[i][1] === 0n) i++;
    if (creditors[j][1] === 0n) j++;
  }

  const net = transfers.reduce((s, t) => s + t.amount, 0n);
  const saved = gross > net ? gross - net : 0n;
  const savingsBps = gross > 0n ? (saved * 10000n) / gross : 0n;

  const posObj: Record<string, bigint> = {};
  for (const [k, v] of positions) posObj[k] = v;

  return { transfers, grossAmount: gross, netAmount: net, savedAmount: saved, savingsBps, positions: posObj };
}

/** Sanity check: every party's net position must be satisfied by the transfers. */
export function verifyNetting(obligations: Obligation[], transfers: Transfer[]): boolean {
  const want = computeNetPositions(obligations);
  const got = new Map<string, bigint>();
  for (const t of transfers) {
    got.set(t.from, (got.get(t.from) ?? 0n) - t.amount);
    got.set(t.to, (got.get(t.to) ?? 0n) + t.amount);
  }
  for (const [addr, p] of want) {
    if ((got.get(addr) ?? 0n) !== p) return false;
  }
  return true;
}
