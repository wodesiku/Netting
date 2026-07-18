export function CTA() {
  return (
    <section className="lcta-section" id="cta">
      <div className="lcontainer">
        <h2>Start netting on Arc.</h2>
        <p className="lsection-sub" style={{ maxWidth: 480, margin: "0 auto 32px" }}>
          Connect your wallet, register your company, and settle your first
          multilateral netting cycle in under five minutes.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <a className="lbtn lbtn-primary" href="/app" style={{ padding: "12px 28px", fontSize: 15 }}>
            Launch App →
          </a>
          <a
            className="lbtn"
            href="https://faucet.circle.com"
            target="_blank" rel="noreferrer"
            style={{ padding: "12px 28px", fontSize: 15 }}
          >
            Get testnet USDC
          </a>
        </div>
      </div>
    </section>
  );
}
