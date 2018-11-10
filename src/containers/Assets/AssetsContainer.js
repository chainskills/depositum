import { drizzleConnect } from 'drizzle-react'

import Asset from '../../components/Assets/Asset';


// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        AssetContract: state.contracts.AssetContract,
        drizzleStatus: state.drizzleStatus
    }
}

const AssetsContainer = drizzleConnect(Asset, mapStateToProps);

export default AssetsContainer;
