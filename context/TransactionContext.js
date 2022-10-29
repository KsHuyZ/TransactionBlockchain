import { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../lib/constants";
import { client } from "../lib/sanityClient";
export const TransactionContext = createContext();
import { detectEthereumProvider } from "@metamask/detect-provider/dist/detect-provider";
let eth;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ addressTo: "", amount: 0 });
  const [provider, setProvider] = useState();

  useEffect(() => {
    if (!currentAccount) return;
    const createSanity = async () => {
      const userDoc = {
        _type: "user",
        _id: currentAccount,
        userName: "Unnamed",
        address: currentAccount,
      };

      await client.createIfNotExists(userDoc);
    };
    createSanity();
  }, [currentAccount]);

  const connectWallet = async (metamask = eth) => {
    try {
      if (!metamask) return alert("Please install metamask");
      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        console.log("wallet is already connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkWalletConnected = async (metamask = eth) => {
    try {
      if (!metamask) return alert("Please install metamask");
      const accounts = await eth.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        console.log("wallet is already connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEtherumContract = async () => {
    const provider = new ethers.providers.Web3Provider(eth);
    const signer = provider.getSigner();

    const transactionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    console.log("transaction contract:", transactionContract);
    return transactionContract;
  };

  const saveTransaction = async (
    txHash,
    amount,
    fromAddress = currentAccount,
    toAddress
  ) => {
    const txDoc = {
      _type: "transactions",
      _id: txHash,
      fromAddress,
      toAddress,
      timestamp: new Date(Date.now()).toISOString(),
      txHash,
      amount: parseFloat(amount),
    };

    await client.createIfNotExists(txDoc);
    await client
      .patch(currentAccount)
      .setIfMissing({ transactions: [] })
      .insert("after", "transactions[-1]", [
        {
          _key: txHash,
          _ref: txHash,
          _type: "reference",
        },
      ])
      .commit();
  };

  const sendTransaction = async (
    metamask = eth,
    connectedAccount = currentAccount
  ) => {
    try {
      if (!metamask) return alert("Please install metamask");
      const { addressTo, amount } = formData;
      const transactionContract = await getEtherumContract();
      const parsedAmount = ethers.utils.parseEther(amount);
      await metamask.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: "0x7EF40",
            value: parsedAmount._hex,
          },
        ],
      });
      const transactionHash = await transactionContract.publishTransaction(
        addressTo,
        parsedAmount,
        `Transferring ETH ${parsedAmount} to ${addressTo}`,
        "TRANSFER"
      );
      setIsLoading(true);
      await transactionHash.wait();

      // DB
      await saveTransaction(
        transactionHash.hash,
        amount,
        connectedAccount,
        addressTo
      );
      setIsLoading(false);
      setFormData({ addressTo: "", amount: 0 });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts) {
      setCurrentAccount(accounts[0]);
    });
    checkWalletConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        sendTransaction,
        handleChange,
        formData,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
