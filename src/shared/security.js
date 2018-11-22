import cryptoJS from "crypto-js";


export const encryptFile = (buffer, passphrase) => {

    const wordArray = cryptoJS.lib.WordArray.create(buffer);
    const encrypt = cryptoJS.AES.encrypt(wordArray, passphrase);

    return(Buffer(encrypt.toString()));
}


export const decryptFile = (buffer, passphrase) => {

    var decrypted = cryptoJS.AES.decrypt(buffer.toString(), passphrase);
    var plainFile = cryptoJS.enc.Base64.stringify(decrypted);

    return(plainFile);
}

