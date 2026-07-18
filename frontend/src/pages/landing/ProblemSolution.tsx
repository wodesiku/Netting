export function ProblemSolution() {
  return (
    <section className="lsection" id="how">
      <div className="lcontainer">
        <div className="lsection-head">
          <div className="lsection-tag">The problem</div>
          <h2>Gross settlement ties up capital.</h2>
          <p className="lsection-sub">
            In a network of trading partners, most obligations cancel each other out.
            Yet traditional rails settle every leg in full — multiplying both
            the liquidity locked and the number of on-chain transactions.
          </p>
        </div>
        <div className="lcompare">
          <div className="lcompare-card bad">
            <div className="lcompare-label">Gross settlement</div>
            <div className="lcompare-title">Every invoice moves in full</div>
            <ul className="lcompare-list">
              <li>A pays B 100, B pays C 100, C pays A 80</li>
              <li>3 on-chain transfers, 280 USDC of float</li>
              <li>Capital sits idle between legs</li>
              <li>Each transfer pays gas and slippage</li>
            </ul>
            <div className="lcompare-metric">
              <span className="num">280</span>
              <span className="lbl">USDC moved</span>
            </div>
          </div>
          <div className="lcompare-card good">
            <div className="lcompare-label">Multilateral netting</div>
            <div className="lcompare-title">Only the residual moves</div>
            <ul className="lcompare-list">
              <li>Map obligations across all counterparties</li>
              <li>Net off-chain: A net −20, B net 0, C net +20</li>
              <li>Settle one atomic transaction on Arc</li>
              <li>Capital efficiency approaches theoretical max</li>
            </ul>
            <div className="lcompare-metric">
              <span className="num">20</span>
              <span className="lbl">USDC moved · 92.86% saved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
