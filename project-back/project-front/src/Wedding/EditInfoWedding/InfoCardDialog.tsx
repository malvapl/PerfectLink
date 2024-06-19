import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { Button } from "react-bootstrap";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";

const InfoCardDialog = (props: { open: boolean, handleClose: (d: { title: string, description: string }) => void, handleCancel: () => void }) => {

   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')
   const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setTitle('')
      setDescription('')
      props.handleClose({ title: title, description: description })
   }

   return (
      <Dialog
         fullWidth
         maxWidth={"xs"}
         open={props.open}
         onClose={props.handleCancel}
      >
         <DialogTitle className="d-flex justify-content-between align-items-center">
            Nueva tarjeta
            <IconButton onClick={props.handleCancel}>
               <CloseIcon />
            </IconButton>
         </DialogTitle>
         <form onSubmit={handleAdd}>
            <DialogContent>
               <TextField
                  onChange={(e) => setTitle(e.currentTarget.value)}
                  className="mb-3"
                  value={title}
                  autoFocus={true}
                  required
                  margin="dense"
                  label="Título"
                  fullWidth
                  variant="standard"
               />
               <textarea value={description} required rows={3} placeholder="Mensaje..."
                  onChange={(e) => setDescription(e.currentTarget.value)}></textarea>
            </DialogContent>
            <DialogActions>
               <Button variant='secondary' type="submit">Añadir</Button>
            </DialogActions>
         </form>
      </Dialog>
   )
}

export default InfoCardDialog