// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.18",
// };

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // goerli: {
    //   url: process.env.RPC_URL,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
    mumbai: {
      url: process.env.RPC_MATIC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
