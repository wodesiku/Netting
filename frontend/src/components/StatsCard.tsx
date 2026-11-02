import { useAccount, useReadContract } from "wagmi";
import { ERC20_ABI } from "../abi";
import { USDC_ADDRESS, EXPLORER_URL, arcMainnet } from "../chain";


export function StatsCard() {
  const { address } = useAccount();
  const { data: usdcBal } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  return (
    <div className="card">
      <h2>Status</h2>
      <div className="stat">
        <div>
          <div className="v">
            {usdcBal !== undefined ? (Number(usdcBal) / 1e6).toFixed(2) : "—"}
          </div>
          <div className="k">ERC-20 USDC balance</div>
        </div>
        <div>
          <div className="v">{arcMainnet.id}</div>
          <div className="k">Chain ID</div>
        </div>
        <div>
          <div className="v">
            <a href={EXPLORER_URL} target="_blank" rel="noreferrer">
              Arc Explorer
            </a>
          </div>
          <div className="k">Explorer</div>
        </div>
      </div>
    </div>
  );
}
