const web3 = require('web3'); // eslint-disable-line import/no-extraneous-dependencies

const { BN } = web3.utils;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const maxGas = 0xfffffffffff;

const timestamp = () => Math.floor(Date.now() / 1000);

module.exports = {
  ZERO_ADDRESS,
  BN,
  maxGas,
  timestamp,
};
