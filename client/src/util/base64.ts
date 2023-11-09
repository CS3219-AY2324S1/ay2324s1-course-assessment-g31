import { Buffer } from "buffer";

function decode64(str: string): string {
  return Buffer.from(str, "base64").toString("binary");
}
function encode64(str: string): string {
  return Buffer.from(str, "binary").toString("base64");
}

export { decode64, encode64 };
