const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');
const zefiLib = require('../index.js')(web3);

const sender = '0xd11dBb9ab62d15666d725F9dfE9075a6ebFE6999';
const recipient = '0x6137D8D57B4B00811d6e1bD812DEe1126aAED7Ef';
const amount = 1000;
const walletAddress = '0x478e7AeF57d7f951933dbabe0c17Cf751F0b1f55';
const tokenAddress = '0x620d071911AdD048D121E88a54Ae8A1b7A52e114'; 

const init = async () => {
  const tokenAddress = accounts[4];
  await zefiLib.sendERC20Token({
    sender, //authorizedAddress of wallet
    recipient,
    amount,
    walletAddress,
    tokenAddress
  });
}

init();

