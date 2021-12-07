const { expect } = require("chai");
const { ecsign, toRpcSig } = require("ethereumjs-util");

let brightIdUserRegistry;
let verifier, alice, bob;
let brightIdUserRegistryAddress;
const CONTEXT =
  "0x4f6365616e44414f000000000000000000000000000000000000000000000000";

describe("Test registry", function () {
  beforeEach(async () => {
    [verifier, alice, bob] = await ethers.getSigners();
    // Deploy the register
    if (!brightIdUserRegistryAddress) {
      brightIdUserRegistry = await (
        await ethers.getContractFactory("BrightIdUserRegistry")
      ).deploy(CONTEXT, verifier.address);
    }
    brightIdUserRegistryAddress = brightIdUserRegistry.address;
    await brightIdUserRegistry.deployed();
  });
  it("Verifier should be the owner", async function () {
    expect(await brightIdUserRegistry.verifier()).to.equal(verifier.address);
  });
  it("Check if the context is correct", async function () {
    expect(await brightIdUserRegistry.context()).to.equal(CONTEXT);
  });

  it("Alice must be unverified", async function () {
    expect(await brightIdUserRegistry.isVerifiedUser(alice.address)).to.equal(
      false
    );
  });

  it("Should revert when verifying using an invalid signature", async function () {
    const TIMESTAMP = parseInt(Date.now() / 1000);

    let message = ethers.utils.solidityKeccak256(
      ["bytes32", "address[]", "uint"],
      [CONTEXT, [alice.address], TIMESTAMP]
    );

    const { v, r, s } = ecsign(
      Buffer.from(message.slice(2), "hex"),
      Buffer.from(
        "0xac0274bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80".slice(
          2
        ),
        "hex"
      )
    );
    let rpcsign = toRpcSig(v, r, s);
    let splitted = ethers.utils.splitSignature(rpcsign);

    await expect(
      brightIdUserRegistry.register(
        CONTEXT,
        [alice.address],
        1,
        v,
        splitted.r,
        splitted.s
      )
    ).to.be.revertedWith("NOT AUTHORIZED");
  });

  it("Alice must be able to register using a signed message from verifier", async function () {
    const TIMESTAMP = 1; //parseInt(Date.now() / 1000);

    let message = ethers.utils.solidityKeccak256(
      ["bytes32", "address[]", "uint"],
      [CONTEXT, [alice.address], TIMESTAMP]
    );

    const { v, r, s } = ecsign(
      Buffer.from(message.slice(2), "hex"),
      Buffer.from(
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80".slice(
          2
        ),
        "hex"
      )
    );

    await brightIdUserRegistry.register(CONTEXT, [alice.address], 1, v, r, s);
  });

  it("Alice must be verified", async function () {
    expect(await brightIdUserRegistry.isVerifiedUser(alice.address)).to.equal(
      true
    );
  });
});
