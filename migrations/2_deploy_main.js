const Wildcards = artifacts.require('Wildcards');

module.exports = async function (deployer, network, accounts) {
  return deployer.deploy(Wildcards, accounts[0],52, 'https://isthisa.computer/api/wildcards/', 'Wildcards', 'WILD', { from: accounts[0] })
    .then(async (wildcards) => {
      //await lifeforms.setContractURI('https://isthisa.computer/ipfs/QmVDJwDuRv9PsRvPGxqengVCPawCVXdmdda74wEbGFC1ZQ/lifeforms-contract.json');
    });
};
