import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {CardImg} from 'reactstrap';

import {IPFS_READ_URL} from "../../store/ipfs/ipfs";



/*
 * Create component.
 */

class ContractIPFS extends Component {
    constructor(props, context) {
        super(props);

        this.contracts = context.drizzle.contracts;

        // Fetch initial value from chain and return cache key for reactive updates
        const methodArgs = this.props.methodArgs ? this.props.methodArgs : [];
        this.dataKey = this.contracts[this.props.contract].methods[this.props.method].cacheCall(...methodArgs);
    }

    render() {
        // Contract is not yet initialized.
        if(!this.props.contracts[this.props.contract].initialized) {
            return (
                <span>Initializing...</span>
            );
        }

        // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
        if(!(this.dataKey in this.props.contracts[this.props.contract][this.props.method])) {
            return (<CardImg top className={"card-image"} src="./assets/house.png" alt="Card image cap" />);
        }

        const displayData = this.props.contracts[this.props.contract][this.props.method][this.dataKey].value;

        //return (<CardImg top style={{width:"100%"}} src={`https://ipfs.io/ipfs/${displayData}`} alt="Card image cap" />);

        const ipfsURL = IPFS_READ_URL + displayData;
        console.log(ipfsURL);
        return (<CardImg top className={"card-image"} src={`${ipfsURL}`} alt="Card image cap" />);

    }
}

ContractIPFS.contextTypes = {
    drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
    return {
        contracts: state.contracts
    }
}

export default drizzleConnect(ContractIPFS, mapStateToProps);