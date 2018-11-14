import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Jumbotron, Card, CardBody, CardText, CardTitle, Col, Container, Row} from 'reactstrap';
import Button from '@material-ui/core/Button';
import {ContractData} from 'drizzle-react-components'

import {ipfs, IPFS_READ_URL} from "../../store/ipfs/ipfs";
import ContractDataIPFS from '../ContractData/ContractDataIPFS/ContractDataIPFS';
import ContractDataAmount from '../ContractData/ContractDataAmount/ContractDataAmount';
import ContractDataActions from '../ContractData/ContractDataActions/ContractDataActions';

import TokenDialog from '../Dialog/TokenDialog/TokenDialog';
import MintDialog from '../Dialog/MintDialog/MintDialog';
import AssetDialog from '../Dialog/AssetDialog/AssetDialog';
import AlertDialog from '../Dialog/AlertDialog/AlertDialog';

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
        this.event = this.assetContract.events.NewAsset({fromBlock:'latest', toBlock:'latest'})
            .on("data", function (event) {
                console.log(event);
            })
            .on("error", function (error) {
                console.error(error);
            });

        this.event2 = this.assetContract.events.Transfer({fromBlock:'latest', toBlock:'latest'})
            .on("data", function (event) {
                console.log(event);
            })
            .on("error", function (error) {
                console.error(error);
            });
        this.event3 = this.assetContract.events.Approval({fromBlock:'latest', toBlock:'latest'})
            .on("data", function (event) {
                console.log(event);
            })
            .on("error", function (error) {
                console.error(error);
            });
    }


    hideDialogs = () => {
        this.setState({
            openMintDialog: false,
            openTokenDialog: false,
            openAssetDialog: false,
            openAlertDialog: false
        });
    }

    handleBuyTokens = () => {
        this.hideDialogs();
        this.setState({
            openTokenDialog: true
        });
    }

    buyTokens = (tokens) => {
        this.cancelDialog();

        const price = tokens * this.tokenRate;
        if (price === 0) {
            return;
        }

        this.assetContract.methods.buyTokens.cacheSend({
            from: this.props.accounts[0],
            value: price,
            gas: 500000
        });
    }

    handleMintTokens = () => {
        this.hideDialogs();
        this.setState({
            openMintDialog: true
        });
    }

    mintTokens = (tokens) => {
        this.cancelDialog();

        this.assetContract.methods.mint.cacheSend(tokens, {
            from: this.props.accounts[0],
            gas: 500000
        });
    }


    handleTransferEarnings = () => {
        let title = `Transfer Earning`;
        let message = `Are you sure to transfer your earnings of an amount of ${this.earnings} ETH?`;

        this.hideDialogs();
        this.setState({
            dialogTitle: title,
            message: message,
            action: this.transferEarnings.bind(this),
            openAlertDialog: true
        });
    }

    transferEarnings = () => {
        this.cancelDialog();

        this.assetContract.methods.transferEarnings.cacheSend({
            from: this.props.accounts[0],
            gas: 500000
        });
    }

    handleNewAsset = () => {
        this.hideDialogs();
        this.setState({
            action: 'new',
            dialogTitle: 'Create new asset',
            assetId: '',
            owner: '',
            name: '',
            description: '',
            imageSource: '',
            price: '',
            openAssetDialog: true
        });
    }

    addAsset = (asset) => {
        this.cancelDialog();

        if (asset.imageBuffer != null) {
            // save the document to IPFS
            ipfs.files.add(asset.imageBuffer, {pin: true}, (error, result) => {
                if (error) {
                    console.error(error)
                    return
                }

                let price = asset.price;
                if (price !== '') {
                    price = this.web3.utils.toWei(price, "ether");
                }

                this.assetContract.methods.addAsset.cacheSend(asset.name, asset.description, result[0].hash, price, {
                    from: this.props.accounts[0],
                    gas: 500000
                });

            });
        }
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
                action: 'edit',
                dialogTitle: 'Edit your asset',
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

    handleDetails = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            if (asset._owner === "0x0000000000000000000000000000000000000000") {
                // unable to fetch the asset
                return;
            }

            const ipfsURL = IPFS_READ_URL + asset._hashKey;

            const price = this.web3.utils.fromWei(asset._price, "ether");

            this.hideDialogs();
            this.setState({
                action: 'read',
                dialogTitle: 'Details of the asset',
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

    updateAsset = (asset) => {
        this.cancelDialog();

        let price = asset.price;
        if (price !== '') {
            price = this.web3.utils.toWei(price, "ether");
        }

        if (asset.imageBuffer != null) {
            // save the document to IPFS
            ipfs.files.add(asset.imageBuffer, {pin: true}, (error, result) => {
                if (error) {
                    console.error(error)
                    return
                }

                this.assetContract.methods.updateAsset.cacheSend(asset.assetId, asset.name, asset.description, result[0].hash, price, {
                    from: this.props.accounts[0],
                    gas: 500000
                });

            });
        } else {
            // image not changed -> update asset with the ipfs hash key retrieved during the getAsset() function call
            this.assetContract.methods.updateAsset.cacheSend(asset.assetId, asset.name, asset.description, this.state.ipfsHashKey, price, {
                from: this.props.accounts[0],
                gas: 500000
            });
        }
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
                dialogTitle: title,
                message: message,
                assetId: assetId,
                action: this.removeItem.bind(this),
                openAlertDialog: true
            });
        }.bind(this));
    }

    removeItem = (assetId) => {
        this.cancelDialog();

        this.assetContract.methods.removeAsset.cacheSend(assetId, {
            from: this.props.accounts[0],
            gas: 500000
        });
    }

    handleSetMarketplace = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            const title = `Available in the marketplace`;
            const message = `Are you sure to set your asset available in the marketplace?`;

            this.hideDialogs();
            this.setState({
                dialogTitle: title,
                message: message,
                assetId: assetId,
                action: this.setMarketplace.bind(this),
                openAlertDialog: true
            });
        }.bind(this));
    }

    setMarketplace = (assetId) => {
        this.cancelDialog();

        this.assetContract.methods.setMarketplace.cacheSend(assetId, {
            from: this.props.accounts[0],
            gas: 500000
        });
    }

    handleUnsetMarketplace = (assetId) => {
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
                dialogTitle: title,
                message: message,
                assetId: assetId,
                action: this.unsetMarketplace.bind(this),
                openAlertDialog: true
            });
        }.bind(this));
    }

    unsetMarketplace = (assetId) => {
        this.cancelDialog();

        this.assetContract.methods.unsetMarketplace.cacheSend(assetId, {
            from: this.props.accounts[0],
            gas: 500000
        });
    }

    handleDeposit = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            let price = this.web3.utils.fromWei(asset._price, "ether");

            const title = `Set an purchase option`;
            const message = `Are you sure to deposit an option of ${price} ETH for the purchase of this asset?`;

            this.hideDialogs();
            this.setState({
                dialogTitle: title,
                message: message,
                assetId: assetId,
                action: this.deposit.bind(this),
                openAlertDialog: true
            });
        }.bind(this));
    }

    deposit = (assetId) => {
        this.cancelDialog();

        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {
            this.assetContract.methods.deposit.cacheSend(assetId, {
                from: this.props.accounts[0],
                value: asset._price,
                gas: 500000
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
                dialogTitle: title,
                message: message,
                assetId: assetId,
                action: this.purchaseAsset.bind(this),
                openAlertDialog: true
            });
        }.bind(this));
    }

    purchaseAsset = (assetId) => {
        this.cancelDialog();

        this.assetContract.methods.purchaseAsset.cacheSend(assetId, {
            from: this.props.accounts[0],
            gas: 500000
        });
    }

    handleRefund = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            let price = this.web3.utils.fromWei(asset._price, "ether");

            const title = `Refund`;
            const message = `Are you sure to cancel your purchase and be refunded of your deposit of ${price} ETH?`;

            this.hideDialogs();
            this.setState({
                dialogTitle: title,
                message: message,
                assetId: assetId,
                action: this.refundPurchase.bind(this),
                openAlertDialog: true
            });
        }.bind(this));
    }

    refundPurchase = (assetId) => {
        this.cancelDialog();

        this.assetContract.methods.refundPurchase.cacheSend(assetId, {
            from: this.props.accounts[0],
            gas: 500000
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
            price: ''
        });
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
        if(this.rateKey in this.props.AssetContract["getRate"]) {
            this.tokenRate = this.props.AssetContract["getRate"][this.rateKey].value;
        }

        // get the number of tokens
        this.tokens = 0;
        if(this.tokensKey in this.props.AssetContract["balanceOf"]) {
            this.tokens = this.props.AssetContract["balanceOf"][this.tokensKey].value;
        }

        // get the rate
        this.serviceFee = 0;
        if(this.serviceFeeKey in this.props.AssetContract["getServiceFee"]) {
            this.serviceFee = this.props.AssetContract["getServiceFee"][this.serviceFeeKey].value;
        }

        // check if we are the contract owner the rate
        this.isContractOwner = false;
        if(this.isOwnerKey in this.props.AssetContract["isContractOwner"]) {
            this.isContractOwner = this.props.AssetContract["isContractOwner"][this.isOwnerKey].value;
        }

        // get earnings
        this.earnings = 0;
        if(this.earningsKey in this.props.AssetContract["getEarnings"]) {
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
                                                     actionSet={this.handleSetMarketplace.bind(this)}
                                                     actionUnset={this.handleUnsetMarketplace.bind(this)}
                                                     actionRemove={this.handleRemove.bind(this)}
                                                     actionEdit={this.handleEdit.bind(this)}
                                                     actionView={this.handleDetails.bind(this)}
                                                     actionDeposit={this.handleDeposit.bind(this)}
                                                     actionPurchase={this.handlePurchase.bind(this)}
                                                     actionRefund={this.handleRefund.bind(this)}/>
                            </CardBody>
                        </Card>
                    </Col>);

                allAssets.push(item);

            }
        }

        console.log("aaaa");

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

                <AssetDialog
                    action={this.state.action}
                    open={this.state.openAssetDialog}
                    dialogTitle={this.state.dialogTitle}
                    assetId={this.state.assetId}
                    owner={this.state.owner}
                    name={this.state.name}
                    description={this.state.description}
                    imageSource={this.state.imageSource}
                    price={this.state.price}
                    addAsset={this.addAsset.bind(this)}
                    updateAsset={this.updateAsset.bind(this)}
                    cancelDialog={this.cancelDialog.bind(this)}/>

                <TokenDialog
                    action={"buy"}
                    open={this.state.openTokenDialog}
                    dialogTitle={"Buy Depositum tokens"}
                    tokenRate={typeof this.tokenRate !== "undefined" ? this.web3.utils.fromWei(this.web3.utils.toBN(this.tokenRate), "ether") : 0}
                    buyTokens={this.buyTokens.bind(this)}
                    cancelDialog={this.cancelDialog.bind(this)}/>

                <MintDialog
                    action={"mint"}
                    open={this.state.openMintDialog}
                    dialogTitle={"Mint Depositum tokens"}
                    mintTokens={this.mintTokens.bind(this)}
                    cancelDialog={this.cancelDialog.bind(this)}/>


                <AlertDialog
                    open={this.state.openAlertDialog}
                    dialogTitle={this.state.dialogTitle}
                    message={this.state.message}
                    assetId={this.state.assetId}
                    action={this.state.action}
                    cancelDialog={this.cancelDialog.bind(this)}/>
            </div>
        );
    }
}


Assets.contextTypes = {
    drizzle: PropTypes.object
};

export default Assets;