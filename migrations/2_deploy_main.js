const Wildcards = artifacts.require('Wildcards');

module.exports = async function (deployer, network, accounts) {
  return deployer.deploy(Wildcards, '0x4E34c31A799f7caf7d2378C68dD171B2A0B58817', 52, 'https://isthisa.computer/api/wildcards/', 'Wildcards', 'WILD', { from: accounts[0] })
    .then(async (wildcards) => {
      //await lifeforms.setContractURI('https://isthisa.computer/ipfs/QmVDJwDuRv9PsRvPGxqengVCPawCVXdmdda74wEbGFC1ZQ/lifeforms-contract.json');
    });
};
