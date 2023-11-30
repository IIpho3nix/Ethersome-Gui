const crypto = require("crypto");

const getbytes = (length, seed) => {
  var chash = crypto
    .createHash("sha256")
    .update(
      "8fca08ec-edbe-43ca-8e68-7d45464b1506-9d1b532c-8f73-4f6b-b3bc-eb99015a39d0"
    )
    .update(seed)
    .digest();
  var value = Buffer.alloc(0);

  while (value.length < length) {
    chash = crypto.createHash("sha256").update(chash).digest();
    value = Buffer.concat([value, chash]);
  }

  return value.slice(0, length);
};

const encrypt = (data, key, iv) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let result = cipher.update(data, "utf-8", "base64");
  result += cipher.final("base64");
  return result;
};

exports.encrypt = encrypt;

const decrypt = (data, key, iv) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let result = decipher.update(data, "base64", "utf-8");
  return result + decipher.final("utf8");
};

exports.decrypt = decrypt;

const bufferToBase64 = (buffer) => {
  return buffer.toString("base64");
};

exports.bufferToBase64 = bufferToBase64;
const base64ToBuffer = (buffer) => {
  return Buffer.from(buffer, "base64");
};

exports.base64ToBuffer = base64ToBuffer;

const generateKeyAndIvFromSeed = (seed) => {
  const iv = getbytes(16, seed);
  const key = crypto
    .scryptSync(
      seed,
      getbytes(
        16,
        crypto.createHmac("sha256", seed).update(seed, "utf-8").digest("base64")
      ),
      16
    )
    .toString("hex");

  return key + "|" + bufferToBase64(iv);
};

exports.generateKeyAndIvFromSeed = generateKeyAndIvFromSeed;
