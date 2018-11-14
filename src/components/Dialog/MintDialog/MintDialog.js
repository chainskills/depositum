import React, {Component} from 'react';
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
    }
});

class MintDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            action: '',
            openTokenDialog: false,
            dialogTitle: ''
        };

        this.handleClose = this.handleClose.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        if ((typeof nextProps.action === "undefined") || (nextProps.action === "")) {
            // do not process this component if it's not required
            return;
        }

        if (this.state.openTokenDialog) {
            // do not process this component if it's not required
            return;
        }

        this.setState({
            action: nextProps.action,
            openTokenDialog: nextProps.open,
            dialogTitle: nextProps.dialogTitle,
            tokenRate: nextProps.tokenRate
        });
    }

    // close the form
    handleClose = () => {
        this.resetState();
        this.props.cancelDialog();
    }

    setTokens = (e) => {
        this.setState({
            tokens: e
        });
    };

    // mint tokens
    mintTokens = (event) => {
        this.resetState();
        this.props.mintTokens(this.state.tokens);
    }

    // reset the component
    resetState = () => {
        this.setState({
            action: '',
            openTokenDialog: false,
            dialogTitle: ''
        });
    }


    render() {
        if ((typeof this.state.action === "undefined" || this.state.action === "")) {
            // do not render if it's not required
            return null;
        }
        const {classes} = this.props;

        return (
            <div>
                <Dialog
                    id={"mintdialog"}
                    open={(typeof this.state.openTokenDialog === 'undefined') ? false : this.state.openTokenDialog}
                    onClose={this.handleClose}
                    aria-labelledby="mintdialog-title"
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    fullWidth={true}
                    maxWidth={'md'}
                >

                    <DialogTitle id="mintdialog-title">{this.state.dialogTitle}</DialogTitle>

                    <DialogContent>
                        <TextField
                            label="Number of Depositum Token (DPN) to mint"
                            type="number"
                            defaultValue={this.state.mint}
                            fullWidth
                            onChange={e => {
                                this.setTokens(e.target.value)
                            }}
                            margin="normal"
                            inputProps={{
                                classes: {
                                    input: classes.textSettings,
                                },
                                step: 1,
                                min: 0
                            }}
                        />


                    </DialogContent>

                    <DialogActions>
                        <div>
                            <Button
                                label="Cancel"
                                color={"secondary"}
                                onClick={() => {
                                    this.handleClose();
                                }}>Cancel</Button>
                            <Button
                                label="Mint"
                                color="primary"
                                focusRipple={true}
                                onClick={() => {
                                    this.mintTokens();
                                }}>Mint</Button>
                        </div>
                    </DialogActions>

                </Dialog>
            </div>
        );
    }
}


export default withStyles(styles)(MintDialog);