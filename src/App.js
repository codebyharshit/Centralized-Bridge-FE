import React, { useState } from "react";
import "./App.css";
import "./index.css";
import Web3Modal from "web3modal";
import { tokenEth, tokenMatic, bridgeEth, bridgeMatic, admin } from "./config";
import Web3 from "web3";
import Token from "./abi/token";
import Bridge from "./abi/bridge";
import Swal from "sweetalert2";
import {parseEther} from "ethers";

function App() {
  const [address, setAddress] = useState("");
  const [fromChain, setFromChain] = useState("");
  const [toChain, setToChain] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleFromChainChange = (e) => {
    setFromChain(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleToChainChange = (e) => {
    setToChain(e.target.value);
  };

  const getAllowance = async (from, TokenAddress, bridge) => {
    
    // try {
    //   const provider = new ethers.BrowserProvider(window.ethereum);
    //   await provider.send("eth_requestAccounts", [0]);
    //   const signer = provider.getSigner();
    //   const contract = new ethers.Contract(TokenAddress, Token, provider);
    //   const result = await contract.allowance(from, bridge);
    //   const allowance = result.toString();
    //   console.log(allowance);
    //   return allowance;
    // }

    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];
      web3.eth.defaultAccount = currentAccount;
      const contract = new web3.eth.Contract(Token, TokenAddress);
      const result = await contract.methods.allowance(from, bridge).call();
      const allowance = result.toString();
      return allowance;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(address, fromChain, toChain, amount);

    if (fromChain == "goerli") {
      const web3Modal = new Web3Modal();
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      console.log("web3", web3);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Bridge, bridgeEth);
      const value = parseEther(amount).toString();
      console.log("value", value.toString());
      const allowance = await getAllowance(accounts[0], tokenEth, bridgeEth);

      if (allowance >= amount) {
        try {
          setIsLoader(true);
          const tx = await contract.methods
            .bridgeToken(value, 1)
            .send({ from: accounts[0] });
          setIsLoader(false);

          Swal.fire({
            title: "Transaction Successful!",
            text: "Tokens transferred successfully!",
            icon: "success",
            confirmButtonText: "cancel",
          });

          console.log("Tokens transferred successfully!");
        } catch (error) {
          setIsLoader(true);
          Swal.fire({
            title: "Transaction Fail!",
            text: "Tokens Transaction Fail!",
            icon: "warning",
            confirmButtonText: "cancel",
          });
          console.error("Error transferring tokens:", error);
        }
      } else {
        Swal.fire({
          title: "Transaction Fail!",
          text: "Please allow enough tokens before proceeding!",
          icon: "warning",
          confirmButtonText: "cancel",
        });
      }
    } else {
      const web3Modal = new Web3Modal();
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      console.log("web3", web3);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Bridge, bridgeMatic);
      const value = parseEther(amount).toString();
      console.log("value", value);
      const allowance = await getAllowance(
        accounts[0],
        tokenMatic,
        bridgeMatic
      );

      if (allowance >= amount) {
        try {
          setIsLoader(true);
          const tx = await contract.methods
            .bridgeToken(value, 1)
            .send({ from: accounts[0] });
          setIsLoader(false);
          Swal.fire({
            title: "Transaction Successful!",
            text: "Tokens transferred successfully!",
            icon: "success",
            confirmButtonText: "cancel",
          });
          console.log("Tokens transferred successfully!");
        } catch (error) {
          setIsLoader(false);
          Swal.fire({
            title: "Transaction Fail!",
            text: "Tokens Transaction Fail!",
            icon: "warning",
            confirmButtonText: "cancel",
          });
          console.error("Error transferring tokens:", error);
        }
      } else {
        Swal.fire({
          title: "Transaction Fail!",
          text: "Please allow enough tokens before proceeding!",
          icon: "warning",
          confirmButtonText: "cancel",
        });
      }
    }
  };

  return (
    <div className="App bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
      {isLoader ? <h1 className="text-4xl mb-6 text-white">Loading...</h1> : ""}
      <h1 className="text-4xl mb-6 text-white ">Bridge Application</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="mb-1">Enter Address:</span>
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
            className="rounded bg-gray-800 text-white px-4 py-2"
          />
        </label>
        <div className="flex flex-col gap-2">
          <label className="flex flex-col">
            <span className="mb-1">Enter Amount:</span>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="rounded bg-gray-800 text-white px-4 py-2"
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Choose Chain to Bridge From:</span>
            <select
              value={fromChain}
              onChange={handleFromChainChange}
              className="rounded bg-gray-800 text-white px-4 py-2"
            >
              <option value="">Select a chain</option>
              <option value="goerli">Ethreum Goerli</option>
              <option value="matic">Polygon Matic</option>
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex flex-col">
            <span className="mb-1">Choose Chain to Mint Tokens To:</span>
            <select
              value={toChain}
              onChange={handleToChainChange}
              className="rounded bg-gray-800 text-white px-4 py-2"
            >
              <option value="">Select a chain</option>
              <option value="goerli">Ethreum Goerli</option>
              <option value="matic">Polygon Matic</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
        >
          Bridge
        </button>
      </form>
    </div>
  );
}

export default App;
