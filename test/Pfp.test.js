const {
  BN,
  ZERO_ADDRESS,
  timestamp,
} = require('./helpers/constants');
const {
  assertRevert,
} = require('./helpers/assertRevert');

const PFP = artifacts.require('PFP');

require('chai')
  .use(require('chai-bn')(BN))
  .should();

contract('Pfps', ([_, owner, attacker, sendingController, user]) => {
  let off = null;
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
    pfp = await PFP.new(signingController.address, maxMint, baseUri, 'jokers', 'JOKER', { from: owner });
  });

  it('owner can set baseUri', async () => {
    await pfp.setBaseURI(baseUri, { from: owner });
    (await pfp.baseURI()).should.be.equal(baseUri);
  });

  it('attacker can not set baseUri', async () => {
    await assertRevert(pfp.setBaseURI(baseUri, { from: attacker }));
  });

  it('attacker can not set maxMint', async () => {
    await assertRevert(pfp.setMaxMint(100, { from: attacker }));
  });

  it('owner can set controller', async () => {
    await pfp.setController(sendingController, { from: owner });
    (await pfp.controller()).should.be.equal(sendingController);
  });

  it('attacker can not set controller', async () => {
    await assertRevert(pfp.setController(sendingController, { from: attacker }));
  });

  it('owner can mint token to themselves', async () => {
    await pfp.ownerMint(owner, tokenId, { from: owner });
    (await pfp.ownerOf(tokenId)).should.be.equal(owner);
  });

  it('owner can mint token to anyone', async () => {
    await pfp.ownerMint(user, tokenId, { from: owner });
    (await pfp.ownerOf(tokenId)).should.be.equal(user);
  });

  it('owner can not exceed maxMint', async () => {
    await assertRevert(
      pfp.ownerMint(owner, 11, { from: owner }),
    );
  });

  it('attacker can not mint token', async () => {
    await assertRevert(
      pfp.ownerMint(attacker, tokenId, { from: attacker }),
    );
  });

  it('user can mint', async () => {
    await pfp.setController(signingController.address, { from: owner });

    const localNonce = nonce;
    const msg = await pfp.getMessageHash(user, tokenId, nonce);

    const auth = createAuthorization(msg);

    await pfp.mint(tokenId, localNonce, auth, { from: user });
    (await pfp.ownerOf(tokenId)).should.be.equal(user);
  });

  it('user can not transfer', async () => {
    await pfp.setController(signingController.address, { from: owner });

    const localNonce = nonce;
    const msg = await pfp.getMessageHash(user, tokenId, nonce);

    const auth = createAuthorization(msg);

    await pfp.mint(tokenId, localNonce, auth, { from: user });

    await assertRevert(
      pfp.transferFrom(user, owner, tokenId, { from: user }),
    );
  });

});