function NettingDiagram() {
  const Arrow = () => (
    <svg height="20" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: "100%" }}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#2775ca" />
        </marker>
      </defs>
      <line x1="0" y1="10" x2="100" y2="10" className="lnet-arrow" />
    </svg>
  );
  return (
    <div className="lnet-card">
      <div className="lnet-card-head lmono">
        <span>CYCLE #1 · 3 PARTIES</span>
        <span style={{ color: "var(--accent-2)" }}>● SETTLED</span>
      </div>
      <div className="lnet-row"><div className="lnet-node">Alice</div><Arrow /><div className="lnet-node">Bob</div></div>
      <div className="lnet-row"><div className="lnet-node">Bob</div><Arrow /><div className="lnet-node">Carol</div></div>
      <div className="lnet-row"><div className="lnet-node">Carol</div><Arrow /><div className="lnet-node">Alice</div></div>
      <div className="lnet-summary">
        <span style={{ color: "var(--text-muted)" }}>3 gross obligations → 1 net transfer</span>
        <span className="save">−92.86% USDC moved</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="lhero">
      <div className="lcontainer lhero-inner">
        <div>
          <div className="leyebrow">Built on Arc</div>
          <h1>
            Net obligations.<br />
            <span className="laccent">Settle residuals.</span>
          </h1>
          <p className="lhero-sub">
            ArcNetting is a multilateral clearing primitive for B2B payments.
            Map obligations across your network, net them off-chain, and settle
            only the residual in USDC on Arc — atomically, transparently, in one transaction.
          </p>
          <div className="lhero-cta">
            <a className="lbtn lbtn-primary" href="/app">Launch App →</a>
            <a className="lbtn" href="#how">How it works</a>
          </div>
          <div className="lhero-stats">
            <div className="lhstat"><div className="v">92.86%</div><div className="k">Liquidity saved</div></div>
            <div className="lhstat"><div className="v">2.8 → 0.2</div><div className="k">Gross → Net USDC</div></div>
            <div className="lhstat"><div className="v">1 tx</div><div className="k">Atomic settlement</div></div>
            <div className="lhstat"><div className="v">5042002</div><div className="k">Arc Chain ID</div></div>
          </div>
        </div>

        <div className="lhero-visual">
          <NettingDiagram />
        </div>
      </div>
    </section>
  );
}
