import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {withStyles} from '@material-ui/core/styles';


const styles = theme => ({
    textSettings: {
        fontSize: 18,
        padding: 5,
        lineHeight: 1.5
    },
    formControl: {
        marginTop: theme.spacing.unit * 3,
    },
    inputFile: {
        display: 'none'
    }
});

class AssetDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            action: '',
            openAssetDialog: false,
            dialogTitle: '',
            assetId: '',
            name: '',
            description: '',
            imageBuffer: null,
            price: '',
            imageSource: '/images/asset.png',
            newImageSource: ''
        };

        this.handleClose = this.handleClose.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        if ((typeof nextProps.action === "undefined") || (nextProps.action === "")) {
            // do not process this component if it's not required
            return;
        }

        if (this.state.openAssetDialog) {
            // do not process this component if it's not required
            return;
        }

        let _imageSource = '/images/asset.png';
        if ((typeof nextProps.imageSource !== "undefined") && (nextProps.imageSource !== "")) {
            _imageSource = nextProps.imageSource;
        }

        this.setState({
            action: nextProps.action,
            openAssetDialog: nextProps.open,
            dialogTitle: nextProps.dialogTitle,
            assetId: nextProps.assetId,
            name: nextProps.name,
            description: nextProps.description,
            price: nextProps.price,
            imageSource: _imageSource
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.name !== this.props.name) {
            this.setState({name: this.props.name});
        }

        if (prevProps.description !== this.props.name) {
            this.setState({description: this.props.description});
        }

        if (prevProps.price !== this.props.price) {
            this.setState({price: this.props.price});
        }

        if (prevProps.imageSource !== this.props.imageSource) {
            let _imageSource = '/images/asset.png';
            if ((typeof this.props.imageSource !== "undefined") && (this.props.imageSource !== "")) {
                _imageSource = this.props.imageSource;
            }

            this.setState({imageSource: _imageSource});
        }
    }


    checkValidity = (title, description) => {
        if (title.trim() === '') {
            this.setState({nameError: true});
            return false;
        } else {
            this.setState({nameError: false});
        }

        if (description.trim() === '') {
            this.setState({descriptionError: true});
            return false;
        } else {
            this.setState({descriptionError: false});
        }

        return true;
    }


    // close the form
    handleClose = () => {
        this.resetState();
        this.props.cancelDialog();
    }

    setName = (e) => {
        this.setState({
            name: e,
            nameError: false
        })
    }

    setDescription = (e) => {
        this.setState({
            description: e,
            descriptionError: false
        })
    }

    setPrice = (e) => {
        this.setState({
            price: e
        });
    };

    // Add a new asset
    addAsset = (event) => {
        const {name, description, imageBuffer, price} = this.state;

        if (!this.checkValidity(name, description)) {
            return;
        }

        let asset = {name, description, imageBuffer, price};

        this.resetState();
        this.props.addAsset(asset);
    }

    // Update the asset
    updateAsset = (event) => {
        const {assetId, name, description, imageBuffer, newImageSource, price} = this.state;

        if (!this.checkValidity(name, description)) {
            return;
        }

        const ipfsHashKey = newImageSource;

        let asset = {assetId, name, description, imageBuffer, ipfsHashKey, price};

        this.resetState();
        this.props.updateAsset(asset);
    }


    // reset the component
    resetState = () => {
        this.setState({
            action: '',
            openAssetDialog: false,
            dialogTitle: '',
            assetId: '',
            name: '',
            description: '',
            imageBuffer: null,
            price: '',
            imageSource: '/images/asset.png',
            newImageSource: ''
        });
    }

    loadFile = (event) => {
        event.preventDefault();
        const selectedFile = event.target.files[0]
        const reader = new FileReader()

        reader.onloadend = () => {
            this.setState({imageBuffer: Buffer(reader.result)});

            const blob = new Blob([reader.result], {type: 'image/png'});
            let imageSource = URL.createObjectURL(blob);

            this.setState({newImageSource: imageSource});
        };

        reader.readAsArrayBuffer(selectedFile)
    }

    render() {
        if ((typeof this.props.type === "undefined") || (this.props.type === "")) {
            // do not process this component if it's not required
            return null;
        }

        if ((typeof this.props.open === "undefined") || (this.props.open === false)) {
            // do not process this component if it's not required
            return null;
        }

        const {classes} = this.props;

        // process image source
        let imageSourceNew = this.state.imageSource;
        if (this.state.newImageSource !== "") {
            imageSourceNew = this.state.newImageSource;
        }

        return (
            <div>
                <Dialog
                    id={"assetdialog"}
                    open={(typeof this.props.open === 'undefined') ? false : this.props.open}
                    onClose={this.handleClose}
                    aria-labelledby="assetdialog-title"
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    fullWidth={true}
                    maxWidth={'md'}
                >

                    <DialogTitle id="assetdialog-title">{this.props.title}</DialogTitle>

                    <DialogContent>

                        <Grid container>
                            <Grid item xs={4} container direction="column" spacing={16} alignItems="center" justify="center">
                                <Grid item>
                                    <img className={classes.img} style={{width: '250px'}} alt="asset"
                                         src={`${imageSourceNew}`}/>
                                </Grid>
                                {this.state.type !== "read" &&
                                <Grid item>
                                    <input type='file' className={classes.inputFile} onChange={this.loadFile} accept="image/*" ref={'file-upload'} />
                                    <Button
                                        label="Upload"
                                        variant="outlined"
                                        color={"primary"}
                                        onClick={e => {
                                            this.refs['file-upload'].click()
                                        }}>Add a picture ...</Button>
                                </Grid>
                                }
                            </Grid>
                            <Grid item xs={8} container direction="column" spacing={16}>

                                <TextField
                                    label="Name"
                                    defaultValue={this.state.name}
                                    fullWidth
                                    error={this.state.nameError}
                                    onChange={e => {
                                        this.setName(e.target.value)
                                    }}
                                    margin="normal"
                                    InputProps={{
                                        classes: {
                                            input: classes.textSettings,
                                        },
                                        readOnly: this.props.type === "read" ? true : false
                                    }}
                                />

                                <TextField
                                    label="Description"
                                    defaultValue={this.state.description}
                                    fullWidth
                                    error={this.state.descriptionError}
                                    multiline
                                    rows="2"
                                    onChange={e => {
                                        this.setDescription(e.target.value)
                                    }}
                                    margin="normal"
                                    InputProps={{
                                        classes: {
                                            input: classes.textSettings,
                                        },
                                        readOnly: this.props.type === "read" ? true : false
                                    }}
                                />

                                <TextField
                                    label="Price (ETH)"
                                    type="number"
                                    defaultValue={this.state.price}
                                    fullWidth
                                    onChange={e => {
                                        this.setPrice(e.target.value)
                                    }}
                                    margin="normal"
                                    inputProps={{
                                        classes: {
                                            input: classes.textSettings,
                                        },
                                        step: 0.01,
                                        min: 0,
                                        readOnly: this.props.type === "read" ? true : false
                                    }}
                                />
                            </Grid>
                        </Grid>


                    </DialogContent>

                    <DialogActions>
                        {this.state.type === "read" &&
                        <div>
                            <Button
                                label="Close"
                                color={"secondary"}
                                onClick={() => {
                                    this.handleClose();
                                    this.props.cancelDialog();
                                }}>Close</Button>
                        </div>
                        }

                        {this.state.type === "new" &&
                        <div>
                            <Button
                                label="Cancel"
                                color={"secondary"}
                                onClick={() => {
                                    this.handleClose();
                                    this.props.cancelDialog();
                                }}>Cancel</Button>
                            <Button
                                label="Save"
                                color="primary"
                                focusRipple={true}
                                onClick={() => {
                                    this.addAsset();
                                }}>Save</Button>
                        </div>
                        }

                        {this.state.type === "edit" &&
                        <div>
                            <Button
                                label="Cancel"
                                color={"secondary"}
                                onClick={() => {
                                    this.handleClose();
                                }}>Cancel</Button>
                            <Button
                                label="Save"
                                color="primary"
                                focusRipple={true}
                                onClick={() => {
                                    this.updateAsset();
                                }}>Save</Button>
                        </div>
                        }
                    </DialogActions>

                </Dialog>
            </div>
        );
    }
}


export default withStyles(styles)(AssetDialog);