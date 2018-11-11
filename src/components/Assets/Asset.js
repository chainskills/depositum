import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Jumbotron, Card, CardBody, CardText, CardTitle, CardSubtitle, Col, Container, Row} from 'reactstrap';
import Button from '@material-ui/core/Button';
import AddIcon from "@material-ui/icons/Add";
import {ContractData} from 'drizzle-react-components'

import {ipfs} from "../../store/ipfs/ipfs";
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
            dialogTitle: 'Create a new asset',
            openDialog: true,
            openAlertDialog: false
        });
    }

    addAsset = (asset) => {
        this.setState({openDialog: false});
        this.setState({openAlertDialog: false});

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

    handleRemove = (assetId) => {
        this.assetContract.methods.getName(assetId).call().then(function (name) {
            this.setState({
                dialogTitle: 'Remove the asset',
                name: name,
                assetId: assetId,
                openDialog: false,
                openAlertDialog: true
            });
        }.bind(this));
    }

    removeRentItem = (assetId) => {
        this.setState({openDialog: false});
        this.setState({openAlertDialog: false});

        this.assetContract.methods.removeAsset.cacheSend(assetId, {
                from: this.props.accounts[0],
                gas: 500000
            });
    }

    cancelDialog = () => {
        this.setState({openDialog: false});
        this.setState({openAlertDialog: false});
    }


    render() {
        // refresh balance
        this.web3.eth.getBalance(this.props.accounts[0]).then(function(_balance) {
            this.balance = this.web3.utils.fromWei(_balance, "ether");
        }.bind(this));

        // refresh network type
        this.web3.eth.net.getNetworkType().then(function(_networkType) {
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

                                <CardSubtitle>
                                    <ContractDataAmount contract="AssetContract" method="getPrice"
                                                  methodArgs={assetId} fromWei="ether"/>
                                </CardSubtitle>

                                <CardText>
                                    <ContractData contract="AssetContract" method="getDescription"
                                                  methodArgs={assetId} hideIndicator/>
                                </CardText>

                                <Button variant="contained" className={'card-button'}
                                        onClick={() => this.handleRemove(assetId)}>Remove</Button>

                                <Button variant="contained"
                                        onClick={() => this.handleRemove(assetId)}>Edit</Button>

                                <Button variant="contained" className={'float-right'}
                                        onClick={() => this.handleRemove(assetId)}>Sale</Button>
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
                    addAsset={this.addAsset.bind(this)}
                    cancelDialog={this.cancelDialog.bind(this)}/>

                <AlertDialog
                    open={this.state.openAlertDialog}
                    dialogTitle={this.state.dialogTitle}
                    name={this.state.name}
                    assetId={this.state.assetId}
                    removeRentItem={this.removeRentItem.bind(this)}
                    cancelDialog={this.cancelDialog.bind(this)}/>
            </div>
        );
    }
}


Asset.contextTypes = {
    drizzle: PropTypes.object
};

export default Asset;