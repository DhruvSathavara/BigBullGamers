import Web3 from "web3";
import React, { useState, createContext, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useMoralis } from "react-moralis";
import { providerOptions } from "../providerOptions";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { MarketplaceAddress } from "../config";
import NFTMarketplace from "../abi/NFTMarketplace.json";

export const MarketplaceContext = createContext(undefined);

export const MarketplaceContextProvider = (props) => {
  const { authenticate, user, isAuthenticated, enableWeb3 } = useMoralis();

  const [currentAddress, setCurrentAddress] = useState("");
  const history = new useHistory();
  const [provider, setProvider] = useState();
  const [loadingNfts, setLoadingNfts] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [myNfts, setMyNfts] = useState([]);

  async function loadNfts() {
    setLoadingNfts(true);
    /* create a generic provider and query for unsold market items */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      MarketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    const data = await contract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);

        const meta = await axios.get(tokenUri);
        console.log(meta);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.title,
          description: meta.data.discription,
        };
        return item;
      })
    );
    console.log(items, "items");
    setNfts(items);
    setLoadingNfts(false);
  }

  async function listNFTForSale(url, formPrice) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    const price = ethers.utils.parseUnits(formPrice, "ether");
    let contract = new ethers.Contract(
      MarketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    let transaction = await contract.createToken(url, price, {
      value: listingPrice,
    });
    await transaction.wait();
    setUpdated(!updated);
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      MarketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    setUpdated(!updated);
  }

  async function loadMyNFTs() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const marketplaceContract = new ethers.Contract(
      MarketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    const data = await marketplaceContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.title,
          description: meta.data.discription,
          tokenURI,
        };
        return item;
      })
    );
    setMyNfts(items);
  }

  async function PutOnSale(nft) {
    if (!nft.price) return;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(nft.price, "ether");
    let contract = new ethers.Contract(
      MarketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    let transaction = await contract.resellToken(nft.tokenId, priceFormatted, {
      value: listingPrice,
    });
    await transaction.wait();
    setUpdated(!updated)
  }

  return (
    <MarketplaceContext.Provider
      value={{
        loadNfts,
        listNFTForSale,
        buyNft,
        loadMyNFTs,
        PutOnSale,
        nfts,
        myNfts,
        updated,
      }}
      {...props}
    >
      {props.children}
    </MarketplaceContext.Provider>
  );
};
