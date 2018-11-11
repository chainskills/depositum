import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Jumbotron, Card, CardBody, CardText, CardTitle, Col, Container, Row} from 'reactstrap';
import Button from '@material-ui/core/Button';
import AddIcon from "@material-ui/icons/Add";
import {ContractData} from 'drizzle-react-components'

import {ipfs, IPFS_READ_URL} from "../../store/ipfs/ipfs";
import ContractDataIPFS from '../ContractData/ContractDataIPFS/ContractDataIPFS';
import ContractDataAmount from '../ContractData/ContractDataAmount/ContractDataAmount';
import AssetDialog from './AssetDialog/AssetDialog';
import AlertDialog from './AlertDialog/AlertDialog';
import './Asset.css';


class Asset extends Component {

    constructor(props, context) {
        super(props)

        this.state = {};

        this.web3 = context.drizzle.web3;

        this.assetContract = context.drizzle.contracts.AssetContract;

        this.validAssetIDsKey = this.assetContract.methods.getMyAssets.cacheCall();

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

            console.log(asset);

            if (asset._owner === 0x0) {
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

            let price = this.web3.utils.toWei(asset._price, "ether");

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

    handleUnsetMarketplace = (assetId) => {
        this.assetContract.methods.getAsset(assetId).call().then(function (asset) {

            let price = this.web3.utils.toWei(asset._price, "ether");

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

    setMarketplace = (assetId) => {
        this.cancelDialog();

        this.assetContract.methods.setMarketplace.cacheSend(assetId, {
            from: this.props.accounts[0],
            gas: 500000
        });
    }

    unsetMarketplace = (assetId) => {
        this.cancelDialog();

        this.assetContract.methods.unsetMarketplace.cacheSend(assetId, {
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

        if (this.validAssetIDsKey in this.props.AssetContract.getMyAssets) {
            const validAssetIDs = this.props.AssetContract.getMyAssets[this.validAssetIDsKey].value;

            for (let i = 0; i < validAssetIDs.length; i++) {
                const assetId = validAssetIDs[i];

                const item = (
                    <Col xs={6} md={4} key={assetId} className="vertical-spacing">
                        <Card>
                            <ContractDataIPFS contract="AssetContract" method="getHashKey"
                                              methodArgs={assetId}/>

                            <CardBody>
                                <CardTitle>
                                    <ContractData contract="AssetContract" method="getName"
                                                  methodArgs={assetId} hideIndicator/>
                                </CardTitle>

                                <CardText>
                                    <ContractDataAmount contract="AssetContract" method="getPrice"
                                                        methodArgs={assetId} fromWei="ether" units="ETH"/>
                                </CardText>

                                <Button variant="contained" className={'card-button'}
                                        onClick={() => this.handleRemove(assetId)}>Remove</Button>

                                <Button variant="contained"
                                        onClick={() => this.handleEdit(assetId)}>Edit</Button>

                                <Button variant="contained" className={'float-right'}
                                        onClick={() => this.handleSetMarketplace(assetId)}>Set</Button>

                                <Button variant="contained" className={'float-right'}
                                        onClick={() => this.handleUnsetMarketplace(assetId)}>Unset</Button>
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
                        <h2>Welcome to Depositum</h2>
                        <p>This is an example of Dapp that stores and sells your assets using Ethereum and IPFS</p>
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


Asset.contextTypes = {
    drizzle: PropTypes.object
};

export default Asset;