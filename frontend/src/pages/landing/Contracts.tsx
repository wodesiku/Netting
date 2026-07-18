const ADDR_BASE = "https://testnet.arcscan.app/address/";

const CONTRACTS = [
  {
    name: "NettingHub",
    addr: "0xFb906A05D849729825e54ebD737bdC936E91271D",
    link: `${ADDR_BASE}0xFb906A05D849729825e54ebD737bdC936E91271D`,
  },
  {
    name: "USDC (ERC-20)",
    addr: "0x3600000000000000000000000000000000000000",
    link: `${ADDR_BASE}0x3600000000000000000000000000000000000000`,
  },
  {
    name: "Operator (deployer)",
    addr: "0xBC841F74E7EacF909a3662b11a3a588BEe3b071C",
    link: `${ADDR_BASE}0xBC841F74E7EacF909a3662b11a3a588BEe3b071C`,
  },
  {
    name: "Arc Testnet",
    addr: "Chain ID 5042002 · rpc.testnet.arc.network",
    link: "https://docs.arc.io/arc/references/connect-to-arc",
  },
];

export function Contracts() {
  return (
    <section className="lsection" id="contracts">
      <div className="lcontainer">
        <div className="lsection-head">
          <div className="lsection-tag">Contracts</div>
          <h2>Deployed & verified on Arc.</h2>
        </div>
        <div className="lcontract-list">
          {CONTRACTS.map((c) => (
            <div className="lcontract-item" key={c.name}>
              <div>
                <div className="name">{c.name}</div>
                <div className="addr">{c.addr}</div>
              </div>
              <a href={c.link} target="_blank" rel="noreferrer">View →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
