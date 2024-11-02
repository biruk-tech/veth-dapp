'use client';

declare global {
	interface Window {
		ethereum?: any
	}
}

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, JsonRpcSigner, ethers } from 'ethers';

// Define types for our context
type Web3ContextType = {
  account: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  chainId: bigint | null;
};

// Create the context
const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

// Create the provider component
export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);

  // Initialize provider
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(BigInt(chainId));
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  // Connect wallet function
  const connect = async () => {
    if (!provider) {
      console.error('No provider found');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      
      setAccount(accounts[0]);
      setSigner(signer);
      setChainId(network.chainId);
    } catch (error) {
      console.error('Error connecting to MetaMask', error);
    }
  };

  // Disconnect wallet function
  const disconnect = () => {
    setAccount(null);
    setSigner(null);
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        connect,
        disconnect,
        isConnected: !!account,
        chainId,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

// Custom hook to use the Web3 context
export const useWeb3 = () => useContext(Web3Context);
