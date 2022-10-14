 
import Web3 from "web3";
import React, { useState, createContext, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useMoralis } from "react-moralis";
import { providerOptions } from "../providerOptions"
import { useHistory } from "react-router-dom";


export const Web3Context = createContext(undefined);

export const Web3ContextProvider = (props) => {
  const { authenticate, user, isAuthenticated, enableWeb3 } = useMoralis();

  const [currentAddress, setCurrentAddress] = useState("");
  const history = new useHistory();
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState();
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();
  const [isUpdate, setIsUpdate] = useState(false);



  const web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
  });

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      await authenticate();
      await enableWeb3({ provider: provider });
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
      if (accounts) history.push("/dashboard/app");
    } catch (error) {
      setError(error);
    }
  };

  const refreshState = () => {
    setAccount();
    setChainId();
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };
  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      // connectWallet();
    }
  }, []);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        if (accounts) setAccount(accounts[0]);
      };
      const handleChainChanged = (_hexChainId) => {
        setChainId(_hexChainId);
      };
      const handleDisconnect = () => {
        disconnect();
      };
      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);


  let clickedClass = "clicked"
  const body = document.body
  const lightTheme = "theme-light"
  const darkTheme = "theme-dark"
  let theme

  if (localStorage) {
    theme = localStorage.getItem("theme")
  }

  if (theme === lightTheme || theme === darkTheme) {
    body.classList.add(theme)
  } else {
    body.classList.add(lightTheme)
  }

  useEffect(() => { 
  }, [currentAddress]);


  //connect wallet
  // async function connectWallet() {
  //   let web3 = new Web3();
  //   if (window.ethereum) {
  //     web3 = new Web3(window.ethereum);
  //     try {
  //       window.ethereum.enable().then(function (accounts) {
  //         setCurrentAddress(accounts[0]);
  //         localStorage.setItem("account", accounts[0]);
  //         window.ethereum.on("accountsChanged", function (accounts) {
  //           setCurrentAddress(accounts[0]);
  //           localStorage.setItem("account", accounts[0]);
  //         });
  //       });
  //     } catch (e) {
  //       alert("User rejected the MetaMask connection request !");
  //       localStorage.setItem("account", null);
  //     }
  //   } else if (window.web3) {
  //     web3 = new Web3(window.web3.currentProvider);
  //   } else {
  //     alert("You have to install MetaMask!");
  //   }
  // }

  const required = "This field is required!";

  //authentication with metamask 

  const switchTheme = (e) => {
    if (theme === darkTheme) {
      body.classList.replace(darkTheme, lightTheme)
      e.target.classList.remove(clickedClass)
      localStorage.setItem("theme", "theme-light")
      setIsUpdate(!isUpdate);
      theme = lightTheme
    } else {
      body.classList.replace(lightTheme, darkTheme)
      e.target.classList.add(clickedClass)
      localStorage.setItem("theme", "theme-dark")
      setIsUpdate(!isUpdate);
      theme = darkTheme
    }
  }



  return (
    <Web3Context.Provider
      value={{
        currentAddress, 
        theme,
        switchTheme,
        clickedClass,
        required,
        isUpdate,
        connectWallet,
        disconnect,
        account,
      }}
      {...props}
    >
      {props.children}
    </Web3Context.Provider>
  );
};
