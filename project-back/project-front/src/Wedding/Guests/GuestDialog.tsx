import { useEffect, useState } from 'react'
import { Guest } from './List'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormLabel, IconButton, MenuItem, Select } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const GuestDialog = (props: {
   guest: Guest | undefined,
   groups: string[]
   open: boolean,
   handleClose: (g: Guest) => void,
   handleCancel: () => void,
   handleCancelInvite: (id: number) => void
}) => {

   const [btnDisabled, setBtnDisabled] = useState(true)
   const [guest, setGuest] = useState<Guest | undefined>(props.guest)

   useEffect(() => {
      setGuest(props.guest)
   }, [props.guest])

   return (
      <Dialog
         fullWidth
         maxWidth={"xs"}
         open={props.open}
         onClose={props.handleCancel}
      >
         <DialogTitle className="d-flex justify-content-between align-items-center">
            {guest?.name} {guest?.lastname}
            <IconButton onClick={props.handleCancel}>
               <CloseIcon />
            </IconButton>
         </DialogTitle>
         <DialogContent id='detailsGuest' className='mx-3 whiteSpace-initial'>
            <FormControl sx={{ my: 1, minWidth: 120, display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }} size="small">
               <FormLabel sx={{ color: 'black' }} id="demo-simple-select-label">Grupo:</FormLabel>
               <Select
                  value={guest?.group || 'Sin asignar'}
                  onChange={(e) => {
                     setBtnDisabled(false)
                     const group = e.target.value === 'Sin asignar' ? undefined : e.target.value;
                     setGuest({ ...guest!, group })
                  }}
               >
                  <MenuItem value='Sin asignar'>Sin asignar</MenuItem>
                  {props.groups.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
               </Select>
            </FormControl>

            {(guest?.plusOne !== null || guest?.infoMenu !== null || guest?.suggestion !== null) && <Divider className='my-3' />}
            
            <div className='d-flex flex-column gap-4 max'>
               {guest?.plusOne !== null && (<div>
                  <div className='fw-bold'><PersonAddIcon /> Acompañante:</div>
                  <div> {guest?.plusOne}</div>
               </div>)}
               {guest?.infoMenu !== null && (<div>
                  <div className='fw-bold'><RestaurantMenuIcon /> Preferencias del menú:</div>
                  <div> {guest?.infoMenu}</div>
               </div>)}
               {guest?.suggestion !== null && (<div>
                  <div className='fw-bold'><EmojiObjectsIcon /> Sugerencias:</div>
                  <div>{guest?.suggestion}</div>
               </div>)}
            </div>
            
         </DialogContent>
         <DialogActions className="d-flex justify-content-evenly">
            <Button color="error" onClick={() => props.handleCancelInvite(guest!.id)}>Cancelar invitación</Button>
            <Button color="inherit" onClick={() => props.handleClose(guest!)} disabled={btnDisabled}>Guardar</Button>
         </DialogActions>
      </Dialog>
   )
}

export default GuestDialog