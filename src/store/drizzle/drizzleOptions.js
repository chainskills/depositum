import AssetContract from '../../contracts/AssetContract';

const drizzleOptions = {
    web3: {
        block: false,
        fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:8545'
        }
    },
    contracts: [
        AssetContract
    ],
    events: {
        AssetContract: ['NewAsset', 'AssetRemoved', 'Transfer', 'Approval']
    },
    polls: {
        accounts: 15000
    }
};

export default drizzleOptions;