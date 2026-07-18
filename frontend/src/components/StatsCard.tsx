import { useAccount, useReadContract } from "wagmi";
import { ERC20_ABI } from "../abi";
import { USDC_ADDRESS } from "../chain";
import { arcTestnet } from "../chain";

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
          <div className="v">{arcTestnet.id}</div>
          <div className="k">Chain ID</div>
        </div>
        <div>
          <div className="v">
            <a href="https://faucet.circle.com" target="_blank" rel="noreferrer">
              Faucet
            </a>
          </div>
          <div className="k">Get testnet USDC</div>
        </div>
        <div>
          <div className="v">
            <a href="https://testnet.arcscan.app" target="_blank" rel="noreferrer">
              ArcScan
            </a>
          </div>
          <div className="k">Explorer</div>
        </div>
      </div>
    </div>
  );
}
