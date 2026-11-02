# ⚡ ArcNetting

> Multilateral obligation netting & USDC settlement on **Arc Mainnet**.
> Inspired by [Cycles](https://community.arc.io/home/blogs/arc-cycles-multilateral-clearing-and-settlement-on-arc-2026-07-17) — net B2B obligations off-chain, settle residuals on-chain in USDC.

[![Arc Mainnet](https://img.shields.io/badge/Arc%20Mainnet-5042-2775ca)](https://explorer.arc.io)
[![Tests](https://img.shields.io/badge/tests-10%2F10%20passing-10b981)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

---

## What it does

Traditional B2B payments settle **gross**: A pays B 100, B pays C 100, C pays A 80 → **3 transfers, 280 USDC of liquidity tied up**.

ArcNetting nets these multilaterally: only **residual positions** move. In the triangle above, the net is a single **20-USDC transfer** → **92.86% liquidity saved**.

```
A owes B 100          A net:  -20         ┌─────────────────┐
B owes C 100    ──►   B net:    0   ──►   │ A → C: 20 USDC  │
C owes A  80          C net:  +20         └─────────────────┘
  gross 280             netted 20            1 transfer
```

---

## Table of contents

- [Mainnet deployment](#-mainnet-deployment--arc-mainnet)
- [Testnet pilot](#-testnet-pilot-2026-07-18)
- [Repo layout](#-repo-layout)
- [Quickstart](#-quickstart)
- [Architecture](#-architecture)
- [Arc Mainnet facts](#-arc-mainnet-facts)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Mainnet deployment — Arc Mainnet

| Item | Value |
|---|---|
| **NettingHub** | _Not deployed yet — fill in after running the deploy script_ |
| Network | Arc Mainnet (chain ID `5042`) |
| Explorer | https://explorer.arc.io |
| Frontend | https://wuhanmf3.de5.net |

---

## 🧪 Testnet pilot (2026-07-18)

Before the mainnet launch, the contract was piloted on Arc Testnet (chain ID `5042002`).

| Item | Value |
|---|---|
| **NettingHub** | [`0xFb906A05D849729825e54ebD737bdC936E91271D`](https://testnet.arcscan.app/address/0xFb906A05D849729825e54ebD737bdC936E91271D) |
| Deploy tx | [`0x93e79166…fe36dca`](https://testnet.arcscan.app/tx/0x93e79166e2cb9bcd3d96615c0b3215ea9ae07299667fa3df148fd5ab6fe36dca) |
| Deployer / operator | `0xBC841F74E7EacF909a3662b11a3a588BEe3b071C` |
| Frontend | https://wuhanmf3.de5.net |
| Deployed | 2026-07-18 |

### End-to-end settlement demo (testnet cycle #1)

3-party multilateral netting executed on-chain:

| Party | Address | Role |
|---|---|---|
| Alice Co | `0xBC841F74E7EacF909a3662b11a3a588BEe3b071C` | net payer |
| Bob Ltd | `0x95eF52c3aB70D0A7129ff0fc5d862ec1bAe27933` | zero net |
| Carol Inc | `0xFfFfC0eA7C093Daa2726106753b52533Bd26Dadc` | net receiver |

| Obligation | Debtor → Creditor | Amount |
|---|---|---|
| #3 | Alice → Bob | 1.0 USDC |
| #4 | Bob → Carol | 1.0 USDC |
| #5 | Carol → Alice | 0.8 USDC |

| Metric | Value |
|---|---|
| Gross | 2.8 USDC |
| **Net settled** | **0.2 USDC** (Alice → Carol) |
| **Liquidity saved** | **2.6 USDC (92.86%)** |
| closeCycle tx | [`0x41573b8f…e868de`](https://testnet.arcscan.app/tx/0x41573b8ff96a08a3ee0e8d2b6c592f233fc75fe815e619e1e0cced00d9e868de) |
| settle tx | [`0x3c67b55c…d02880`](https://testnet.arcscan.app/tx/0x3c67b55cf122cece36c036218c72fef7b615fc2998c7ef21ef94d71a57d02880) |
| Settled event | `cycle=1, nettedAmount=200000, savedAmount=2600000, transferCount=2` |

---

## 📁 Repo layout

```
arcnetting/
├── contracts/                    Foundry project (Solidity)
│   ├── src/NettingHub.sol              main contract (register/submit/confirm/net-settle)
│   ├── test/NettingHub.t.sol           5 unit tests
│   ├── test/mocks/MockUSDC.sol         ERC-20 mock for tests
│   ├── script/Deploy.s.sol             Arc Mainnet deploy script
│   ├── foundry.toml                    RPC + remappings
│   └── .env.example                    PRIVATE_KEY template
│
├── netting-engine/               Off-chain netting engine (TypeScript)
│   ├── src/netting.ts                  greedy min-transfer algorithm
│   ├── src/netting.test.ts             5 tests incl. 50-trial fuzz
│   └── src/demo.ts                     runnable demo
│
├── frontend/                     Vite + React + Wagmi + Viem dApp
│   ├── src/pages/Landing.tsx           marketing landing page
│   ├── src/pages/Dapp.tsx              console (register/submit/settle)
│   ├── src/pages/landing/              landing page section components
│   ├── src/components/                 dApp cards (Register/Obligations/Settle/Stats)
│   ├── src/netting.ts                  browser-side netting engine
│   ├── src/abi.ts                      contract ABIs
│   ├── src/chain.ts                    Arc Mainnet chain config
│   └── .env.example                    VITE_NETTING_HUB_ADDRESS template
│
├── docs/                         Documentation
│   └── VERIFICATION.md                 Arc docs cross-check report
│
├── design/                       Design mockups (optional)
│   └── landing-v1.html                 original HTML design prototype
│
├── .gitignore
└── README.md                     ← you are here
```

---

## 🏁 Quickstart

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | ≥ 20 | https://nodejs.org |
| pnpm | ≥ 9 | `npm install -g pnpm` |
| Foundry | ≥ 1.0 | https://getfoundry.sh |

### 1. Contracts — build & test

```bash
cd contracts
forge install        # install OpenZeppelin + forge-std
forge build
forge test -vv
```

Expected: **5/5 tests pass** (triangle netting, creditor-only confirm, balance check, operator auth, savings event).

### 2. Netting engine — test

```bash
cd netting-engine
pnpm install
pnpm test           # 5 vitest tests incl. fuzz
pnpm demo           # runnable walk-through
```

### 3. Deploy to Arc Mainnet

⚠ This uses real funds. Fund a dedicated deployer wallet with a small amount of USDC (used for gas), then:

```bash
cd contracts
cp .env.example .env
# edit .env: PRIVATE_KEY=0x<your mainnet deployer key>

source .env
forge script script/Deploy.s.sol \
  --rpc-url arc_mainnet \
  --broadcast \
  --legacy \
  -vvvv
```

Copy the printed `NettingHub: 0x…` address.

### 4. Frontend

```bash
cd frontend
pnpm install
cp .env.example .env.local
# edit .env.local: VITE_NETTING_HUB_ADDRESS=0xYourDeployedAddress

pnpm dev            # dev server at http://localhost:5173
pnpm build          # production build → dist/
```

### 5. Deploy frontend (Cloudflare Pages example)

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy dist --project-name=arcnetting
```

Then add a CNAME in Cloudflare DNS pointing to `arcnetting.pages.dev`, and set up a custom domain in the Pages dashboard. **Important:** add a `public/_redirects` file with `/*    /index.html   200` so React Router works on refresh.

---

## 🏗 Architecture

```
┌──────────────┐      obligations       ┌─────────────────┐
│              │ ──────────────────────►│                 │
│  Enterprises │                        │  NettingHub.sol │
│  (wallets)   │ ◄──────────────────────│  (on Arc)       │
│              │   settle residuals     │                 │
└──────────────┘                        └────────┬────────┘
                                                 ▲
                                                 │ closeCycle + settle
                                                 │
                                        ┌────────┴────────┐
                                        │  Operator       │
                                        │  (off-chain     │
                                        │   netting       │
                                        │   engine)       │
                                        └─────────────────┘
```

- **On-chain**: `NettingHub.sol` holds no netting logic — it only records obligations, enforces bilateral confirmation, and atomically executes the net settlement the operator submits. Gas cost = O(transfers), not O(obligations).
- **Off-chain**: TypeScript engine computes net positions, greedily matches largest debtor↔creditor → ≤ n−1 transfers for n parties.
- **Savings metric**: `Settled` event emits `nettedAmount`, `savedAmount`, `transferCount` — directly measurable value proposition.

### Why this design?

1. **Trust minimization** — netting math happens off-chain (verifiable), settlement happens on-chain (atomic).
2. **Gas efficiency** — no quadratic obligation loops on-chain; contract only processes the final net transfers.
3. **Auditability** — every obligation is recorded on-chain with bilateral consent; anyone can recompute the netting and verify the settlement matches.

---

## 📊 Arc Mainnet facts

| Field | Value |
|---|---|
| Chain ID | `5042` (`0x13B2`) |
| RPC | `https://rpc.mainnet.arc.io` |
| Explorer | https://explorer.arc.io |
| Native gas | USDC (18 decimals) |
| ERC-20 USDC | `0x3600000000000000000000000000000000000000` (6 decimals) |
| CCTP domain | 26 (per current docs) |

⚠ **Important Arc quirk:** native USDC and ERC-20 USDC share the same underlying balance. ERC-20 transfers and gas fees both deduct from the same pool. See `docs/VERIFICATION.md` for full cross-check report.

---

## 🔐 Security

- **Mainnet = real funds** — get the contracts audited before deploying, and use a dedicated deployer key.
- **Bilateral confirmation** — obligations require both debtor submission and creditor confirmation before entering a cycle.
- **Reentrancy protection** — `settle()` uses OpenZeppelin `ReentrancyGuard` + `SafeERC20`.
- **Access control** — only the owner can designate operators; only operators can close cycles / settle.
- **No private keys in repo** — all deployment keys are passed via `.env` (gitignored). Never commit `.env` or `.env.local` files containing keys.
- **Event auditability** — all state changes emit events (`Registered`, `ObligationCreated`, `ObligationApproved`, `CycleClosed`, `Settled`, `Transfer`).

---

## 🤝 Contributing

This is an MVP built in a single day as an Arc ecosystem demo. Contributions welcome:

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/bigger-netting`)
3. Write tests for your change (`forge test` for contracts, `pnpm test` for TS)
4. Open a PR

Ideas for v2:

- Multi-cycle netting (carry unsettled obligations forward)
- Integration with Circle CCTP for cross-chain netting
- On-chain netting verification (zk-proof of correct netting)
- Webhook notifications for obligation confirmation requests
- CLI tool for operators (`arcnetting close-cycle --ids 0,1,2`)

---

## 📚 Documentation

- [`docs/VERIFICATION.md`](./docs/VERIFICATION.md) — cross-check of Arc docs vs. values used in this project
- [`design/landing-v1.html`](./design/landing-v1.html) — original HTML design prototype
- Arc docs: https://docs.arc.io
- Circle docs: https://developers.circle.com
- Cycles inspiration: https://community.arc.io/home/blogs/arc-cycles-multilateral-clearing-and-settlement-on-arc-2026-07-17

---

## 📄 License

MIT — see [`LICENSE`](./LICENSE).

---

## 🙏 Acknowledgements

- **[Cycles](https://community.arc.io/)** — for pioneering multilateral clearing on Arc and inspiring this project
- **Circle** — for Arc, USDC, and the App Kit ecosystem
- **OpenZeppelin** — for battle-tested contract libraries
- **Foundry** — for the best Solidity tooling

---

<div align="center">
  <sub>Built on <a href="https://docs.arc.io">Arc</a> · Powered by <a href="https://www.circle.com/usdc">USDC</a> · Arc Mainnet</sub>
</div>
