export function Footer() {
  return (
    <footer className="lfooter">
      <div className="lcontainer">
        <div className="lfooter-grid">
          <div className="lfooter-col">
            <div className="llogo" style={{ marginBottom: 12 }}>
              <div className="llogo-dot"></div>ArcNetting
            </div>
            <div style={{ fontSize: 13, maxWidth: 280 }}>
              Multilateral clearing and obligation netting for the Arc ecosystem.
              Built on Circle's programmable money chain.
            </div>
          </div>
          <div className="lfooter-col">
            <h4>Product</h4>
            <a href="#how">How it works</a>
            <a href="#proof">On-chain proof</a>
            <a href="#contracts">Contracts</a>
          </div>
          <div className="lfooter-col">
            <h4>Developers</h4>
            <a href="https://docs.arc.io" target="_blank" rel="noreferrer">Arc Docs</a>
            <a href="https://explorer.arc.io" target="_blank" rel="noreferrer">Arc Explorer</a>
          </div>
          <div className="lfooter-col">
            <h4>Community</h4>
            <a href="https://community.arc.io" target="_blank" rel="noreferrer">Arc House</a>
            <a href="https://x.com" target="_blank" rel="noreferrer">X (Twitter)</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
        <div className="lfooter-bottom">
          <span>© 2026 ArcNetting. Built on Arc.</span>
          <span className="lmono">chain 5042 · usdc native gas</span>
        </div>
      </div>
    </footer>
  );
}
