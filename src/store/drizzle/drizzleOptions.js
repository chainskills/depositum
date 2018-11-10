import Renting from '../../contracts/Renting';

const drizzleOptions = {
    web3: {
        block: false,
        fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:8545'
        }
    },
    contracts: [
        Renting
    ],
    events: {
        Renting: ['NewRentItemEvent']
    },
    polls: {
        accounts: 1500
    }
};

export default drizzleOptions;