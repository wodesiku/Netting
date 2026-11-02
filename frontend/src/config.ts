// The deployed NettingHub address on Arc mainnet (set VITE_NETTING_HUB_ADDRESS).
// After `forge script script/Deploy.s.sol --broadcast`, paste the address here.
export const NETTING_HUB_ADDRESS =
  (import.meta.env.VITE_NETTING_HUB_ADDRESS as `0x${string}` | undefined) ??
  "0x0000000000000000000000000000000000000000";
