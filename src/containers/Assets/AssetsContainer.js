import { drizzleConnect } from 'drizzle-react'

import Assets from '../../components/Assets/Assets';


// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        AssetContract: state.contracts.AssetContract,
        drizzleStatus: state.drizzleStatus,
        fetchMethod: "getMyAssets",
        title: "Your assets on Depositum",
        subTitle: "This is the list of your assets that you can keep private to you or to sale in the marketplace"
    }
}

const AssetsContainer = drizzleConnect(Assets, mapStateToProps);

export default AssetsContainer;
