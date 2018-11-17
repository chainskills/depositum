import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Jumbotron, Card, CardBody, CardText, CardTitle, Col, Container, Row} from 'reactstrap';
import Button from '@material-ui/core/Button';
import {ContractData} from 'drizzle-react-components'

import {IPFS_READ_URL} from "../../store/ipfs/ipfs";
import ContractDataIPFS from '../ContractData/ContractDataIPFS/ContractDataIPFS';
import ContractDataAmount from '../ContractData/ContractDataAmount/ContractDataAmount';
import ContractDataActions from '../ContractData/ContractDataActions/ContractDataActions';

import Asset from './Asset/Asset';
import Token from './Tokens/Tokens';
import Marketplace from './Marketplace/Marketplace';

import './Assets.css';


class Assets extends Component {

    constructor(props, context) {
        super(props)


        this.state = {};

        this.web3 = context.drizzle.web3;

        this.assetContract = context.drizzle.contracts.AssetContract;

        // fetch the list if asset IDs
        this.validAssetIDsKey = this.assetContract.methods[this.props.fetchMethod].cacheCall({
            from: this.props.accounts[0]
        });

        // fetch the rate to buy tokens
        this.rateKey = this.assetContract.methods["getRate"].cacheCall();

        // fetch the number of tokens
        this.tokensKey = this.assetContract.methods["balanceOf"].cacheCall(this.props.accounts[0]);

        // fetch the service cost
        this.serviceFeeKey = this.assetContract.methods["getServiceFee"].cacheCall();

        // fetch if we are the owner of the service
        this.isOwnerKey = this.assetContract.methods["isContractOwner"].cacheCall({
            from: this.props.accounts[0]
        });

        // fetch the balance of earnings
        this.earningsKey = this.assetContract.methods["getEarnings"].cacheCall();

        // listen for events
        this.listenEvents();
    }

    componentDidUpdate(prevProps) {

        if (prevProps.accounts[0] !== this.props.accounts[0]) {
            // account has been changed -> reload the list of images
            this.validAssetIDsKey = this.assetContract.methods[this.props.fetchMethod].cacheCall({
                from: this.props.accounts[0]
            });

            // fetch the number of tokens
            this.tokensKey = this.assetContract.methods["balanceOf"].cacheCall(this.props.accounts[0]);

            // fetch if we are the owner of the service
            this.isOwnerKey = this.assetContract.methods["isContractOwner"].cacheCall({
                from: this.props.accounts[0]
            });

            // fetch the balance of earnings
            this.earningsKey = this.assetContract.methods["getEarnings"].cacheCall();
        }
    }

    componentWillUnmount() {
        if (this.event != null) {
            this.event.unsubscribe();
        }
        if (this.event2 != null) {
            this.event2.unsubscribe();
        }
        if (this.event3 != null) {
            this.event3.unsubscribe();
        }

    }

    listenEvents = () => {
        this.event = this.assetContract.events.NewAsset({fromBlock: 'latest', toBlock: 'latest'})
            .on("data", function (event) {
                console.log(event);
            })
            .on("error", function (error) {
                console.error(error);
            });

        this.event2 = this.assetContract.events.Transfer({fromBlock: 'latest', toBlock: 'latest'})
            .on("data", function (event) {
                console.log(event);
            })
            .on("error", function (error) {
                console.error(error);
            });
        this.event3 = this.assetContract.events.Approval({fromBlock: 'latest', toBlock: 'latest'})
            .on("data", function (event) {
                console.log(event);
            })
            .on("error", function (error) {
                console.error(error);
            });
    }


    hideDialogs = () => {
        this.setState({
            openTokenDialog: false,
            openAssetDialog: false,
            openMarketplace: false
        });
    }

    cancelDialog = () => {
        this.hideDialogs();
        this.setState({
            action: '',
            dialogTitle: '',
            assetId: '',
            owner: '',
            name: '',
            description: '',
            imageSource: '',
            ipfsHashKey: '',
            price: ''
        });
    }

    //
    // Manage tokens
    //

    handleBuyTokens = () => {
        console.log("aaa");
        this.hideDialogs();
        this.setState({
            type: "buy",
            openTokenDialog: true,
            title: "Buy Depositum tokens",
            message: ''
        });
    }

    handleMintTokens = () => {
        this.hideDialogs();
        this.setState({
            type: "mint",
            openTokenDialog: true,
            title: "Mint new Depositum tokens",
            message: ''
        });
    }

    handleTransferEarnings = () => {
        this.hideDialogs();
        this.setState({
            type: "transfer",
            openTokenDialog: true,
            title: "Transfer your earnings",
            message: `Are you sure to transfer your earnings of an amount of ${this.earnings} ETH?`
        });
    }

    //
    // Manage assets
    //

    handleNewAsset = () => {
        this.hideDialogs();
        this.setState({
            type: 'new',
            title: 'Create new asset',
            assetId: '',
            owner: '',
            name: '',
            description: '',
            imageSource: '',
            price: '',
            openAssetDialog: true
        });
    }

    handleEdit = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            if (asset._owner === "0x0000000000000000000000000000000000000000") {
                // unable to fetch the asset
                return;
            }

            const ipfsURL = IPFS_READ_URL + asset._hashKey;

            const price = this.web3.utils.fromWei(asset._price, "ether");

            this.hideDialogs();
            this.setState({
                type: 'edit',
                title: 'Edit your asset',
                assetId: assetId,
                owner: asset._owner,
                name: asset._name,
                description: asset._description,
                ipfsHashKey: asset._hashKey,
                imageSource: ipfsURL,
                price: price,
                openAssetDialog: true
            });

        }.bind(this));
    }

    handleView = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            if (asset._owner === "0x0000000000000000000000000000000000000000") {
                // unable to fetch the asset
                return;
            }

            const ipfsURL = IPFS_READ_URL + asset._hashKey;

            const price = this.web3.utils.fromWei(asset._price, "ether");

            this.hideDialogs();
            this.setState({
                type: 'read',
                title: 'Detail of the asset',
                assetId: assetId,
                owner: asset._owner,
                name: asset._name,
                description: asset._description,
                ipfsHashKey: asset._hashKey,
                imageSource: ipfsURL,
                price: price,
                openAssetDialog: true
            });

        }.bind(this));
    }

    handleRemove = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            let price = this.web3.utils.fromWei(asset._price, "ether");

            let additionalMessage = "";
            if (this.web3.utils.toBN(asset._candidate).isZero() === false) {
                additionalMessage = ` and to refund the candidate buyer of ${price} ETH `;
            }

            let title = `Remove ${asset._name} ?`;
            let message = `Are you sure to remove your asset ${additionalMessage} ?`;

            this.hideDialogs();
            this.setState({
                type: 'remove',
                title: title,
                message: message,
                assetId: assetId,
                openAssetDialog: true
            });
        }.bind(this));
    }

    //
    // Manage marketplace
    //


    handleAddInMarketplace = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            const title = `Sell in the marketplace`;
            const message = `Are you sure to sell your asset in the marketplace?`;

            this.hideDialogs();
            this.setState({
                type: 'add',
                title: title,
                message: message,
                assetId: assetId,
                openMarketplace: true
            });
        }.bind(this));
    }

    handleRemoveFromMarketplace = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            let price = this.web3.utils.fromWei(asset._price, "ether");

            let additionalMessage = "";
            if (this.web3.utils.toBN(asset._candidate).isZero() === false) {
                additionalMessage = ` and to refund the candidate buyer of ${price} ETH `;
            }

            const title = `Remove from the marketplace`;
            const message = `Are you sure to remove your asset from the marketplace ${additionalMessage} ?`;

            this.hideDialogs();
            this.setState({
                type: 'remove',
                title: title,
                message: message,
                assetId: assetId,
                openMarketplace: true
            });
        }.bind(this));
    }

    handleDeposit = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            let price = this.web3.utils.fromWei(asset._price, "ether");

            const title = `Set an purchase option`;
            const message = `Are you sure to deposit an option of ${price} ETH for the purchase of this asset?`;

            this.hideDialogs();
            this.setState({
                type: 'deposit',
                title: title,
                message: message,
                assetId: assetId,
                openMarketplace: true
            });
        }.bind(this));
    }

     handlePurchase = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            let price = this.web3.utils.fromWei(asset._price, "ether");

            const title = `Purchase the asset`;
            const message = `Are you sure to purchase the asset by transferring your deposit of ${price} ETH to the owner?`;

            this.hideDialogs();
            this.setState({
                type: 'purchase',
                title: title,
                message: message,
                assetId: assetId,
                openMarketplace: true
            });
        }.bind(this));
    }

    handleRefund = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            let price = this.web3.utils.fromWei(asset._price, "ether");

            const title = `Refund`;
            const message = `Are you sure to cancel your purchase and be refunded of your deposit of ${price} ETH?`;

            this.hideDialogs();
            this.setState({
                type: 'refund',
                title: title,
                message: message,
                assetId: assetId,
                openMarketplace: true
            });
        }.bind(this));
    }



    render() {
        // refresh balance
        this.web3.eth.getBalance(this.props.accounts[0]).then(function (_balance) {
            this.balance = this.web3.utils.fromWei(_balance, "ether");
        }.bind(this));

        // refresh network type
        this.web3.eth.net.getNetworkType().then(function (_networkType) {
            this.networkType = _networkType;
        }.bind(this));

        let allAssets = [];

        // get the rate
        this.tokenRate = 0;
        if (this.rateKey in this.props.AssetContract["getRate"]) {
            const rate = this.props.AssetContract["getRate"][this.rateKey].value;
            //this.tokenRate = rate !== "undefined" ? this.web3.utils.fromWei(this.web3.utils.toBN(rate), "ether") : 0;
            this.tokenRate = rate;

        }

        // get the number of tokens
        this.tokens = 0;
        if (this.tokensKey in this.props.AssetContract["balanceOf"]) {
            this.tokens = this.props.AssetContract["balanceOf"][this.tokensKey].value;
        }

        // get the rate
        this.serviceFee = 0;
        if (this.serviceFeeKey in this.props.AssetContract["getServiceFee"]) {
            this.serviceFee = this.props.AssetContract["getServiceFee"][this.serviceFeeKey].value;
        }

        // check if we are the contract owner the rate
        this.isContractOwner = false;
        if (this.isOwnerKey in this.props.AssetContract["isContractOwner"]) {
            this.isContractOwner = this.props.AssetContract["isContractOwner"][this.isOwnerKey].value;
        }

        // get earnings
        this.earnings = 0;
        if (this.earningsKey in this.props.AssetContract["getEarnings"]) {
            this.earnings = this.web3.utils.fromWei(this.props.AssetContract["getEarnings"][this.earningsKey].value, "ether");
        }

        if (this.validAssetIDsKey in this.props.AssetContract[this.props.fetchMethod]) {
            const validAssetIDs = this.props.AssetContract[this.props.fetchMethod][this.validAssetIDsKey].value;

            if (typeof validAssetIDs == "undefined") {
                return null;
            }

            for (let i = 0; i < validAssetIDs.length; i++) {
                const assetId = validAssetIDs[i];

                const item = (
                    <Col xs={6} md={6} key={assetId} className="vertical-spacing">
                        <Card>
                            <ContractDataIPFS contract={this.assetContract.contractName} method="getHashKey"
                                              methodArgs={assetId}/>

                            <CardBody>
                                <CardTitle>
                                    <ContractData contract={this.assetContract.contractName} method="getName"
                                                  methodArgs={assetId} hideIndicator/>
                                </CardTitle>

                                <CardText>
                                    <ContractDataAmount contract={this.assetContract.contractName} method="getPrice"
                                                        methodArgs={assetId} fromWei="ether" units="ETH"/>
                                </CardText>

                                <ContractDataActions contract={this.assetContract.contractName} method="getAsset"
                                                     assetId={assetId}
                                                     account={this.props.accounts[0]}
                                                     actionSet={this.handleAddInMarketplace.bind(this)}
                                                     actionUnset={this.handleRemoveFromMarketplace.bind(this)}
                                                     actionRemove={this.handleRemove.bind(this)}
                                                     actionEdit={this.handleEdit.bind(this)}
                                                     actionView={this.handleView.bind(this)}
                                                     actionDeposit={this.handleDeposit.bind(this)}
                                                     actionPurchase={this.handlePurchase.bind(this)}
                                                     actionRefund={this.handleRefund.bind(this)}/>
                            </CardBody>
                        </Card>
                    </Col>);

                allAssets.push(item);

            }
        }

        return (
            <div>
                <Container>
                    <Jumbotron>
                        <h2>{this.props.title}</h2>
                        <p>{this.props.subTitle}</p>
                        <br/>
                        <p>Your are connected on the network: {this.networkType}</p>
                        <p>Your account: {this.props.accounts[0]}</p>
                        <p>Your balance: {this.balance} ETH</p>
                        {this.isContractOwner &&
                        <p>Your earnings: {this.earnings} ETH</p>
                        }
                        <p>Your tokens: {this.tokens} DPN</p>
                        <p>Service Fee: {this.serviceFee} DPN</p>
                    </Jumbotron>

                    <Row>
                        <Col xs={12} lg={12}>
                            <div className={"addItem"}>
                                {Number(this.tokens) >= Number(this.serviceFee) &&
                                <Button className={"add-button margin-button"} variant="contained" color="primary"
                                        onClick={() => {
                                            this.handleNewAsset();
                                        }}>
                                    New Asset
                                </Button>
                                }

                                {this.isContractOwner &&
                                <Button className={"add-button margin-button"} variant="contained" color="primary"
                                        onClick={() => {
                                            this.handleMintTokens();
                                        }}>
                                    Mint new tokens
                                </Button>
                                }

                                {(this.isContractOwner && (this.earnings > 0)) &&
                                <Button className={"add-button margin-button"} variant="contained" color="primary"
                                        onClick={() => {
                                            this.handleTransferEarnings();
                                        }}>
                                    Transfer Earnings
                                </Button>
                                }

                                <Button className={"add-button"} variant="contained" color="primary"
                                        onClick={() => {
                                            this.handleBuyTokens();
                                        }}>
                                    Buy Tokens
                                </Button>

                            </div>
                        </Col>
                    </Row>

                    <Row>
                        {allAssets}
                    </Row>

                </Container>

                <Asset
                    type={this.state.type}
                    open={this.state.openAssetDialog}
                    title={this.state.title}
                    message={this.state.message}
                    account={this.props.accounts[0]}
                    web3={this.web3}
                    contract={this.assetContract}
                    assetId={this.state.assetId}
                    owner={this.state.owner}
                    name={this.state.name}
                    description={this.state.description}
                    imageSource={this.state.imageSource}
                    ipfsHashKey={this.state.ipfsHashKey}
                    price={this.state.price}
                    cancel={this.cancelDialog.bind(this)}/>

                <Token
                    type={this.state.type}
                    open={this.state.openTokenDialog}
                    title={this.state.title}
                    message={this.state.message}
                    account={this.props.accounts[0]}
                    web3={this.web3}
                    contract={this.assetContract}
                    rate={typeof this.tokenRate !== "undefined" ? this.tokenRate : 0}
                    cancel={this.cancelDialog.bind(this)}
                    />

                <Marketplace
                    type={this.state.type}
                    open={this.state.openMarketplace}
                    title={this.state.title}
                    message={this.state.message}
                    assetId={this.state.assetId}
                    contract={this.assetContract}
                    cancel={this.cancelDialog.bind(this)}/>
            </div>
        );
    }
}


Assets.contextTypes = {
    drizzle: PropTypes.object
};

export default Assets;