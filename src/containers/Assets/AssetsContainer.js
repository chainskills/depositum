import { drizzleConnect } from 'drizzle-react'

import Assets from '../../components/Assets/Assets';
import * as actions from '../../store/actions/assetActions';


// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        AssetContract: state.contracts.AssetContract,
        drizzleStatus: state.drizzleStatus,
        fetchMethod: "getMyAssets",
        pageName: "assets",
        pageTitle: "Your assets on Depositum",
        subTitle: "This is the list of your assets that you can keep private to you or to sale in the marketplace",
        type: state.assets.type,
        title: state.assets.title,
        assetId: state.assets.assetId,
        owner: state.assets.owner,
        name: state.assets.name,
        description: state.assets.description,
        imageSource: state.assets.imageSource,
        price: state.assets.price,
        openAssetDialog: state.assets.openAssetDialog,
        openTokenDialog: state.assets.openTokenDialog,
        openMarketplace: state.assets.openMarketplace
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUpdateMenu: (isOwner, earnings) => {
            dispatch(actions.updateMenu(isOwner, earnings))
        }
    };
};

const AssetsContainer = drizzleConnect(Assets, mapStateToProps, mapDispatchToProps);

export default AssetsContainer;
