import React, {Component} from 'react';

import TokenDialog from '../../Dialog/TokenDialog/TokenDialog';
import AlertDialog from '../../Dialog/AlertDialog/AlertDialog';


class Tokens extends Component {

    constructor(props) {
        super(props)

        this.state = {};

        // TODO: subscribe to events specifics to tokens
    }

    hideDialogs = () => {
        this.props.cancel();
    }

    buyTokens = (tokens) => {
        this.hideDialogs();

        const price = tokens * this.props.rate;
        if (price === 0) {
            return;
        }

        this.props.contract.methods.buyTokens.cacheSend({
            from: this.props.account,
            value: price,
            gas: 500000
        });
    }


    mintTokens = (tokens) => {
        this.hideDialogs();

        this.props.contract.methods.mint.cacheSend(tokens, {
            from: this.props.account,
            gas: 500000
        });
    }

    transferEarnings = () => {
        this.hideDialogs();

        this.props.contract.methods.transferEarnings.cacheSend({
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

        return (
            <div>
                {this.props.type !== "transfer" &&
                <TokenDialog
                    open={this.props.open}
                    type={this.props.type}
                    title={this.props.title}
                    tokenRate={typeof this.props.rate !== "undefined" ? this.props.web3.utils.fromWei(this.props.web3.utils.toBN(this.props.rate), "ether") : 0}
                    action={this.props.type === "buy" ? this.buyTokens.bind(this) : this.mintTokens.bind(this)}
                    cancel={this.hideDialogs.bind(this)}/>
                }

                {this.props.type === "transfer" &&
                <AlertDialog
                    open={this.props.open}
                    title={this.props.title}
                    message={this.props.message}
                    action={this.transferEarnings.bind(this)}
                    cancel={this.hideDialogs.bind(this)}/>
                }
            </div>
        );
    }
}


export default Tokens;