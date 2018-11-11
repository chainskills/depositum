import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


class AlertDialog extends Component {
    constructor() {
        super()

        this.state = {
            openDialog: false,
            dialogTitle: '',
            message: '',
            asset: null
        }
        this.handleClose = this.handleClose.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            dialogTitle: nextProps.dialogTitle,
            openDialog: nextProps.open,
            message: nextProps.message,
            assetId: nextProps.assetId
        });
    }


    // closes all modals
    handleClose = () => {
        this.setState({openDialog: false});
    }

    render() {
        return (
            <div>
                <Dialog
                    id={"alertdialog"}
                    open={(typeof this.state.openDialog === 'undefined') ? false : this.state.openDialog}
                    onClose={this.handleClose}
                    aria-labelledby="alertdialog-title"
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}>

                    <DialogTitle id="alertdialog-title">{this.state.dialogTitle}</DialogTitle>

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
                                this.handleClose();
                                this.props.cancelDialog();}}>
                            No
                        </Button>
                        <Button
                            color="secondary"
                            focusRipple={true}
                            onClick={() => {
                                this.props.action(this.state.assetId);}}>
                            Yes
                        </Button>
                    </DialogActions>

                </Dialog>
            </div>
        )
    }
}

export default AlertDialog;