import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
 * Create component.
 */

class ContractDataAmount extends Component {
    constructor(props, context) {
        super(props);

        this.contracts = context.drizzle.contracts;

        // Fetch initial value from chain and return cache key for reactive updates.
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
            return (
                <span>Fetching...</span>
            );
        }

        let displayData = this.props.contracts[this.props.contract][this.props.method][this.dataKey].value;
        console.log("displayData: " + displayData);

        // Optionally convert from Wei
        console.log("unit: " + this.props.fromWei);
        if (this.props.fromWei) {
            displayData = this.context.drizzle.web3.utils.fromWei(displayData, this.props.fromWei);
        }

        // Optionally convert to Wei
        if (this.props.toWei) {
            displayData = this.context.drizzle.web3.utils.toWei(displayData, this.props.toWei);
        }

        return(displayData);
    }
}

ContractDataAmount.contextTypes = {
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

export default drizzleConnect(ContractDataAmount, mapStateToProps);