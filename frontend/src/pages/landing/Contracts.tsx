import { EXPLORER_URL, USDC_ADDRESS, arcMainnet } from "../../chain";
import { NETTING_HUB_ADDRESS } from "../../config";

const ZERO = "0x0000000000000000000000000000000000000000";
const hubDeployed = NETTING_HUB_ADDRESS !== ZERO;

const CONTRACTS = [
  {
    name: "NettingHub",
    addr: hubDeployed ? NETTING_HUB_ADDRESS : "Not deployed yet",
    link: hubDeployed ? `${EXPLORER_URL}/address/${NETTING_HUB_ADDRESS}` : undefined,
  },
  {
    name: "USDC (ERC-20)",
    addr: USDC_ADDRESS,
    link: `${EXPLORER_URL}/address/${USDC_ADDRESS}`,
  },
  {
    name: "Arc Mainnet",
    addr: `Chain ID ${arcMainnet.id} · ${new URL(arcMainnet.rpcUrls.default.http[0]).host}`,
    link: "https://docs.arc.io/arc/references/connect-to-arc",
  },
];

export function Contracts() {
  return (
    <section className="lsection" id="contracts">
      <div className="lcontainer">
        <div className="lsection-head">
          <div className="lsection-tag">Contracts</div>
          <h2>Deployment on Arc Mainnet.</h2>
        </div>
        <div className="lcontract-list">
          {CONTRACTS.map((c) => (
            <div className="lcontract-item" key={c.name}>
              <div>
                <div className="name">{c.name}</div>
                <div className="addr">{c.addr}</div>
              </div>
              {c.link && <a href={c.link} target="_blank" rel="noreferrer">View →</a>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
