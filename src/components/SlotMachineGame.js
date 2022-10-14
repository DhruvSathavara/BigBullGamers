import React, { useState, useEffect } from "react";

import Reel from "./Reel";
import "../index.css";
import Web3 from "web3";
import RandomNumberGenerator from "../abi/RandomNumberGenerator.json";
import { RandomNumberGeneratorContract } from "../config";

function SlotMachine() {
  const [account, setAccount] = useState(null);
  const [randomNumContract, setRandomNumContract] = useState(null);
  const [randomNumber, setRandomNumber] = useState();

  const [reels, setReel] = useState([
      //create an array for what we want to disaplay for spin
      ["😍", "🍎", "🍎", "😍", "🍇", "🍇", "💰", "💰"],
      ["💰", "🍎", "💰", "😍", "🍇", "🍎", "🍇", "💰"],
      ["💰", "🍎", "💰", "🍎", "🍇", "💰", "🍇", "💰"],
    ]),
    [coins, changeCoins] = useState(5), //By default for spin we gave 5 coins
    [spinError, setSpinError] = useState(false),
    [addedCoins, setAddedCoins] = useState(0),
    [coinsFor, setCoinsFor] = useState({}),
    [currentReel, setCurrentReel] = useState([
      { index: 0 },
      { index: 0 },
      { index: 0 },
    ]),
    [spinner, setSpinner] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      spin(false);
      setSpinner(false);
    }, 1000);
  }, [reels]);

  useEffect(() => {
    load();
  }, []);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async function caller() {
    await randomNumContract.methods
      .getRandomNumber(reels[0].length - 1)
      .send({ from: account });
    const randNo = await randomNumContract.methods.getRandom().call();
    setRandomNumber(randNo);
  }

  async function load() {
    await loadWeb3();
    await loadBlockchainData();
  }

  async function loadBlockchainData() {
    const web3 = window.web3;
    let accounts;
    accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    window.ethereum.on("accountsChanged", function (acc) {
      accounts = acc;
    });

    // Load smart contract
    const networkId = await web3.eth.net.getId();

    if (networkId) {
      const abi = RandomNumberGenerator.abi;
      const randomNumber = new web3.eth.Contract(
        abi,
        RandomNumberGeneratorContract
      );

      setRandomNumContract(randomNumber);
    }
  }

  const spin = async (updateCoins) => {
    let newReel = [];

    const newCurrentReel = reels.map(async (reel) => {
      return {
        index: parseInt(randomNumber),
        name: reel[randomNumber],
      };
    });

    for (let i = 0; i < newCurrentReel.length; i++) {
      let result = await newCurrentReel[i];
      newReel.push(result);
    }

    if (updateCoins) calculateCoins(newReel);

    setCurrentReel(newReel);
  };

  const handleSpin = async (_) => {
    const newCoins = coins - 1;
    const error = newCoins === 0 ? true : false;

    changeCoins(newCoins);
    setSpinError(error);
    setSpinner(true); 

    setTimeout(async () => {
      await caller();
      setSpinner(false);
    }, 1000);
  };

  useEffect(() => {
    randomNumber !== null && spin(true);
  }, [randomNumber]);

  const calculateCoins = (currentReel) => {
    const reelsCount = currentReel
        .map((dataItem) => dataItem.name) // get all name types
        .filter((name, index, array) => array.indexOf(name) === index), // filter out duplicates
      winningCounts = reelsCount
        .map((name) => ({
          name: name,
          count: currentReel.filter((item) => item.name === name).length,
        }))
        .filter((item) => item.count > 1);

    let newAddedCoins = 0;
    console.log(winningCounts);

    // calculate points for each winning reel
    winningCounts.map((eachCount, index) => {
      switch (eachCount.name) {
        case "🍎":
          if (eachCount.count === 3) {
            newAddedCoins = 20;
          } else if (eachCount.count === 2) {
            newAddedCoins = 10;
          }
          break;
        case "🍇":
          if (eachCount.count === 3) {
            newAddedCoins = 15;
          } else if (eachCount.count === 2) {
            newAddedCoins = 5;
          }
          break;
        case "😍":
          if (eachCount.count === 3) {
            newAddedCoins = 50;
          } else if (eachCount.count === 2) {
            newAddedCoins = 40;
          }
          break;
        case "💰":
          if (eachCount.count === 3) {
            newAddedCoins = 30;
          }
          break;
        default:
          return newAddedCoins;
      }
    });

    changeCoins(coins + newAddedCoins - 1);
    setCoinsFor(winningCounts.length ? winningCounts[0] : {});
    setAddedCoins(newAddedCoins);
  };

  return (
    <div className="app">
      <h3 className="p-0 m-0">Slot Machine - click Spin to play</h3>
      <p className="p-0 m-0">1 spin = 1 coin</p> 
      <p className="p-0 m-0">
        Match two or three similar items to win coins. (exception: 2 💰 = 0
        coins)
      </p>
      <div className="slot theme-dark-bg m-2">
        <h2 className="slot__heading">Slot Machine</h2>
        <div className="slot__win-message">
          {addedCoins > 0 ? (
            <span className="success">
              You Won {addedCoins} coins for {coinsFor.count} {coinsFor.name} !!
            </span>
          ) : null}
        </div>
        <p>
          Coins: <strong>{coins}</strong>
        </p>
        <div className="slot__slot-container">
          {reels.map((reelItem, index) => (
            <Reel
              reelItem={reelItem}
              key={index}
              selectedReel={currentReel[index]}
              spinner={spinner}
            />
          ))}
        </div>
        {spinError && (
          <span className="error">Game over. Add more coins to play</span>
        )}
        <button
          className="btn btn-primary slot__spin-button"
          onClick={handleSpin}
          disabled={coins === 0}
        >
          Spin
        </button>
      </div>
    </div>
  );
}

export default SlotMachine;
