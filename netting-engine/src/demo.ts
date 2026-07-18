import { netObligations, verifyNetting, Obligation } from "./netting.js";

// Blog scenario: A owes B 100, B owes C 100, C owes A 80.
const A = "0xAlice";
const B = "0xBob";
const C = "0xCarol";

const obligations: Obligation[] = [
  { debtor: A, creditor: B, amount: 100_000_000n },
  { debtor: B, creditor: C, amount: 100_000_000n },
  { debtor: C, creditor: A, amount: 80_000_000n },
];

const r = netObligations(obligations);
console.log("Gross:", r.grossAmount.toString());
console.log("Net  :", r.netAmount.toString());
console.log("Saved:", r.savedAmount.toString(), `(${Number(r.savingsBps) / 100}%)`);
console.log("Positions:", r.positions);
console.log("Transfers:");
for (const t of r.transfers) console.log(`  ${t.from} -> ${t.to}: ${t.amount}`);
console.log("Verify:", verifyNetting(obligations, r.transfers));

// 4-party cycle: A→B 50, B→C 70, C→D 30, D→A 60
const D = "0xDave";
const ob2: Obligation[] = [
  { debtor: A, creditor: B, amount: 50n },
  { debtor: B, creditor: C, amount: 70n },
  { debtor: C, creditor: D, amount: 30n },
  { debtor: D, creditor: A, amount: 60n },
];
const r2 = netObligations(ob2);
console.log("\n4-party cycle:");
console.log("Gross:", r2.grossAmount.toString(), "Net:", r2.netAmount.toString(), "Saved:", r2.savedAmount.toString());
for (const t of r2.transfers) console.log(`  ${t.from} -> ${t.to}: ${t.amount}`);
console.log("Verify:", verifyNetting(ob2, r2.transfers));
