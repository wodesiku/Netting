import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { arcMainnet } from "../chain";
import { RegisterCard } from "../components/RegisterCard";
import { ObligationsCard } from "../components/ObligationsCard";
import { SettleCard } from "../components/SettleCard";
import { StatsCard } from "../components/StatsCard";
import { Link } from "react-router-dom";

export function Dapp() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const onArc = chain?.id === arcMainnet.id;

  return (
    <div className="dapp">
      <div className="dapp-header">
        <Link to="/" className="logo">
          <div className="logo-dot"></div>ArcNetting
        </Link>
        <h1 style={{ fontSize: 20, margin: 0 }}>Console</h1>
      </div>

      <div className="card">
        <h2>Wallet</h2>
        {!isConnected ? (
          <button onClick={() => connect({ connector: connectors[0] })}>
            Connect Wallet
          </button>
        ) : (
          <div>
            <div className="addr">{address}</div>
            <div style={{ marginTop: 8 }}>
              <span className={`badge ${onArc ? "ok" : "err"}`}>
                {onArc ? "Arc Mainnet" : `Wrong chain: ${chain?.name ?? "?"}`}
              </span>{" "}
              {!onArc && (
                <button
                  className="ghost"
                  onClick={() => switchChain({ chainId: arcMainnet.id })}
                  style={{ marginLeft: 8 }}
                >
                  Switch to Arc
                </button>
              )}
              <button className="ghost" onClick={() => disconnect()} style={{ marginLeft: 8 }}>
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      {isConnected && onArc && (
        <>
          <RegisterCard />
          <ObligationsCard />
          <SettleCard />
          <StatsCard />
        </>
      )}

      {isConnected && !onArc && (
        <div className="msg info">
          Please switch to Arc Mainnet (chain ID 5042) to use ArcNetting.
        </div>
      )}
    </div>
  );
}
