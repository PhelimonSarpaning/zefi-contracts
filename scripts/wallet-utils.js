const utils = require('./utils.js'); 

const deployFactory = async function(CloneableWallet, WalletFactory) {
  const cloneableWallet = await CloneableWallet.new();
  const walletFactory = await WalletFactory.new(cloneableWallet.address);
  return { cloneableWallet, walletFactory };
}

/**
 * 
 * @param {Buffer} _data 
 * @param {FullWallet} _wallet 
 * @param {string} _sender string in hex format (must be address from accounts array)
 */
const transact0 = async function (_data, _wallet, _sender) {
  const result = await _wallet.invoke0(
    `0x${_data.toString('hex')}`, 
    {from: _sender}
  );
  return result.receipt.gasUsed;
};

const erc20Transfer = (erc20Recipient, amount) => {
  let erc20DataArr = [];
  // function signature
  erc20DataArr.push(utils.funcHash("transfer(address,uint256)"));
  // arg: to address
  erc20DataArr.push(utils.numToBuffer(erc20Recipient));
  // arg: amount (256)
  erc20DataArr.push(utils.numToBuffer(amount));
  return Buffer.concat(erc20DataArr);
};

const txData = (revert, to, amount, dataBuff) => {
  // revert_flag (1), to (20), value (32), data length (32), data
  let dataArr = [];
  let revertBuff = Buffer.alloc(1);
  // don't revert for now
  revertBuff.writeUInt8(revert);
  dataArr.push(revertBuff);
  // 'to' is not padded (20 bytes)
  dataArr.push(Buffer.from(to.replace("0x", ""), "hex")); // address as string
  // value (32 bytes)
  dataArr.push(utils.numToBuffer(amount));
  // data length (0)
  dataArr.push(utils.numToBuffer(dataBuff.length));
  if (dataBuff.length > 0) {
    dataArr.push(dataBuff);
  }
  return Buffer.concat(dataArr);
};

module.exports = {
  deployFactory,
  transact0,
  erc20Transfer,
  txData
}
