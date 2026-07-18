export function Nav() {
  return (
    <nav className="lnav">
      <div className="lcontainer lnav-inner">
        <div className="llogo">
          <div className="llogo-dot"></div>ArcNetting
        </div>
        <div className="lnav-links">
          <a href="#how">How it works</a>
          <a href="#proof">On-chain proof</a>
          <a href="#contracts">Contracts</a>
          <a href="https://docs.arc.io" target="_blank" rel="noreferrer">Arc Docs</a>
        </div>
        <div>
          <a
            className="lbtn lbtn-sm"
            href="https://testnet.arcscan.app/address/0xFb906A05D849729825e54ebD737bdC936E91271D"
            target="_blank" rel="noreferrer"
          >
            View on ArcScan
          </a>
          <a className="lbtn lbtn-sm lbtn-primary" href="/app" style={{ marginLeft: 8 }}>
            Launch App
          </a>
        </div>
      </div>
    </nav>
  );
}
