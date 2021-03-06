import crypto from 'crypto';
import Web3Utils from 'web3-utils';
import ethUtils from 'ethereumjs-util';
import abi from 'ethereumjs-abi';
import BN from 'bn.js';

/**
 * Converts a number to a 32 byte padded hex encoded buffer
 * @param {number | string} num 
 * @returns {Buffer} buffer
 */
const numToBuffer = num => {
  return numToBufferWithN(num, 64);
};

const numToBufferWithN = (num, amt) => {
  return Buffer.from(
    new BN(Web3Utils.toHex(num).replace('0x', ''), 16).toString(16, amt),
    "hex"
  ); // number
};

const funcHash = signature => {
  return(
    abi.soliditySHA3(["string"], [signature]).slice(0, 4)
  );
};

const createSalt = () => {
  return '0x' + crypto.randomBytes(32).toString('hex');
}

const buildCreate2Address = (creatorAddress, saltHex, byteCode) => {
  return `0x${Web3Utils.sha3(`0x${[
    'ff',
    creatorAddress,
    saltHex,
    Web3Utils.sha3(byteCode)
  ].map(x => x.replace(/0x/, ''))
  .join('')}`).slice(-40)}`.toLowerCase()
};

const sendTx = async ({ web3, tx, from, ...rest }) => {
  const [gasLimit, gasPrice] = await Promise.all([
    tx.estimateGas({ from }),
    web3.eth.getGasPrice()
  ]);
  return tx.send({ from, gas: gasLimit, gasPrice, ...rest });
};

export default {
  numToBuffer,
  funcHash,
  createSalt,
  buildCreate2Address,
  sendTx
};
