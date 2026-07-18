# Documentation verification — 2026-07-18

Cross-checked the values in `../ARC_BUILDER_AI_GUIDE.md` against live https://docs.arc.io pages.

## ✅ Matches guide

| Field | Guide | Live docs | Status |
|---|---|---|---|
| Chain ID | 5042002 | 5042002 | ✅ |
| RPC | https://rpc.testnet.arc.network | same | ✅ |
| Explorer | https://testnet.arcscan.app | same | ✅ |
| Faucet | https://faucet.circle.com | same | ✅ |
| Native gas | USDC, 18 decimals | same | ✅ |
| ERC-20 USDC | 6 decimals | same | ✅ |
| ERC-20 USDC addr | 0x3600000000000000000000000000000000000000 | same | ✅ |
| EURC addr | 0x3600000000000000000000000000000000000001 | same | ✅ |
| CCTP TokenMessengerV2 | 0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA | same | ✅ |
| CCTP MessageTransmitterV2 | 0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275 | same | ✅ |
| Gateway Wallet | 0x0077777d7EBA4688BDeF3E311b846F25870A19B9 | same | ✅ |
| Gateway Minter | 0x0022222ABE238Cc2C7Bb1f21003F0a260052475B | same | ✅ |

## ⚠️ Discrepancy found

| Field | Guide | Live docs |
|---|---|---|
| CCTP domain | 36 | **26** |

The live Contract Addresses page lists CCTP contracts with **domain 26**, not 36 as in the guide.
This is only relevant if we integrate CCTP bridging (not used in the current MVP).

## Additional RPC endpoints (new in live docs)

Live docs now list multiple RPC providers:
- Primary: `https://rpc.testnet.arc.network`
- Blockdaemon: `https://rpc.blockdaemon.testnet.arc.network`
- dRPC: `https://rpc.drpc.testnet.arc.network`
- QuickNode: `https://rpc.quicknode.testnet.arc.network`

WebSocket endpoints are available for each provider as well.

## Action items

- [x] Project uses ERC-20 USDC at `0x3600000000000000000000000000000000000000` ✅
- [x] Project uses chain ID 5042002 ✅
- [x] Frontend native currency = USDC / 18 decimals ✅
- [ ] If CCTP is added later, use domain **26**, not 36.
