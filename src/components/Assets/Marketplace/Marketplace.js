import React, {Component} from 'react';

import AlertDialog from '../../Dialog/AlertDialog/AlertDialog';


class Marketplace extends Component {

    constructor(props) {
        super(props)

        this.state = {};

        this.action = null;

        // TODO: subscribe to events specifics to tokens
    }

    hideDialogs = () => {
        this.props.cancel();
    }

    addInMarketplace = (assetId) => {
        this.hideDialogs();

        this.props.contract.methods.setMarketplace.cacheSend(assetId, {
            from: this.props.account,
            gas: 500000
        });
    }

    removeFromMarketplace = (assetId) => {
        this.hideDialogs();

        this.props.contract.methods.unsetMarketplace.cacheSend(assetId, {
            from: this.props.account,
            gas: 500000
        });
    }

    deposit = (assetId) => {
        this.hideDialogs();

        this.props.contract.methods.getAsset(assetId).call().then(function (asset) {
            this.props.contract.methods.deposit.cacheSend(assetId, {
                from: this.props.account,
                value: asset._price,
                gas: 500000
            });
        }.bind(this));
    }

    purchase = (assetId) => {
        this.hideDialogs();

        this.props.contract.methods.purchaseAsset.cacheSend(assetId, {
            from: this.props.account,
            gas: 500000
        });
    }

    refund = (assetId) => {
        this.hideDialogs();

        this.props.contract.methods.refundPurchase.cacheSend(assetId, {
            from: this.props.account,
            gas: 500000
        });
    }


    componentDidUpdate(prevProps) {
        if (prevProps.open !== this.props.open) {
            this.setState({
                open: this.props.open
            })
        }
    }


    render() {

        if ((typeof this.props.open === "undefined") || (this.props.open === false)) {
            // do not process this component if it's not required
            return null;
        }

        // set proper action
        switch (this.props.type) {
            case "add":
                this.action = this.addInMarketplace.bind(this);
                break;

            case "remove":
                this.action = this.removeFromMarketplace.bind(this);
                break;

            case "deposit":
                this.action = this.deposit.bind(this);
                break;

            case "purchase":
                this.action = this.purchase.bind(this);
                break;

            case "refund":
                this.action = this.refund.bind(this);
                break;

            default:
                console.error("Action not recognized");
                return null;
        }

        return (
            <div>
                <AlertDialog
                    open={this.props.open}
                    title={this.props.title}
                    assetId={this.props.assetId}
                    message={this.props.message}
                    action={this.action}
                    cancel={this.hideDialogs.bind(this)}/>
            </div>
        );
    }
}


export default Marketplace;