import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';


/*
 * Create component.
 */

class ContractDataMarketplace extends Component {
    constructor(props, context) {
        super(props);

        this.contracts = context.drizzle.contracts;

        // Fetch initial value from chain and return cache key for reactive updates
        this.dataKey = this.contracts[this.props.contract].methods[this.props.method].cacheCall(this.props.assetId);
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
            return (null);
        }

        const asset = this.props.contracts[this.props.contract][this.props.method][this.dataKey].value;
        if (asset._owner !== this.props.account) {
            // only the asset's owner is allowed to set/unset the asset to/from the marketplace
            return (<Button variant="contained" key={`button-view-${this.props.assetId}`}
                            onClick={() => this.props.actionView(this.props.assetId)}>View</Button>);
        }

        const buttons = [
            <Button variant="contained" className={'card-button'} key={`button-remove-${this.props.assetId}`}
                    onClick={() =>this.props.actionRemove(this.props.assetId)}>Remove</Button>,
            <Button variant="contained" key={`button-edit-${this.props.assetId}`}
            onClick={() => this.props.actionEdit(this.props.assetId)}>Edit</Button>
        ]

        if (asset._available) {
            buttons.push(<Button variant="contained" className={'float-right'} key={`button-unset-${this.props.assetId}`}
                                 onClick={() => this.props.actionUnset(this.props.assetId)}>Unset</Button>);
        } else {
            buttons.push(<Button variant="contained" className={'float-right'} key={`button-set-${this.props.assetId}`}
                            onClick={() => this.props.actionSet(this.props.assetId)}>Set</Button>);
        }

        return buttons;
    }
}

ContractDataMarketplace.contextTypes = {
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

export default drizzleConnect(ContractDataMarketplace, mapStateToProps);