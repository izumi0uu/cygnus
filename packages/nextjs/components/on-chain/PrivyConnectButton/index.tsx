"use client";

import { useEffect, useState } from "react";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Balance } from "@scaffold-ui/components";
import { Address } from "viem";
import { useAccount, useDisconnect as useWagmiDisconnect } from "wagmi";
import { useNetworkColor } from "~~/hooks/on-chain";
import { useTargetNetwork } from "~~/hooks/on-chain";
import { getBlockExplorerAddressLink } from "~~/utils/on-chain";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Privy Connect Button Component
 * Replaces RainbowKit's ConnectButton with Privy's authentication
 */
export const PrivyConnectButton = () => {
  const { ready, authenticated, login, logout, getAccessToken, user } = usePrivy();
  const { wallets } = useWallets();
  const { address: wagmiAddress } = useAccount();
  const { disconnect: wagmiDisconnectFn } = useWagmiDisconnect();
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();
  const [appToken, setAppToken] = useState<string | null>(null);

  // Get the primary wallet address from Privy
  const walletAddress = wallets[0]?.address as Address | undefined;
  const displayAddress = walletAddress || wagmiAddress;

  // Authenticate with backend when Privy user is authenticated
  useEffect(() => {
    const authenticateWithBackend = async () => {
      if (authenticated && ready && !appToken) {
        try {
          // Get Privy access token
          const privyToken = await getAccessToken();
          if (!privyToken) {
            console.error("Failed to get Privy access token");
            return;
          }

          // Get wallet address from Privy
          const primaryWallet = wallets[0];
          const walletAddr = primaryWallet?.address;

          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${privyToken}`,
            },
            body: JSON.stringify({
              walletAddress: walletAddr,
            }),
          });

          if (!response.ok) {
            throw new Error(`Backend authentication failed: ${response.statusText}`);
          }

          const data = await response.json();
          setAppToken(data.access_token);

          // Store token in localStorage for future requests
          localStorage.setItem("app_token", data.access_token);
        } catch (error) {
          console.error("Error authenticating with backend:", error);
        }
      }
    };

    authenticateWithBackend();
  }, [authenticated, ready, getAccessToken, wallets, appToken]);

  // Load stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("app_token");
    if (storedToken) setAppToken(storedToken);
  }, []);

  const handleLogin = () => {
    login();
  };

  const handleLogout = async () => {
    // Clear app token
    localStorage.removeItem("app_token");
    setAppToken(null);

    // Disconnect Wagmi if connected
    if (wagmiAddress) wagmiDisconnectFn();

    // Logout from Privy
    logout();
  };

  if (!ready) {
    return (
      <button className="btn btn-primary btn-sm" disabled>
        Loading...
      </button>
    );
  }

  if (!authenticated || !displayAddress) {
    return (
      <button className="btn btn-primary btn-sm" onClick={handleLogin} type="button">
        Connect Wallet
      </button>
    );
  }

  const blockExplorerAddressLink = displayAddress
    ? getBlockExplorerAddressLink(targetNetwork, displayAddress)
    : undefined;

  return (
    <>
      <div className="flex flex-col items-center mr-2">
        <Balance
          address={displayAddress}
          style={{
            minHeight: "0",
            height: "auto",
            fontSize: "0.8em",
          }}
        />
        <span className="text-xs" style={{ color: networkColor }}>
          {targetNetwork.name}
        </span>
      </div>
      <AddressInfoDropdown
        address={displayAddress}
        displayName={user?.email?.address || displayAddress}
        ensAvatar={undefined}
        blockExplorerAddressLink={blockExplorerAddressLink}
        onDisconnect={handleLogout}
      />
      <AddressQRCodeModal address={displayAddress} modalId="qrcode-modal" />
    </>
  );
};
