export function HowItWorks() {
  return (
    <section className="lsection lsection-alt">
      <div className="lcontainer">
        <div className="lsection-head">
          <div className="lsection-tag">How it works</div>
          <h2>Three steps to atomic settlement.</h2>
        </div>
        <div className="lsteps">
          <div className="lstep">
            <div className="lstep-num">1</div>
            <div className="lstep-title">Register & submit</div>
            <div className="lstep-desc">
              Enterprises register on-chain, then submit bilateral obligations
              (invoices) with an amount, counterparty, and due date.
            </div>
            <div className="lstep-code">
              <span className="k">submitObligation</span>(<br />
              &nbsp;&nbsp;creditor: 0x95eF…,<br />
              &nbsp;&nbsp;amount: 100 USDC,<br />
              &nbsp;&nbsp;dueDate: 2026-07-25<br />)
            </div>
          </div>
          <div className="lstep">
            <div className="lstep-num">2</div>
            <div className="lstep-title">Confirm & close cycle</div>
            <div className="lstep-desc">
              Counterparties confirm each obligation bilaterally.
              The operator snapshots confirmed items into a netting cycle.
            </div>
            <div className="lstep-code">
              <span className="k">closeCycle</span>([0, 1, 2])<br />
              <span style={{ color: "var(--accent-2)" }}>// locks 3 obligations</span>
            </div>
          </div>
          <div className="lstep">
            <div className="lstep-num">3</div>
            <div className="lstep-title">Net & settle</div>
            <div className="lstep-desc">
              Off-chain engine computes minimum transfers.
              One atomic <em>settle()</em> moves residuals in USDC on Arc.
            </div>
            <div className="lstep-code">
              <span className="k">settle</span>(<br />
              &nbsp;&nbsp;payers: [Alice],<br />
              &nbsp;&nbsp;receivers: [Carol]<br />)<br />
              <span style={{ color: "var(--accent-2)" }}>// net: 0.2 USDC moved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
