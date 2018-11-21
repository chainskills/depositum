import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {CardImg} from 'reactstrap';

import {ipfs, IPFS_READ_URL} from "../../../store/ipfs/ipfs";
import {decryptFile} from "../../../shared/security";



/*
 * Create component.
 */

class ContractDataIPFS extends Component {
    constructor(props, context) {
        super(props);

        this.state =  { ipfsData: '' };
        this.contracts = context.drizzle.contracts;

        // Fetch initial value from chain and return cache key for reactive updates
        const methodArgs = this.props.methodArgs ? this.props.methodArgs : [];
        this.dataKey = this.contracts[this.props.contract].methods[this.props.method].cacheCall(...methodArgs);
    }


    async componentDidMount() {
        try {
            console.log("aaa");
            // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
            if(this.dataKey in this.props.contracts[this.props.contract][this.props.method]) {
                console.log("bbb");
                const ipfsHashKey = this.props.contracts[this.props.contract][this.props.method][this.dataKey].value;

                let data = await  ipfs.files.cat(ipfsHashKey);

                let imgSource = decryptFile(data, "pass123", this.props.account);

                const ipfsURL = "data:" + "'image/png'" + ";base64," + imgSource;

                console.log("ipfsURL: " + ipfsURL);

                this.setState({ipfsData: ipfsURL });

                }
        } catch (error) {
            // handle errors
            console.error(error);
        }
    }

    render() {
        // Contract is not yet initialized.
        if(!this.props.contracts[this.props.contract].initialized) {
            return (
                <span>Initializing...</span>
            );
        }

        /*

        // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
        if(!(this.dataKey in this.props.contracts[this.props.contract][this.props.method])) {
            return (<CardImg top className={"card-image"} src="./assets/house.png" alt="Card image cap" />);
        }

        const ipfsHashKey = this.props.contracts[this.props.contract][this.props.method][this.dataKey].value;


        //const ipfsURL = IPFS_READ_URL + ipfsHashKey;

        ipfs.files.cat(ipfsHashKey, function (err, data) {
            console.log(this.props);
            if (err) {
                console.error(err);
            } else {

                let imgSource = decryptFile(data, "pass123", this.props.account);

                const ipfsURL = "data:" + "'image/png'" + ";base64," + imgSource;
                // var imgContent = "data:" + imgType + ";base64," + plainFile;

                console.log("1")
                if (this.props.onlyHash) {
                    console.log("2")
                    return (<a target="_blank" rel="noopener noreferrer" href={`${ipfsURL}`}>Link to IPFS</a>);
                }

                console.log("3")
                return (<CardImg top className={"card-image"} src={`${ipfsURL}`} alt="Card image cap" />);
            }
        }.bind(this));

        return (
            <span>Initializing...</span>
        );
        */

        if (this.props.onlyHash) {
            return (<a target="_blank" rel="noopener noreferrer" href={`${this.state.ipfsData}`}>Link to IPFS</a>);
        }

        return (<CardImg top className={"card-image"} src={`${this.state.ipfsData}`} alt="Card image cap" />);
    }
}

ContractDataIPFS.contextTypes = {
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

export default drizzleConnect(ContractDataIPFS, mapStateToProps);