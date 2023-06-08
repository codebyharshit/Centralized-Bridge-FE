import React, { useState } from "react";
import "./App.css";
import Web3Modal from "web3modal";
import { bridgeEth, bridgeMatic } from "./config";
import { ethers } from "ethers";
import { parseEther } from "ethers";
import { JsonRpcProvider } from "ethers";
import Web3 from "web3";
import Token from "./ABI/Token";
import Bridge from "./ABI/Bridge";
// import CircularIndeterminate from "../Loader";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(address, fromChain, toChain, amount);

    if (fromChain == "goerli") {
      // const web3Modal = new Web3Modal();
      // const connection = await web3Modal.connect();
      // console.log("connection", connection);
      // const provider = new ethers.BrowserProvider(connection);
      // const signer = provider.getSigner();
      // const contract = new ethers.Contract(bridgeEth, Bridge, signer);
      // console.log(contract);
      // const value = parseEther(amount); // Convert to token's decimal format if needed
      // console.log("value", value.toString());
      // const finalValue = value.toString();
      // // const tx = await contract.toAdd();
      // //   console.log("tx", tx);
      // try {
      //   const tx = await contract.bridgeToken(finalValue, "0");
      //   await tx.wait();
      //   console.log("Tokens transferred successfully!");
      // } catch (error) {
      //   console.error("Error transferring tokens:", error);
      // }
      const web3Modal = new Web3Modal();
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      console.log("web3", web3);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Bridge, bridgeEth);
      const value = parseEther(amount);
      console.log("value", value.toString());
      const finalValue = value.toString();
      try {
        setIsLoader(true);
        const tx = await contract.methods
          .bridgeToken(finalValue, 1)
          .send({ from: accounts[0] });
        setIsLoader(false);
        console.log("Tokens transferred successfully!");
      } catch (error) {
        setIsLoader(true);
        console.error("Error transferring tokens:", error);
      }
    } else {
      const web3Modal = new Web3Modal();
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      console.log("web3", web3);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Bridge, bridgeMatic);
      const value = parseEther(amount);
      console.log("value", value.toString());
      const finalValue = value.toString();
      try {
        setIsLoader(true);
        const tx = await contract.methods
          .bridgeToken(finalValue, 1)
          .send({ from: accounts[0] });
        setIsLoader(false);
        console.log("Tokens transferred successfully!");
      } catch (error) {
        setIsLoader(false);
        console.error("Error transferring tokens:", error);
      }
    }
  };

  return (
    <div className="App">
      {isLoader ? <h1>Loading...</h1> : ""}
      <h1>Bridge Application</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Address:
          <input type="text" value={address} onChange={handleAddressChange} />
        </label>
        <br />
        <label>
          <label>
            Enter Amount:
            <input type="number" value={amount} onChange={handleAmountChange} />
          </label>
          Choose Chain to Bridge From:
          <select value={fromChain} onChange={handleFromChainChange}>
            <option value="">Select a chain</option>
            <option value="goerli">Ethreum Goerli</option>
            <option value="matic">Polygon Matic</option>
          </select>
        </label>
        <br />
        <br />
        <label>
          Choose Chain to Mint Tokens To:
          <select value={toChain} onChange={handleToChainChange}>
            <option value="">Select a chain</option>
            <option value="goerli">Ethreum Goerli</option>
            <option value="matic">Polygon Matic</option>
          </select>
        </label>
        <br />
        <button type="submit">Bridge</button>
      </form>
    </div>
  );
}

export default App;
