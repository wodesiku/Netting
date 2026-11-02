import { EXPLORER_URL } from "../../chain";
import { NETTING_HUB_ADDRESS } from "../../config";

const hubDeployed = NETTING_HUB_ADDRESS !== "0x0000000000000000000000000000000000000000";

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
          {hubDeployed && (
            <a
              className="lbtn lbtn-sm"
              href={`${EXPLORER_URL}/address/${NETTING_HUB_ADDRESS}`}
              target="_blank" rel="noreferrer"
            >
              View contract
            </a>
          )}
          <a className="lbtn lbtn-sm lbtn-primary" href="/app" style={{ marginLeft: 8 }}>
            Launch App
          </a>
        </div>
      </div>
    </nav>
  );
}
