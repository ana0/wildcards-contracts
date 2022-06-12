const {
  BN,
  ZERO_ADDRESS,
  timestamp,
} = require('./helpers/constants');
const {
  assertRevert,
} = require('./helpers/assertRevert');

const Wildcards = artifacts.require('Wildcards');

require('chai')
  .use(require('chai-bn')(BN))
  .should();

contract('Wildcards', ([_, owner, attacker, sendingController, user]) => {
  let wildcards = null;
  const tokenId = 0;
  const baseUri = 'http://url.com/';
  const signingController = web3.eth.accounts.create();
  let nonce = 0;
  const maxMint = 10;

  const createAuthorization = (messageHash) => {
    nonce += 1;
    return web3.eth.accounts.sign(messageHash, signingController.privateKey).signature;
  };

  beforeEach(async () => {
    wildcards = await Wildcards.new(signingController.address, maxMint, baseUri, 'wildcards', 'CARD', { from: owner });
  });

  it('owner can set baseUri', async () => {
    await wildcards.setBaseURI(baseUri, { from: owner });
    (await wildcards.baseURI()).should.be.equal(baseUri);
  });

  it('attacker can not set baseUri', async () => {
    await assertRevert(wildcards.setBaseURI(baseUri, { from: attacker }));
  });

  it('attacker can not set maxMint', async () => {
    await assertRevert(wildcards.setMaxMint(100, { from: attacker }));
  });

  it('owner can set controller', async () => {
    await wildcards.setController(sendingController, { from: owner });
    (await wildcards.controller()).should.be.equal(sendingController);
  });

  it('attacker can not set controller', async () => {
    await assertRevert(wildcards.setController(sendingController, { from: attacker }));
  });

  it('owner can mint token to themselves', async () => {
    await wildcards.ownerMint(owner, tokenId, { from: owner });
    (await wildcards.ownerOf(tokenId)).should.be.equal(owner);
  });

  it('owner can mint token to anyone', async () => {
    await wildcards.ownerMint(user, tokenId, { from: owner });
    (await wildcards.ownerOf(tokenId)).should.be.equal(user);
  });

  it('owner can not exceed maxMint', async () => {
    await assertRevert(
      wildcards.ownerMint(owner, 11, { from: owner }),
    );
  });

  it('attacker can not mint token', async () => {
    await assertRevert(
      wildcards.ownerMint(attacker, tokenId, { from: attacker }),
    );
  });

  it('user can mint', async () => {
    await wildcards.setController(signingController.address, { from: owner });

    const localNonce = nonce;
    const msg = await wildcards.getMessageHash(user, tokenId, nonce);

    const auth = createAuthorization(msg);

    await wildcards.mint(tokenId, localNonce, auth, { from: user });
    (await wildcards.ownerOf(tokenId)).should.be.equal(user);
  });

  it('user can not transfer', async () => {
    await wildcards.setController(signingController.address, { from: owner });

    const localNonce = nonce;
    const msg = await wildcards.getMessageHash(user, tokenId, nonce);

    const auth = createAuthorization(msg);

    await wildcards.mint(tokenId, localNonce, auth, { from: user });

    await assertRevert(
      wildcards.transferFrom(user, owner, tokenId, { from: user }),
    );
  });

});