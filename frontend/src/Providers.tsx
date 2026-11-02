import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";
import { arcMainnet } from "./chain";

export const wagmiConfig = createConfig({
  chains: [arcMainnet],
  connectors: [injected()],
  transports: {
    [arcMainnet.id]: http(arcMainnet.rpcUrls.default.http[0]),
  },
});

export const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
