const ethers = require("ethers");
const BN = require("bn.js");

const toBuffer = (str) => Buffer.from(str);
const bufferToInt = function (buf) {
  return new BN(toBuffer(buf)).toNumber();
};
function fromRpcSig(sig) {
  const buf = toBuffer(sig);

  let r;
  let s;
  let v;
  if (buf.length >= 65) {
    r = buf.slice(0, 32);
    s = buf.slice(32, 64);
    v = bufferToInt(buf.slice(64));
  } else if (buf.length === 64) {
    // Compact Signature Representation (https://eips.ethereum.org/EIPS/eip-2098)
    r = buf.slice(0, 32);
    s = buf.slice(32, 64);
    v = bufferToInt(buf.slice(32, 33)) >> 7;
    s[0] &= 0x7f;
  } else {
    throw new Error("Invalid signature length");
  }

  // support both versions of `eth_sign` responses
  if (v < 27) {
    v += 27;
  }

  return {
    v,
    r,
    s,
  };
}
let a = fromRpcSig(
  "0x672856f7be9d9aacecf4fc7a252bbd92a2f1eebbf8b7f1b2faef426219047e120580f630b4860e6142ea94c980d9ad28166562aabfbc8975f1f066911ff6698f1b"
);
console.log(a);
