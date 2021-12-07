// express app
const express = require("express");
const app = express();
const cors = require("cors");

const ethers = require("ethers");
const PKEY = "6974b77cc64d3610423ac546c2bd7e79605cf2b1331c82965a214a7b8982dc34";
const { ecsign, toRpcSig } = require("ethereumjs-util");

app.use(cors());
app.get("/verify/:contextId", (req, res) => {
  const TIMESTAMP = parseInt(Date.now() / 1000);
  const ADDRESS = req.params.contextId;
  const CONTEXT =
    "0x636c722e66756e64000000000000000000000000000000000000000000000000";
  let wallet = new ethers.Wallet(PKEY);

  let message = ethers.utils.solidityKeccak256(
    ["bytes32", "address[]", "uint"],
    [CONTEXT, [ADDRESS], TIMESTAMP]
  );

  const sig = ecsign(
    Buffer.from(message.slice(2), "hex"),
    Buffer.from(
      "6974b77cc64d3610423ac546c2bd7e79605cf2b1331c82965a214a7b8982dc34",
      "hex"
    )
  );

  let rpcsign = toRpcSig(sig.v, sig.r, sig.s);

  res.json({
    data: {
      unique: true,
      app: "EXAMPLE APP",
      context: CONTEXT,
      contextIds: [ADDRESS],
      timestamp: TIMESTAMP,
      sig: rpcsign,
      publicKey: wallet.address,
    },
  });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
