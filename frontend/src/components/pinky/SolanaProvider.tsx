import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Buffer } from "buffer";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import "@solana/wallet-adapter-react-ui/styles.css";

const ENDPOINT = "https://api.devnet.solana.com";

export function SolanaProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).Buffer = (window as any).Buffer || Buffer;
    }
    setMounted(true);
  }, []);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}