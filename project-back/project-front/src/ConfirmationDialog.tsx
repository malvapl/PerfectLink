import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Button, Typography } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';

const ConfirmationDialog = (props: {
   open: boolean;
   handleAccept: () => void,
   handleRefuse: () => void
   title: string
   message?: string
}) => {
   return (
      <Dialog
         fullWidth
         maxWidth={"xs"}
         open={props.open}
         onClose={props.handleRefuse}
      >
         <DialogTitle className="d-flex justify-content-between align-items-center mb-4">
            Confirmación
            <IconButton onClick={props.handleRefuse}>
               <CloseIcon />
            </IconButton>
         </DialogTitle>
         <DialogContent>
            <Typography fontSize={20}><WarningAmberIcon color="warning" /> {props.title}</Typography>
            <Typography fontSize={15}>{props.message}</Typography>
         </DialogContent>
         <DialogActions className="d-flex m-4">
            <Button color="inherit" variant="contained" onClick={() => props.handleRefuse()}>No</Button>
            <Button color="secondary" variant="contained" onClick={() => props.handleAccept()}>Sí</Button>
         </DialogActions>
      </Dialog >
   )
}
export default ConfirmationDialog
