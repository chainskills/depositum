import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Jumbotron, Card, CardBody, CardText, CardTitle, Col, Container, Row} from 'reactstrap';
import Button from '@material-ui/core/Button';
import AddIcon from "@material-ui/icons/Add";
import {ContractData} from 'drizzle-react-components'

import {ipfs} from "../../store/ipfs/ipfs";
import ContractIPFS from '../ContractIPFS/ContractIPFS';
import RentingDialog from './RentingDialog/RentingDialog';
import AlertDialog from './AlertDialog/AlertDialog';
import './Renting.css';



class Renting extends Component {

    handleNew = () => {
        this.setState({
            action: 'new',
            dialogTitle: 'Create a new renting',
            openDialog: true,
            openAlertDialog: false
        });
    }

    addRentItem = (rentingItem) => {
        this.setState({openDialog: false});
        this.setState({openAlertDialog: false});

        if (rentingItem.imageBuffer != null) {
            // save the image to IPFS
            ipfs.files.add(rentingItem.imageBuffer, {pin: true}, (error, result) => {
                if (error) {
                    console.error(error)
                    return
                }

                console.log("Hash key: ", result[0].hash);

                this.rentingContract.methods.addRentItem.cacheSend(rentingItem.title, rentingItem.description, result[0].hash,
                    {
                        from: this.props.accounts[0],
                        gas: 500000
                    });
            })

        } else {
            this.rentingContract.methods.addRentItem.cacheSend(rentingItem.title, rentingItem.description, "",
                {
                    from: this.props.accounts[0],
                    gas: 500000
                });
        }
    }

    handleRemove = (itemId) => {
        this.rentingContract.methods.getTitle(this.props.accounts[0], itemId).call().then(function (title) {
            this.setState({
                dialogTitle: 'Remove the renting',
                title: title,
                itemId: itemId,
                openDialog: false,
                openAlertDialog: true
            });
        }.bind(this));
    }

    removeRentItem = (itemId) => {
        this.setState({openDialog: false});
        this.setState({openAlertDialog: false});

        this.rentingContract.methods.removeRentItem.cacheSend(itemId,
            {
                from: this.props.accounts[0],
                gas: 500000
            });
    }

    cancelDialog = () => {
        this.setState({openDialog: false});
        this.setState({openAlertDialog: false});
    }

    constructor(props, context) {
        super(props)

        this.state = {};

        this.web3 = context.drizzle.web3;
        this.rentingContract = context.drizzle.contracts.Renting;

        this.validRentingItemIDsKey = this.rentingContract.methods.getValidRentItemIDs.cacheCall(this.props.accounts[0]);
    }

    render() {
        let rentItems = [];

        if (this.validRentingItemIDsKey in this.props.Renting.getValidRentItemIDs) {
            const validRentItemIDs = this.props.Renting.getValidRentItemIDs[this.validRentingItemIDsKey].value;

            for (let i = 0; i < validRentItemIDs.length; i++) {
                const rentItemId = validRentItemIDs[i];

                const item = (
                    <Col xs={6} md={4} key={rentItemId} className="vertical-spacing">
                        <Card>
                            <ContractIPFS contract="Renting" method="getImageHash"
                                          methodArgs={[this.props.accounts[0], rentItemId]}/>

                            <CardBody>
                                <CardTitle>
                                    <ContractData contract="Renting" method="getTitle"
                                                  methodArgs={[this.props.accounts[0], rentItemId]} hideIndicator/>
                                </CardTitle>
                                <CardText>
                                    <ContractData contract="Renting" method="getDescription"
                                                  methodArgs={[this.props.accounts[0], rentItemId]} hideIndicator/>
                                </CardText>
                                <Button variant="contained"
                                        onClick={() => this.handleRemove(rentItemId)}>Remove</Button>

                                <Button variant="contained" className={'float-right'}
                                        onClick={() => this.handleRemove(rentItemId)}>Rent</Button>
                            </CardBody>
                        </Card>
                    </Col>);

                rentItems.push(item);
            }
        }

        return (
            <div>
                <Container>
                    <Jumbotron>
                        <h2>Welcome to ChainBnB</h2>
                        <p>This is an example of website developed in React and React Bootstrap</p>
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
                        {rentItems}
                    </Row>

                </Container>

                <RentingDialog
                    action={this.state.action}
                    open={this.state.openDialog}
                    dialogTitle={this.state.dialogTitle}
                    addRentItem={this.addRentItem.bind(this)}
                    cancelDialog={this.cancelDialog.bind(this)}/>

                <AlertDialog
                    open={this.state.openAlertDialog}
                    dialogTitle={this.state.dialogTitle}
                    title={this.state.title}
                    itemId={this.state.itemId}
                    removeRentItem={this.removeRentItem.bind(this)}
                    cancelDialog={this.cancelDialog.bind(this)}/>
            </div>
        );
    }
}


Renting.contextTypes = {
    drizzle: PropTypes.object
};

export default Renting;