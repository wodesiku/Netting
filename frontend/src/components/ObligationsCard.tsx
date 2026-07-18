import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { parseUnits, keccak256, stringToBytes } from "viem";
import { NETTING_HUB_ABI } from "../abi";
import { NETTING_HUB_ADDRESS } from "../config";
import { useEffect } from "react";

interface ObligationView {
  id: bigint;
  debtor: string;
  creditor: string;
  amount: bigint;
  debtorApproved: boolean;
  creditorApproved: boolean;
  settled: boolean;
}

export function ObligationsCard() {
  const { address } = useAccount();
  const client = usePublicClient();
  const [creditor, setCreditor] = useState("");
  const [amount, setAmount] = useState("");
  const [list, setList] = useState<ObligationView[]>([]);
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: count, refetch: refetchCount } = useReadContract({
    address: NETTING_HUB_ADDRESS,
    abi: NETTING_HUB_ABI,
    functionName: "obligationCount",
  });

  const load = async () => {
    if (!client || count === undefined) return;
    const n = Number(count);
    const out: ObligationView[] = [];
    for (let i = 0; i < n; i++) {
      const o = (await client.readContract({
        address: NETTING_HUB_ADDRESS,
        abi: NETTING_HUB_ABI,
        functionName: "getObligation",
        args: [BigInt(i)],
      })) as any;
      out.push({
        id: BigInt(i),
        debtor: o.debtor,
        creditor: o.creditor,
        amount: o.amount,
        debtorApproved: o.debtorApproved,
        creditorApproved: o.creditorApproved,
        settled: o.settled,
      });
    }
    setList(out);
  };

  useEffect(() => { load(); }, [count, isSuccess]);

  const submit = () => {
    if (!creditor || !amount) return;
    const amt = parseUnits(amount, 6);
    const invHash = keccak256(stringToBytes(`inv-${Date.now()}`));
    const due = BigInt(Math.floor(Date.now() / 1000) + 7 * 86400);
    writeContract({
      address: NETTING_HUB_ADDRESS,
      abi: NETTING_HUB_ABI,
      functionName: "submitObligation",
      args: [creditor as `0x${string}`, amt, invHash, due],
    });
  };

  const confirm = (id: bigint) => {
    writeContract({
      address: NETTING_HUB_ADDRESS,
      abi: NETTING_HUB_ABI,
      functionName: "confirmObligation",
      args: [id],
    });
  };

  const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

  return (
    <div className="card">
      <h2>2. Obligations</h2>
      <label>I owe (creditor address)</label>
      <input placeholder="0x…" value={creditor} onChange={(e) => setCreditor(e.target.value)} />
      <label>Amount (USDC)</label>
      <div className="row">
        <input placeholder="100.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={submit} disabled={isPending || confirming || !creditor || !amount}>
          Submit Obligation
        </button>
      </div>

      {list.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>#</th><th>Debtor</th><th>Creditor</th><th>Amount</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => {
              const confirmed = o.debtorApproved && o.creditorApproved;
              const canConfirm = address?.toLowerCase() === o.creditor.toLowerCase() && !o.creditorApproved && !o.settled;
              return (
                <tr key={o.id.toString()}>
                  <td className="mono">{o.id.toString()}</td>
                  <td className="addr">{short(o.debtor)}</td>
                  <td className="addr">{short(o.creditor)}</td>
                  <td className="mono">{(Number(o.amount) / 1e6).toFixed(2)}</td>
                  <td>
                    {o.settled ? (
                      <span className="badge ok">settled</span>
                    ) : confirmed ? (
                      <span className="badge ok">confirmed</span>
                    ) : (
                      <span className="badge warn">pending</span>
                    )}
                  </td>
                  <td>
                    {canConfirm && (
                      <button className="ghost" onClick={() => confirm(o.id)} disabled={isPending}>
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <button className="ghost" onClick={() => { refetchCount(); load(); }} style={{ marginTop: 12 }}>
        Refresh
      </button>
    </div>
  );
}
