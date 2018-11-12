import { drizzleConnect } from 'drizzle-react'

import Assets from '../../components/Assets/Assets';


// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        AssetContract: state.contracts.AssetContract,
        drizzleStatus: state.drizzleStatus,
        fetchMethod: "getMarketplace",
        title: "Depositum Marketplace",
        subTitle: "You will find your assets you have published in the marketplace and those put on sale by other individuals"
    }
}

const MarketplaceContainer = drizzleConnect(Assets, mapStateToProps);

export default MarketplaceContainer;
