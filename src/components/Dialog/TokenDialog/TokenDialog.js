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
    }
});

class TokenDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.type === this.props.type) {
            // component already opened
            return;
        }
    }

    // close the form
    handleClose = () => {
        this.props.cancel();
    }

    setTokens = (e) => {
        this.setState({
            tokens: e
        });
    };

    // send the action to buy or mint tokens
    sendAction = (event) => {
        this.props.action(this.state.tokens);
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

        // fetch styles from hoc withStyles
        const {classes} = this.props;

        return (
            <div>
                <Dialog
                    id={"tokendialog"}
                    open={(typeof this.props.open === 'undefined') ? false : this.props.open}
                    onClose={this.handleClose}
                    aria-labelledby="tokendialog-title"
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    fullWidth={true}
                    maxWidth={'md'}
                >

                    <DialogTitle id="tokendialog-title">{this.props.title}</DialogTitle>

                    <DialogContent>
                        <TextField
                            label="Rate (ETH)"
                            defaultValue={this.props.tokenRate}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                classes: {
                                    input: classes.textSettings,
                                },
                                readOnly: true
                            }}
                        />

                        {this.props.type === "buy" &&
                        <TextField
                            label="Depositum Token (DPN)"
                            type="number"
                            defaultValue={this.state.price}
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
                        }

                        {this.props.type === "mint" &&
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
                        }
                    </DialogContent>

                    <DialogActions>
                        <div>
                            <Button
                                color={"secondary"}
                                onClick={() => {
                                    this.handleClose();
                                }}>Cancel</Button>
                            <Button
                                color="primary"
                                focusRipple={true}
                                onClick={() => {
                                    this.sendAction();
                                }}>Send</Button>
                        </div>
                    </DialogActions>

                </Dialog>
            </div>
        );
    }
}


export default withStyles(styles)(TokenDialog);