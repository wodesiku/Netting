import { defineChain } from "viem";

// Arc mainnet. Source: https://docs.arc.io/arc/references/connect-to-arc.md
export const arcMainnet = defineChain({
  id: 5042,
  name: "Arc",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.mainnet.arc.io"],
      webSocket: ["wss://rpc.mainnet.arc.io"],
    },
  },
  blockExplorers: {
    default: { name: "Arc Explorer", url: "https://explorer.arc.io" },
  },
});

export const EXPLORER_URL = arcMainnet.blockExplorers.default.url;

export const USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as const;
export const USDC_DECIMALS = 6;
