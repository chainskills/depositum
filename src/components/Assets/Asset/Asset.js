import React, {Component} from 'react';

import AssetDialog from '../../Dialog/AssetDialog/AssetDialog';
import AlertDialog from '../../Dialog/AlertDialog/AlertDialog';
import {ipfs} from '../../../store/ipfs/ipfs';
import {encryptFile} from '../../../shared/security';


class Asset extends Component {

    constructor(props) {
        super(props)

        this.state = {};

        // TODO: subscribe to events specifics to tokens
    }

    hideDialogs = () => {
        this.props.cancel();
    }

    addAsset = (asset) => {
        this.hideDialogs();

        console.log(asset);
        if (asset.imageBuffer != null) {

            let assetFile = asset.imageBuffer;

            if (asset.encrypted) {
                // we encrypt the file only if we are the owner

                // TODO: DO not use static password !!!
                assetFile = encryptFile(asset.imageBuffer, "depositum");
            }

            // save the document to IPFS
            ipfs.files.add(assetFile, {pin: true}, (error, result) => {
                if (error) {
                    console.error(error)
                    return
                }

                let price = asset.price;
                if (price !== '') {
                    price = this.props.web3.utils.toWei(price, "ether");
                }

                this.props.contract.methods.addAsset.cacheSend(asset.name, asset.description, result[0].hash, price, asset.encrypted, {
                    from: this.props.account,
                    gas: 500000
                });
            });
        }
    }


    updateAsset = (asset) => {
        this.hideDialogs();

        let price = asset.price;
        if (price !== '') {
            price = this.props.web3.utils.toWei(price, "ether");
        }

        console.log(asset);
        if (asset.imageBuffer != null) {
            let assetFile = asset.imageBuffer;

            if (this.props.owner === this.props.account) {
                if (this.props.encrypted && (this.props.encrypted !== asset.encrypted)) {
                    // we encrypt the file only if we are the owner

                    // TODO: DO not use static password !!!
                    assetFile = encryptFile(asset.imageBuffer, "depositum");
                }
            }

            // save the document to IPFS
            ipfs.files.add(assetFile, {pin: true}, (error, result) => {
                if (error) {
                    console.error(error)
                    return
                }

                this.props.contract.methods.updateAsset.cacheSend(asset.assetId, asset.name, asset.description, result[0].hash, price, asset.encrypted, {
                    from: this.props.account,
                    gas: 500000
                });

            });
        } else {
            // image not changed -> update asset with the ipfs hash key retrieved during the getAsset() function call
            this.props.contract.methods.updateAsset.cacheSend(asset.assetId, asset.name, asset.description, this.props.ipfsHashKey, price, asset.encrypted, {
                from: this.props.account,
                gas: 500000
            });
        }
    }

    removeItem = (assetId) => {
        this.hideDialogs();

        this.props.contract.methods.removeAsset.cacheSend(assetId, {
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
                {this.props.type !== "remove" &&
                <AssetDialog
                    type={this.props.type}
                    open={this.props.open}
                    title={this.props.title}
                    assetId={this.props.assetId}
                    owner={this.props.owner}
                    name={this.props.name}
                    description={this.props.description}
                    imageSource={this.props.imageSource}
                    price={this.props.price}
                    encrypted={this.props.encrypted}
                    readOnly={this.props.type === "read" ? true : false}
                    action={this.props.type === "new" ? this.addAsset.bind(this) : this.updateAsset.bind(this)}
                    cancel={this.hideDialogs.bind(this)}/>
                }


                {this.props.type === "remove" &&
                <AlertDialog
                    open={this.props.open}
                    title={this.props.title}
                    assetId={this.props.assetId}
                    message={this.props.message}
                    action={this.removeItem.bind(this)}
                    cancel={this.hideDialogs.bind(this)}/>
                }
            </div>
        );
    }
}


export default Asset;