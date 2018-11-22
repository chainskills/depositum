import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
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
            name: '',
            description: '',
            imageBuffer: null,
            price: '',
            imageSource: '/images/asset.png',
            newImageSource: '',
            encrypted: false,
        };

        this.handleClose = this.handleClose.bind(this);
    }


    static getDerivedStateFromProps(nextProps, prevState) {

        if (typeof nextProps.type === "undefined") {
            // not ready yet
            return null;
        }

        if (nextProps.type === prevState.type) {
            // fields already updated or nothing to can
            return null;
        }

        // pre-fill the state only the first time
        return ({
            type: nextProps.type,
            assetId: nextProps.assetId,
            name: nextProps.name,
            description: nextProps.description,
            price: nextProps.price,
            imageSource: nextProps.imageSource !== "" ? nextProps.imageSource : '/images/asset.png',
            encrypted: nextProps.encrypted
        });
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
        this.props.cancel();
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

    encryptFile = (e) => {
        this.setState({
            encrypted: e.target.checked
        });
    };

    // save the asset
    saveAsset = (event) => {
        const {assetId, name, description, imageBuffer, newImageSource, price, encrypted} = this.state;

        if (!this.checkValidity(name, description)) {
            return;
        }

        const ipfsHashKey = newImageSource;

        let asset = {assetId, name, description, imageBuffer, ipfsHashKey, price, encrypted};

        this.resetState();
        this.props.action(asset);
    }


    // reset the component
    resetState = () => {
        this.setState({});
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

        //console.log(this.state);

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
                            <Grid item xs={4} container direction="column" spacing={16} alignItems="center"
                                  justify="center">
                                <Grid item>
                                    <img className={classes.img} style={{width: '250px'}} alt="asset"
                                         src={`${imageSourceNew}`}/>
                                </Grid>
                                {this.props.type !== "read" &&
                                <Grid item>
                                    <input type='file' className={classes.inputFile} onChange={this.loadFile}
                                           accept="image/*" ref={'file-upload'}/>
                                    <Button
                                        label="Upload"
                                        variant="outlined"
                                        color={"primary"}
                                        onClick={e => {
                                            this.refs['file-upload'].click()
                                        }}>Add a picture ...</Button>

                                    {((this.props.type === "new") || (this.state.imageBuffer !== null)) &&
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={this.state.encrypted}
                                                    onChange={this.encryptFile}
                                                />
                                            }
                                            label="Encrypt"
                                        />
                                    </FormGroup>
                                    }
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
                        {this.props.type === "read" &&
                        <div>
                            <Button
                                label="Close"
                                color={"secondary"}
                                onClick={() => {
                                    this.handleClose();
                                    this.props.cancel();
                                }}>Close</Button>
                        </div>
                        }

                        {this.props.type === "new" &&
                        <div>
                            <Button
                                label="Cancel"
                                color={"secondary"}
                                onClick={() => {
                                    this.handleClose();
                                    this.props.cancel();
                                }}>Cancel</Button>
                            <Button
                                label="Save"
                                color="primary"
                                focusRipple={true}
                                onClick={() => {
                                    this.saveAsset();
                                }}>Save</Button>
                        </div>
                        }

                        {this.props.type === "edit" &&
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
                                    this.saveAsset();
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