import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


class AlertDialog extends Component {
    constructor(props, context) {
        super(props)

        this.handleClose = this.handleClose.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.type === this.props.type) {
            // component already opened
            return;
        }
    }

    // closes all modals
    handleClose = () => {
        this.props.cancel();
    }

    render() {
        if ((typeof this.props.open === "undefined") || (this.props.open === false)) {
            // do not process this component if it's not required
            return null;
        }

        return (
            <div>
                <Dialog
                    id={"alertdialog"}
                    open={(typeof this.props.open === 'undefined') ? false : this.props.open}
                    onClose={this.handleClose}
                    aria-labelledby="alertdialog-title"
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}>

                    <DialogTitle id="alertdialog-title">{this.props.title}</DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            {this.props.message}
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            color="primary"
                            focusRipple={true}
                            onClick={() => {
                                this.handleClose();}}>
                            No
                        </Button>
                        <Button
                            color="secondary"
                            focusRipple={true}
                            onClick={() => {
                                this.props.action(this.props.assetId);}}>
                            Yes
                        </Button>
                    </DialogActions>

                </Dialog>
            </div>
        )
    }
}

export default AlertDialog;