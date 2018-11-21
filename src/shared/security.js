import cryptoJS from "crypto-js";


export const encryptFile = (buffer, passphrase, salt) => {

    const key = cryptoJS.PBKDF2(passphrase, salt, {
        keySize: 512 / 32,
        iterations: 1000
    });

    const wordArray = cryptoJS.lib.WordArray.create(buffer);
    const encrypt = cryptoJS.AES.encrypt(wordArray, key.toString());

    return(Buffer(encrypt.toString()));
}


export const decryptFile = (buffer, passphrase, salt) => {
    const key = cryptoJS.PBKDF2(passphrase, salt, {
        keySize: 512 / 32,
        iterations: 1000
    });

    const imgType = 'image/png';

    var decrypted = cryptoJS.AES.decrypt(buffer.toString(), key.toString());
    var plainFile = cryptoJS.enc.Base64.stringify(decrypted);

    //var imgContent = "data:" + imgType + ";base64," + plainFile;

    return(plainFile);
}

