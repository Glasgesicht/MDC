import { gunzipSync, gzipSync } from "zlib";
import { toByteArray, fromByteArray, byteLength } from "base64-js";
import { TextEncoder } from "util";

function decompressString(compressedText) {
  const gZipBuffer = toByteArray(compressedText);
  const decompressedBuffer = gunzipSync(gZipBuffer.slice(4));
  return JSON.parse(decompressedBuffer.toString());
}

function compressString(text) {
  const buffer = Buffer.from(JSON.stringify(text), "utf8");
  const compressedBuffer = gzipSync(buffer);

  const gZipBuffer = Buffer.alloc(compressedBuffer.length + 4);
  gZipBuffer.writeUInt32LE(buffer.length, 0);
  compressedBuffer.copy(gZipBuffer, 4);

  return gZipBuffer.toString("base64");
}

function compressToString(input) {
  const stringToCompress = JSON.stringify(input);

  const asArray = new TextEncoder().encode(stringToCompress);
  const lengthAsArray = encodeTo4Bytes(asArray.length);
  const compressed = gzipSync(asArray, {});

  const compressedWithLength = new Uint8Array(compressed.length + 4);
  compressedWithLength.set(lengthAsArray, 0);
  compressedWithLength.set(compressed, 4);

  return fromByteArray(compressedWithLength);
}

function encodeTo4Bytes(number) {
  const byteArray = new Uint8Array(4);

  byteArray[3] = number >> 24;
  byteArray[2] = number >> 16;
  byteArray[1] = number >> 8;
  byteArray[0] = number;

  return byteArray;
}

const dtc =
  "fgMAAB+LCAAAAAAAAAqtUs1OwkAQfhUy54a024qGG/KniQUCVQ+GwwqDaVxa3G5JCGnia3jyFTh58qRv4pM43bItYryZvcx838zk+2Z2C61QziRfKGhCz2m0wYLrlYj5HJpRKoQFt3yzisNIJW2+UqnEXzg0t4fJ3RYm+JRiNKNSx4IBX1IA55gIHtH0K65Clc5zbFDz3I+dw+qux76eX3Iyjh4M263ZnvexcxtEnxV0V+Ca2uOIJp8yZkEQLnG4RjlRiFIrMPICLh+QsgUXCZKnBIetMhsuFgmqVrjULY7p+QkzA1PvzeWobKZYxUE/MLTOR9ejw/JxVU6VKtbAXliel+XZNLOg7U8MO+bzMNYr1RFJ28JIIskqVjtIl/coocnKxSpMSKoFPVlsfUOYy1jdtiGzqobqEp/v9N70e63e8QTb1hOmFl1T4Ezh/IAutBqi0GfQbsTvBfZTLukLKZnSCvw4Pygjp9oU+8tUpTE35R5Jcph3bOrnFn43nPyHh/0dCxN2Ri78XsdUXrTGfhkH5Rk7XHERRo8m98NkVv4XlIn+wiz7BgK4FFx+AwAA";

console.log(dtc);
console.log("\n");
console.log(compressString(decompressString(dtc)));
