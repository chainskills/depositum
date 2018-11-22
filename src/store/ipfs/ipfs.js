import IPFS from 'ipfs-api';

/*
// Switch to this server to make your IPFS files public
const IPFS_HOST = "ipfs.infura.io";
const IPFS_PORT = "5001";
const IPFS_PROTOCOL = "https";

export const IPFS_READ_URL = "https://ipfs.io/ipfs/";
*/

// Use this server for dev purpose. Your files will/could not be available in the public IPFS nodes
const IPFS_HOST = "localhost";
const IPFS_PORT = "5002";
const IPFS_PROTOCOL = "http";

export const IPFS_READ_URL = "http://localhost:8082/ipfs/";


export const ipfs = new IPFS({ host: IPFS_HOST, port: IPFS_PORT, protocol: IPFS_PROTOCOL });