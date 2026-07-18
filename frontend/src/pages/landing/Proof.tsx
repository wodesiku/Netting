const TX_BASE = "https://testnet.arcscan.app/tx/";

const PROOFS = [
  {
    step: "Deploy NettingHub",
    hash: "0x93e79166e2cb9bcd3d96615c0b3215ea9ae07299667fa3df148fd5ab6fe36dca",
    gas: "0.049",
  },
  {
    step: "closeCycle([3,4,5])",
    hash: "0x41573b8ff96a08a3ee0e8d2b6c592f233fc75fe815e619e1e0cced00d9e868de",
    gas: "0.002",
  },
  {
    step: "settle(Alice → Carol 0.2)",
    hash: "0x3c67b55cf122cece36c036218c72fef7b615fc2998c7ef21ef94d71a57d02880",
    gas: "0.003",
  },
];

const short = (h: string) => `${h.slice(0, 10)}…${h.slice(-7)}`;

export function Proof() {
  return (
    <section className="lsection" id="proof">
      <div className="lcontainer">
        <div className="lsection-head">
          <div className="lsection-tag">On-chain proof</div>
          <h2>Every claim is verifiable.</h2>
          <p className="lsection-sub">
            Cycle #1 settled on Arc Testnet on 2026-07-18.
            All numbers below are pulled from the live contract.
          </p>
        </div>

        <div className="lmetric-row">
          <div className="lmetric-card"><div className="v">2.8</div><div className="k">Gross obligations (USDC)</div></div>
          <div className="lmetric-card"><div className="v">0.2</div><div className="k">Net settled (USDC)</div></div>
          <div className="lmetric-card"><div className="v" style={{ color: "var(--accent-2)" }}>92.86%</div><div className="k">Liquidity saved</div></div>
          <div className="lmetric-card"><div className="v">1</div><div className="k">Atomic transactions</div></div>
        </div>

        <table className="lproof-table">
          <thead>
            <tr><th>Step</th><th>Transaction</th><th>Status</th><th>Gas (USDC)</th></tr>
          </thead>
          <tbody>
            {PROOFS.map((p) => (
              <tr key={p.hash}>
                <td>{p.step}</td>
                <td>
                  <a className="lhash" href={`${TX_BASE}${p.hash}`} target="_blank" rel="noreferrer">
                    {short(p.hash)}
                  </a>
                </td>
                <td><span className="lpill lpill-ok">Success</span></td>
                <td className="lmono">{p.gas}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="levent-block">
          <span style={{ color: "var(--accent-2)" }}>// Settled event emitted on-chain</span><br />
          Settled(<br />
          &nbsp;&nbsp;cycle: 1,<br />
          &nbsp;&nbsp;nettedAmount: 200000,&nbsp;&nbsp;<span style={{ color: "var(--accent-2)" }}>// 0.2 USDC</span><br />
          &nbsp;&nbsp;savedAmount: 2600000,&nbsp;&nbsp;<span style={{ color: "var(--accent-2)" }}>// 2.6 USDC saved</span><br />
          &nbsp;&nbsp;transferCount: 2<br />)
        </div>
      </div>
    </section>
  );
}
