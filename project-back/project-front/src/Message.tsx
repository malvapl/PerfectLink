import { Alert, Snackbar } from "@mui/material";

const Message = (props: {
    showAlert: boolean, color: (
        'error'
        | 'info'
        | 'success'
        | 'warning'),
    message: string
    setShowAlert: (b: boolean) => void
}) => {

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={props.showAlert}
            autoHideDuration={2000}
            onClose={() => props.setShowAlert(false)}
        >
            {/* icon={<CheckIcon fontSize="inherit" />} */}
            <Alert
                variant='filled'
                color={props.color}
                onClose={() => props.setShowAlert(false)}
                className="mt-2"
            >
                {props.message}
            </Alert>
        </Snackbar>
    )
}

export default Message