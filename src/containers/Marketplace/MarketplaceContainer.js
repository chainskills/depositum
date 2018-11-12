import { drizzleConnect } from 'drizzle-react'

import Marketplace from '../../components/Marketplace/Marketplace';


// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        AssetContract: state.contracts.AssetContract,
        drizzleStatus: state.drizzleStatus
    }
}

const MarketplaceContainer = drizzleConnect(Marketplace, mapStateToProps);

export default MarketplaceContainer;
