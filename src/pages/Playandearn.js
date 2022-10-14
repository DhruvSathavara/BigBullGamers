/* eslint-disable eqeqeq */
import React, { Fragment, useEffect, useState } from "react";
import Web3 from "web3";
import MemoryGameNFTToken from "../abi/MemoryGameNFT.json";
import Appfooter from "../components/Appfooter";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Popupchat from "../components/Popupchat";
import Rightchat from "../components/Rightchat";
import { memoryGameNFTToken } from "../config";
import { useMoralis } from "react-moralis";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import SlotMachine from "../components/SlotMachineGame";
import LuckyLottery from "./LuckyLottery";

const CARD_ARRAY = [
  {
    name: "moralis",
    img: "/assets/play/moralis.png",
  },
  {
    name: "ploygon",
    img: "/assets/play/polygon.jpg",
  },
  {
    name: "chainlink",
    img: "/assets/play/chainlink.png",
  },
  {
    name: "covalent",
    img: "/assets/play/covalent.png",
  },
  {
    name: "ipfs",
    img: "/assets/play/ipfs.png",
  },
  {
    name: "superfluid",
    img: "/assets/play/superfluid.png",
  },
  {
    name: "moralis",
    img: "/assets/play/moralis.png",
  },
  {
    name: "ploygon",
    img: "/assets/play/polygon.jpg",
  },
  {
    name: "chainlink",
    img: "/assets/play/chainlink.png",
  },
  {
    name: "covalent",
    img: "/assets/play/covalent.png",
  },
  {
    name: "ipfs",
    img: "/assets/play/ipfs.png",
  },
  {
    name: "superfluid",
    img: "/assets/play/superfluid.png",
  },
];

function PlayAndEarn() {
  const { Moralis, isInitialized } = useMoralis();
  const [account, setAccount] = useState();
  const [token, setToken] = useState(null);
  const [tokenURIs, setTokenURIs] = useState([]);
  const [cardArray, setCardArray] = useState([]);
  const [cardsChosen, setCardsChosen] = useState([]);
  const [cardsChosenId, setCardsChosenId] = useState([]);
  const [cardsWon, setCardsWon] = useState([]);
  const [alreadyChosen, setAlreadyChosen] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    caller();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (alreadyChosen === 1) {
      setTimeout(checkForMatch, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadyChosen]);

  async function caller() {
    setCardArray(CARD_ARRAY.sort(() => 0.5 - Math.random()));
    await loadWeb3();
    await loadBlockchainData();
  }

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

  async function loadBlockchainData() {
    const covalent = Moralis.Plugins.covalent;
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
      const abi = MemoryGameNFTToken.abi;
      const tokenl = new web3.eth.Contract(abi, memoryGameNFTToken);
      setToken(tokenl);

      // // Load Tokens
      setLoading(true);
      const result = await covalent.getNftTokenIdForContract({
        chainId: networkId,
        contractAddress: memoryGameNFTToken,
      });
      setLoading(false);
      if (result) {
        var uris = [];
        for (let i = 0; i < result.data.items.length; i++) {
          let tokenURI = await tokenl.methods
            .tokenURI(result.data.items[i].token_id)
            .call();
          uris.push(tokenURI);
        }
        setTokenURIs(uris);
      }
    } else {
      alert("Smart contract not deployed to detected network.");
    }
  }

  const chooseImage = (cardId) => {
    cardId = cardId.toString();
    if (cardsWon.includes(cardId)) {
      return window.location.origin + "/assets/play/white.png";
    } else if (cardsChosenId.includes(cardId)) {
      return CARD_ARRAY[cardId].img;
    } else {
      return window.location.origin + "/assets/play/blank.jpg";
    }
  };

  const flipCard = async (cardId) => {
    setAlreadyChosen(cardsChosen.length);
    let cardChosenl = [...cardsChosen];
    let cardChosenIdl = [...cardsChosenId];
    cardChosenl.push(cardArray[cardId].name);
    cardChosenIdl.push(cardId);
    setCardsChosen(cardChosenl);
    setCardsChosenId(cardChosenIdl);
  };

  const checkForMatch = async () => {
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];
    if (optionOneId == optionTwoId) {
      alert("You have clicked the same image!");
    } else if (cardsChosen[0] === cardsChosen[1]) {
      alert("Match found");
      token.methods
        .mint(
          account,
          window.location.origin + CARD_ARRAY[optionOneId].img.toString()
        )
        .send({ from: account })
        .on("transactionHash", (hash) => {
          let cardsWonl = [...cardsWon];
          let tokenURIsl = [...tokenURIs];
          cardsWonl.push(optionOneId);
          cardsWonl.push(optionTwoId);
          setCardsWon(cardsWonl);
          tokenURIsl.push(CARD_ARRAY[optionOneId].img);
          setTokenURIs(tokenURIsl);
        });
    } else {
      alert("Sorry, try again");
    }

    setCardsChosen([]);
    setCardsChosenId([]);
    if (cardsWon.length === CARD_ARRAY.length) {
      alert("Congratulations! You found them all!");
    }
  };

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 mb-3 ">
                <div className="card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
                  <div className="container-fluid mt-5">
                    <div className="row">
                      <SlotMachine />
                    </div>
                    <div className="row">
                      <main
                        role="main"
                        className="col-lg-12 d-flex text-center"
                      >
                        <div className="content mr-auto ml-auto">
                          <h1 className="d-4 h4">
                            {" "}
                            Memory game: Flipping tiles
                          </h1>

                          <ol>
                            <li className="h4">
                              When the game starts, all tiles are turned face
                              down.
                            </li>
                            <li className="h4">
                              The player then flips over two cards, selecting
                              them by clicking on them.
                            </li>
                            <li className="h4">
                              If the two tiles have the same image, those images
                              will be removed from tiles and player will be able
                              to mint those image as a Token. If not, they
                              should be flipped face down again.
                            </li>
                          </ol>
                          <h1 className="d-4 h4">Start matching now!</h1>
                          <div className="grid mb-4">
                            <Grid
                              container
                              spacing={{
                                xs: 1,
                                sm: 1,
                                md: 1,
                              }}
                            >
                              {cardArray.map((card, key) => {
                                return (
                                  <Grid item xs={3} md={3}>
                                    <img
                                      height={150}
                                      width={150}
                                      key={key}
                                      alt={"card"}
                                      src={chooseImage(key)}
                                      data-id={key}
                                      onClick={(event) => {
                                        let cardId =
                                          event.target.getAttribute("data-id");
                                        if (
                                          !cardsWon.includes(cardId.toString())
                                        ) {
                                          flipCard(cardId);
                                        }
                                      }}
                                    />
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </div>
                          <div>
                            <h4>
                              Tokens Collected:
                              <span id="result">&nbsp;{tokenURIs.length}</span>
                            </h4>

                            <div className="grid mb-4">
                              {tokenURIs.map((tokenURI, key) => {
                                return (
                                  <img
                                    style={{ marginLeft: "5px" }}
                                    key={key}
                                    src={tokenURI}
                                    alt={"nft"}
                                  />
                                );
                              })}
                              {tokenURIs.length === 0 && loading && (
                                <CircularProgress />
                              )}
                            </div>
                          </div>

                          <LuckyLottery/>
                        </div>
                      </main>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Popupchat />
      <Appfooter />
    </Fragment>
  );
}

export default PlayAndEarn;
