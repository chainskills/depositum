import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Jumbotron, Card, CardBody, CardText, CardTitle, Col, Container, Row} from 'reactstrap';
import Button from '@material-ui/core/Button';
import AddIcon from "@material-ui/icons/Add";
import {ContractData} from 'drizzle-react-components'

import {ipfs, IPFS_READ_URL} from "../../store/ipfs/ipfs";
import ContractDataIPFS from '../ContractData/ContractDataIPFS/ContractDataIPFS';
import ContractDataAmount from '../ContractData/ContractDataAmount/ContractDataAmount';
import ContractDataActions from '../ContractData/ContractDataActions/ContractDataActions';

import AssetDialog from '../Dialog/AssetDialog/AssetDialog';
import AlertDialog from '../Dialog/AlertDialog/AlertDialog';
import './Assets.css';


class Assets extends Component {

    constructor(props, context) {
        super(props)

        this.state = {};

        this.web3 = context.drizzle.web3;

        this.assetContract = context.drizzle.contracts.AssetContract;

        this.validAssetIDsKey = this.assetContract.methods[this.props.fetchMethod].cacheCall();

        // listen for events
        this.listenEvents();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.accounts[0] !== this.props.accounts[0]) {
            // account has been changed -> reload the list of assets
            this.validAssetIDsKey = this.assetContract.methods[this.props.fetchMethod].cacheCall();
        }
    }

    listenEvents = () => {
        //this.web3.eth.clearSubscriptions();

        console.log(this.event);

        this.event = this.assetContract.events.NewAsset({}, (error, event) => {
            console.log(error, event);
        })/*
            .on("data", function (event) {
                console.log(event);
            })
            .on("error", function (error) {
                console.error(error);
            })*/;
    }

    handleNew = () => {
        this.setState({
            action: 'new',
            dialogTitle: 'Create new asset',
            assetId: '',
            owner: '',
            name: '',
            description: '',
            imageSource: '',
            price: '',
            openDialog: true,
            openAlertDialog: false
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
                openDialog: true,
                openAlertDialog: false
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
                openDialog: true,
                openAlertDialog: false
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

            this.setState({
                dialogTitle: title,
                message: message,
                assetId: assetId,
                action: this.removeItem.bind(this),
                openDialog: false,
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

            this.setState({
                dialogTitle: title,
                message: message,
                assetId: assetId,
                action: this.setMarketplace.bind(this),
                openDialog: false,
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

            this.setState({
                dialogTitle: title,
                message: message,
                assetId: assetId,
                action: this.unsetMarketplace.bind(this),
                openDialog: false,
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

            this.setState({
                dialogTitle: title,
                message: message,
                assetId: assetId,
                action: this.deposit.bind(this),
                openDialog: false,
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

            this.setState({
                dialogTitle: title,
                message: message,
                assetId: assetId,
                action: this.purchaseAsset.bind(this),
                openDialog: false,
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

            this.setState({
                dialogTitle: title,
                message: message,
                assetId: assetId,
                action: this.refundPurchase.bind(this),
                openDialog: false,
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
        this.setState({
            action: '',
            dialogTitle: '',
            assetId: '',
            owner: '',
            name: '',
            description: '',
            imageSource: '',
            price: '',
            openDialog: false,
            openAlertDialog: false
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
                    </Jumbotron>

                    <Row>
                        <Col xs={12} lg={12}>
                            <div className={"addItem"}>
                                <Button className={"add-button"} variant="fab" color="primary" aria-label="add"
                                        onClick={() => {
                                            this.handleNew();
                                        }}>
                                    <AddIcon/>
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
                    open={this.state.openDialog}
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