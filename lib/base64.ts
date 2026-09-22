const BASE64_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// React Native/Hermes has no built-in Buffer or btoa, so bytea columns
// (delivered as { type: "Buffer", data: number[] } after JSON.stringify)
// need a manual byte-array -> base64 conversion to render as a data URI.
export const bytesToBase64 = (bytes: number[]): string => {
  let resultado = "";
  let i = 0;

  for (; i + 2 < bytes.length; i += 3) {
    const bloco = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    resultado +=
      BASE64_CHARS[(bloco >> 18) & 63] +
      BASE64_CHARS[(bloco >> 12) & 63] +
      BASE64_CHARS[(bloco >> 6) & 63] +
      BASE64_CHARS[bloco & 63];
  }

  const restantes = bytes.length - i;
  if (restantes === 1) {
    const bloco = bytes[i] << 16;
    resultado +=
      BASE64_CHARS[(bloco >> 18) & 63] +
      BASE64_CHARS[(bloco >> 12) & 63] +
      "==";
  } else if (restantes === 2) {
    const bloco = (bytes[i] << 16) | (bytes[i + 1] << 8);
    resultado +=
      BASE64_CHARS[(bloco >> 18) & 63] +
      BASE64_CHARS[(bloco >> 12) & 63] +
      BASE64_CHARS[(bloco >> 6) & 63] +
      "=";
  }

  return resultado;
};