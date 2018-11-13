import {drizzleConnect} from 'drizzle-react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';


/*
 * Create component.
 */

class ContractDataActions extends Component {
    constructor(props, context) {
        super(props);

        this.web3 = context.drizzle.web3;

        this.contracts = context.drizzle.contracts;

        // Fetch initial value from chain and return cache key for reactive updates
        this.dataKey = this.contracts[this.props.contract].methods[this.props.method].cacheCall(this.props.assetId);
    }

    render() {
        // Contract is not yet initialized.
        if (!this.props.contracts[this.props.contract].initialized) {
            return (
                <span>Initializing...</span>
            );
        }

        // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
        if (!(this.dataKey in this.props.contracts[this.props.contract][this.props.method])) {
            return (null);
        }

        let buttons = [];

        const asset = this.props.contracts[this.props.contract][this.props.method][this.dataKey].value;
        if (asset._owner !== this.props.account) {
            // we are not the asset's owner

            // we can view the asset
            buttons.push(<Button variant="contained" key={`button-view-${this.props.assetId}`}
                                 onClick={() => this.props.actionView(this.props.assetId)}>View</Button>);

            if (asset._candidate === this.props.account) {
                // we have already deposit on purchase for this item -> now we can execute the purchase or ask for a refund

                buttons.push(<Button variant="contained" className={'float-right'}
                                     key={`button-deposit-${this.props.assetId}`}
                                     onClick={() => this.props.actionPurchase(this.props.assetId)}>Purchase</Button>);
                buttons.push(<Button variant="contained" className={'float-right card-button'}
                                     key={`button-refund-${this.props.assetId}`}
                                     onClick={() => this.props.actionRefund(this.props.assetId)}>Refund</Button>);

            } else if (asset._candidate === "0x0000000000000000000000000000000000000000") {
                // we can set an option on the purchase
                buttons.push(<Button variant="contained" className={'float-right'}
                                     key={`button-deposit-${this.props.assetId}`}
                                     onClick={() => this.props.actionDeposit(this.props.assetId)}>Deposit on
                    purchase</Button>);
            }
        } else {
            // we are the asset's owner, we can perform all required actions to manage our asset

            buttons.push(<Button variant="contained" className={'card-button'}
                                 key={`button-remove-${this.props.assetId}`}
                                 onClick={() => this.props.actionRemove(this.props.assetId)}>Remove</Button>);

            buttons.push(<Button variant="contained" key={`button-edit-${this.props.assetId}`}
                                 onClick={() => this.props.actionEdit(this.props.assetId)}>Edit</Button>);

            if (asset._available) {
                buttons.push(<Button variant="contained" className={'float-right'}
                                     key={`button-unset-${this.props.assetId}`}
                                     onClick={() => this.props.actionUnset(this.props.assetId)}>To Keep</Button>);
            } else if (asset._price > 0) {
                buttons.push(<Button variant="contained" className={'float-right'}
                                     key={`button-set-${this.props.assetId}`}
                                     onClick={() => this.props.actionSet(this.props.assetId)}>To Sell</Button>);
            }
        }

        return buttons;
    }
}

ContractDataActions.contextTypes = {
    drizzle: PropTypes.object
};

/*
 * Export connected component.
 */

const mapStateToProps = state => {
    return {
        contracts: state.contracts
    }
};

export default drizzleConnect(ContractDataActions, mapStateToProps);