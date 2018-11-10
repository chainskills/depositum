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
    }
});

class RentingDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            action: '',
            openDialog: false,
            dialogTitle: '',
            title: '',
            description: '',
            imageBuffer: null,
            imageSource: 'assets/house.png'
        };

        this.handleClose = this.handleClose.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            action: nextProps.action,
            openDialog: nextProps.open,
            dialogTitle: nextProps.dialogTitle
        });
    }

    checkValidity = (title, description) => {
        if (title.trim() === '') {
            this.setState({titleError: true});
            return false;
        } else {
            this.setState({titleError: false});
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
        this.setState({openDialog: false});
    }

    setTitle = (e) => {
        this.setState({
            title: e,
            titleError: false
        })
    }

    setDescription = (e) => {
        this.setState({
            description: e,
            descriptionError: false
        })
    }

    // Add a new rent item
    addRentItem = (event) => {
        const {title, description, imageBuffer} = this.state;

        if (!this.checkValidity(title, description)) {
            return;
        }

        let rentItem = {title, description, imageBuffer};
        this.props.addRentItem(rentItem);
    }

    loadFile = (event) => {
        event.preventDefault();
        const selectedFile = event.target.files[0]
        const reader = new FileReader()

        reader.onloadend = () => {
            this.setState({ imageBuffer: Buffer(reader.result)});

            const blob = new Blob([reader.result], {type: 'image/png'});
            let imageSource = URL.createObjectURL(blob);

            this.setState({ imageSource: imageSource});
        };

        //reader.readAsDataURL(selectedFile);
        reader.readAsArrayBuffer(selectedFile)

        /*
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({ imageFile: Buffer(reader.result) })
            console.log('buffer', this.state.imageFile)
        }
        */
    }


    render() {
        const {classes} = this.props;

        return (
            <div>
                <Dialog
                    id={"rentingdialog"}
                    open={(typeof this.state.openDialog === 'undefined') ? false : this.state.openDialog}
                    onClose={this.handleClose}
                    aria-labelledby="rentingdialog-title"
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    fullWidth={true}
                    maxWidth={'md'}
                >

                    <DialogTitle id="rentingdialog-title">{this.state.dialogTitle}</DialogTitle>

                    <DialogContent>

                        <Grid container>
                            <Grid item xs={4} container direction="column" spacing={16}>
                                <Grid item>
                                    <img className={classes.img} style={{width: '250px'}} alt="renting"
                                         src={`${this.state.imageSource}`}/>
                                </Grid>
                                <Grid item>
                                    <input type='file' onChange={this.loadFile}/>
                                </Grid>
                            </Grid>
                            <Grid item xs={8} container direction="column" spacing={16}>
                                <TextField
                                    label="Title"
                                    defaultValue={this.state.title}
                                    fullWidth
                                    error={this.state.titleError}
                                    onChange={e => {
                                        this.setTitle(e.target.value)
                                    }}
                                    margin="normal"
                                    InputProps={{
                                        classes: {
                                            input: classes.textSettings,
                                        },
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
                                    }}
                                />
                            </Grid>
                        </Grid>


                    </DialogContent>

                    <DialogActions>
                        {this.state.action !== "new" &&
                        <div>
                            <Button
                                label="Cancel"
                                color={"secondary"}
                                onClick={() => {
                                    this.handleClose();
                                    this.props.cancelDialog();
                                }}>Cancel</Button>
                        </div>
                        }

                        {this.state.action === "new" &&
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
                                    this.addRentItem();
                                }}>Save</Button>
                        </div>
                        }
                    </DialogActions>

                </Dialog>
            </div>
        );
    }
}


export default withStyles(styles)(RentingDialog);