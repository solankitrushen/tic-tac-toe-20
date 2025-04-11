import forge from 'node-forge';

export const encryptData = (message, publicKeyPem) => {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(message, 'RSA-OAEP');
    return forge.util.encode64(encrypted);
};