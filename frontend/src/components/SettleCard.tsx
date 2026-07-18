import { useState } from "react";
import { usePublicClient, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { NETTING_HUB_ABI, ERC20_ABI } from "../abi";
import { NETTING_HUB_ADDRESS } from "../config";
import { USDC_ADDRESS } from "../chain";
import { netObligations, Obligation } from "../netting";

export function SettleCard() {
  const client = usePublicClient();
  const { address } = useAccount();
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const [lastHash, setLastHash] = useState<`0x${string}` | undefined>();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: lastHash });

  const pushLog = (s: string) => setLog((l) => [...l, s]);

  const runNetting = async () => {
    if (!client || !address) return;
    setBusy(true);
    setLog([]);
    try {
      // 1. Read all obligations
      pushLog("Reading obligations…");
      const count = (await client.readContract({
        address: NETTING_HUB_ADDRESS,
        abi: NETTING_HUB_ABI,
        functionName: "obligationCount",
      })) as bigint;

      const unsettled: Array<{ id: bigint; o: Obligation }> = [];
      for (let i = 0; i < Number(count); i++) {
        const o = (await client.readContract({
          address: NETTING_HUB_ADDRESS,
          abi: NETTING_HUB_ABI,
          functionName: "getObligation",
          args: [BigInt(i)],
        })) as any;
        if (!o.settled && o.debtorApproved && o.creditorApproved) {
          unsettled.push({
            id: BigInt(i),
            o: { debtor: o.debtor, creditor: o.creditor, amount: o.amount },
          });
        }
      }
      if (unsettled.length === 0) {
        pushLog("No confirmed, unsettled obligations found.");
        return;
      }
      pushLog(`Found ${unsettled.length} confirmed obligations.`);

      // 2. Net off-chain
      const obligations = unsettled.map((u) => u.o);
      const result = netObligations(obligations);
      const fmt = (n: bigint) => (Number(n) / 1e6).toFixed(2);
      pushLog(`Gross: ${fmt(result.grossAmount)} USDC`);
      pushLog(`Net:   ${fmt(result.netAmount)} USDC`);
      pushLog(`Saved: ${fmt(result.savedAmount)} USDC (${Number(result.savingsBps) / 100}%)`);
      pushLog(`Transfers: ${result.transfers.length}`);

      // 3. Close cycle on-chain
      pushLog("Closing cycle on-chain…");
      const ids = unsettled.map((u) => u.id);
      const closeHash = await writeContractAsync({
        address: NETTING_HUB_ADDRESS,
        abi: NETTING_HUB_ABI,
        functionName: "closeCycle",
        args: [ids],
      });
      pushLog(`closeCycle tx: ${closeHash.slice(0, 10)}…`);
      await client.waitForTransactionReceipt({ hash: closeHash });

      // 4. Approve + settle (note: every net payer must approve individually —
      //    in this demo the connected wallet approves its own share only)
      const myTransfers = result.transfers.filter(
        (t) => t.from.toLowerCase() === address.toLowerCase()
      );
      for (const t of myTransfers) {
        pushLog(`Approving ${fmt(t.amount)} USDC…`);
        const approveHash = await writeContractAsync({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [NETTING_HUB_ADDRESS, t.amount],
        });
        await client.waitForTransactionReceipt({ hash: approveHash });
      }

      // 5. Settle
      const payers = result.transfers.map((t) => t.from as `0x${string}`);
      const amountsIn = result.transfers.map((t) => t.amount);
      const receivers = result.transfers.map((t) => t.to as `0x${string}`);
      const amountsOut = result.transfers.map((t) => t.amount);

      pushLog("Settling…");
      const settleHash = await writeContractAsync({
        address: NETTING_HUB_ADDRESS,
        abi: NETTING_HUB_ABI,
        functionName: "settle",
        args: [payers, amountsIn, receivers, amountsOut],
      });
      setLastHash(settleHash);
      pushLog(`✅ Settled! tx: ${settleHash}`);
      pushLog(`Explorer: https://testnet.arcscan.app/tx/${settleHash}`);
    } catch (e: any) {
      pushLog(`❌ Error: ${e.shortMessage ?? e.message ?? String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h2>3. Net &amp; Settle</h2>
      <p style={{ fontSize: 13, color: "#8b93a7" }}>
        Runs the netting engine on all confirmed obligations, then settles residuals on-chain.
        Only works if the connected wallet is an operator and all net payers have approved.
      </p>
      <button onClick={runNetting} disabled={busy}>
        {busy ? "Working…" : "Run Netting & Settle"}
      </button>
      {log.length > 0 && (
        <div className="msg info" style={{ marginTop: 12 }}>
          {log.map((l, i) => (
            <div key={i} className="mono">{l}</div>
          ))}
        </div>
      )}
      {isSuccess && <div className="msg info">Transaction confirmed.</div>}
    </div>
  );
}
