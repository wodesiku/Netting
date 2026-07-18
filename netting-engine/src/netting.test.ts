import { describe, it, expect } from "vitest";
import { netObligations, verifyNetting, Obligation } from "./netting.js";

const A = "0xA", B = "0xB", C = "0xC", D = "0xD";

describe("netObligations", () => {
  it("handles the blog triangle: A→B 100, B→C 100, C→A 80", () => {
    const obs: Obligation[] = [
      { debtor: A, creditor: B, amount: 100n },
      { debtor: B, creditor: C, amount: 100n },
      { debtor: C, creditor: A, amount: 80n },
    ];
    const r = netObligations(obs);
    expect(r.grossAmount).toBe(280n);
    // A: -100+80=-20, B: +100-100=0, C: +100-80=+20  =>  A pays C 20
    expect(r.netAmount).toBe(20n);
    expect(r.savedAmount).toBe(260n);
    expect(verifyNetting(obs, r.transfers)).toBe(true);
  });

  it("cancels a perfect 4-party cycle to zero", () => {
    const obs: Obligation[] = [
      { debtor: A, creditor: B, amount: 50n },
      { debtor: B, creditor: C, amount: 50n },
      { debtor: C, creditor: D, amount: 50n },
      { debtor: D, creditor: A, amount: 50n },
    ];
    const r = netObligations(obs);
    expect(r.netAmount).toBe(0n);
    expect(r.transfers.length).toBe(0);
    expect(r.savedAmount).toBe(200n);
  });

  it("handles single obligation", () => {
    const obs: Obligation[] = [{ debtor: A, creditor: B, amount: 42n }];
    const r = netObligations(obs);
    expect(r.transfers).toEqual([{ from: A, to: B, amount: 42n }]);
    expect(r.savedAmount).toBe(0n);
  });

  it("consolidates many-to-one debts", () => {
    const obs: Obligation[] = [
      { debtor: A, creditor: D, amount: 10n },
      { debtor: B, creditor: D, amount: 20n },
      { debtor: C, creditor: D, amount: 30n },
    ];
    const r = netObligations(obs);
    expect(r.netAmount).toBe(60n);
    expect(r.transfers.length).toBe(3);
    expect(verifyNetting(obs, r.transfers)).toBe(true);
  });

  it("random fuzz: netting always verifies", () => {
    let seed = 42;
    const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let trial = 0; trial < 50; trial++) {
      const parties = [A, B, C, D, "0xE", "0xF"];
      const obs: Obligation[] = [];
      const n = 3 + Math.floor(rand() * 8);
      for (let i = 0; i < n; i++) {
        const di = Math.floor(rand() * parties.length);
        let ci = Math.floor(rand() * parties.length);
        if (ci === di) ci = (ci + 1) % parties.length;
        obs.push({
          debtor: parties[di],
          creditor: parties[ci],
          amount: BigInt(1 + Math.floor(rand() * 1000)),
        });
      }
      const r = netObligations(obs, );
      expect(verifyNetting(obs, r.transfers)).toBe(true);
      expect(r.netAmount <= r.grossAmount).toBe(true);
    }
  });
});
