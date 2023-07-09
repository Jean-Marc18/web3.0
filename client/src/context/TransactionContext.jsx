import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionContract;
}

export const TransactionsProvider = ({ children }) => {
    const [connectedAccount, setConnectedAccount] = useState("");
    const [formData, setFormData] = useState({ addressTo: '', amount: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
    const [transactions, setTransactions] = useState([]);


    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    const checkWalletIsConnected = async () => {

        try {

            if (!ethereum) { alert('Please install Metamask'); }
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length) {
                setConnectedAccount(accounts[0]);
            } else {
                console.log('No account found');
            }

        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) { alert('Please install Metamask'); }
            const accounts = await ethereum.request({ method: 'eth_requestAccounts', });
            setConnectedAccount(accounts[0]);
            alert("It's ok 👍");
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) { alert('Please install Metamask'); }

            const { addressTo, amount, keyword, message } = formData;
            const transactionsContract = getEthereumContract();
            const parsedAmount = ethers.parseEther(amount);

            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: connectedAccount,
                    to: addressTo,
                    gas: "0x5208",
                    value: parsedAmount._hex,
                }],
            });

            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Succes - ${transactionHash.hash}`);

            const transactionsCount = await transactionsContract.getTransactionCount();

            setTransactionCount(transactionsCount.toNumber());
            window.location.reload();

        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    useEffect(() => {
        checkWalletIsConnected();
    }, []);


    return (
        <TransactionContext.Provider value={{ connectWallet, connectedAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}