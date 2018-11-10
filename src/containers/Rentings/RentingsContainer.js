import { drizzleConnect } from 'drizzle-react'

import Rentings from '../../components/Rentings/Renting';


// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        Renting: state.contracts.Renting,
        drizzleStatus: state.drizzleStatus
    }
}

const RentingsContainer = drizzleConnect(Rentings, mapStateToProps);

export default RentingsContainer;
