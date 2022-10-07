import bip21 from 'bip21';

export const SPEND_UNCONFIRMED = true;

/**
 * Encode BIP21 URI
 * @param {string} address Bitcoin address
 * @param {object} opts { amount, message, label }
 */
export function bip21Encode(address, opts) {
  return bip21.encode(address, opts);
}

/**
 * Decode BIP21 URI
 * @param {string} uri BIP21 uri to be decoded
 */
export function bip21Decode(uri) {
  return bip21.decode(uri);
}
