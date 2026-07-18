import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { NETTING_HUB_ABI } from "../abi";
import { NETTING_HUB_ADDRESS } from "../config";

export function RegisterCard() {
  const { address } = useAccount();
  const [name, setName] = useState("");
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: isReg, refetch } = useReadContract({
    address: NETTING_HUB_ADDRESS,
    abi: NETTING_HUB_ABI,
    functionName: "isRegistered",
    args: address ? [address] : undefined,
  });

  const register = () => {
    if (!name.trim()) return;
    writeContract({
      address: NETTING_HUB_ADDRESS,
      abi: NETTING_HUB_ABI,
      functionName: "register",
      args: [name],
    });
  };

  if (isSuccess) setTimeout(() => refetch(), 1000);

  return (
    <div className="card">
      <h2>1. Register</h2>
      {isReg ? (
        <div>
          <span className="badge ok">Registered</span>{" "}
          <span className="addr">{address}</span>
        </div>
      ) : (
        <div>
          <label>Company name</label>
          <div className="row">
            <input
              placeholder="e.g. Acme Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={register} disabled={isPending || confirming || !name.trim()}>
              {isPending || confirming ? "Registering…" : "Register"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
