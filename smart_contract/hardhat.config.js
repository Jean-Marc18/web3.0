require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/0-GW1rOsS8KB1itkbHsqr6hNWFdiIDAd',
      accounts : [ '87c51eceec6f5a12e834b853ddcc45e609208720533deb17a1daed11c281ee0f' ]
    }
  }
};
