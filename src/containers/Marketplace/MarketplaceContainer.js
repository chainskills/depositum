import { drizzleConnect } from 'drizzle-react'

import Assets from '../../components/Assets/Assets';
import * as actions from "../../store/actions/assetActions";


// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        AssetContract: state.contracts.AssetContract,
        drizzleStatus: state.drizzleStatus,
        fetchMethod: "getMarketplace",
        pageName: "marketplace",
        pageTitle: "Depositum Marketplace",
        subTitle: "You will find your assets you have published in the marketplace and those put on sale by other individuals"
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onUpdateMenu: (isOwner, earnings) => {
            dispatch(actions.updateMenu(isOwner, earnings))
        }
    };
};

const MarketplaceContainer = drizzleConnect(Assets, mapStateToProps, mapDispatchToProps);

export default MarketplaceContainer;
