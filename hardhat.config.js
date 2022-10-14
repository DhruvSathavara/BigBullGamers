require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: "./.env" });

const privateKey = process.env.REACT_APP_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.4",
  networks: {
    boba_rinkeby: {
      url: "https://rinkeby.boba.network",
      accounts: [privateKey],
      gas: 2900000,
    },
    klaytn: {
      url: "https://api.baobab.klaytn.net:8651",
      accounts: [privateKey],
    },
  },
};
