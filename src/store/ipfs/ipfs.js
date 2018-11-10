import IPFS from 'ipfs-api';


//const IPFS_HOST = "ipfs.infura.io";
//const IPFS_PORT = "5001";
//const IPFS_PROTOCOL = "https";

const IPFS_HOST = "localhost";
const IPFS_PORT = "5002";
const IPFS_PROTOCOL = "http";


//const IPFS_READ_URL = "https://ipfs.io/ipfs/";
export const IPFS_READ_URL = "http://localhost:8082/ipfs/";

export const ipfs = new IPFS({ host: IPFS_HOST, port: IPFS_PORT, protocol: IPFS_PROTOCOL });