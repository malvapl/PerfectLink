import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Button, Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { IGuest, ITable } from "./SpaceTables";
import DeleteIcon from '@mui/icons-material/Delete';
import '../../styles.css';
import ConfirmationDialog from "../../ConfirmationDialog";

const DialogTable = (props: {
   table: ITable | undefined,
   open: boolean,
   handleClose: (d: ITable, deletedSeats: IGuest[] | undefined) => void,
   handleCancel: () => void
   handleDelete: (t: ITable) => void
}) => {

   const [openConfirmation, setOpenConfirmation] = useState(false)

   const [btnDisabled, setBtnDisabled] = useState(true);
   const [name, setName] = useState(props.table?.name || '')
   const [maxChairs, setMaxChairs] = useState(props.table?.maxChairs || 5)
   const [seats, setSeats] = useState<IGuest[]>([])
   const [deletedSeats, setDeletedSeats] = useState<IGuest[] | undefined>(undefined)
   const [idMarked, setIdMarked] = useState(-1)

   useEffect(() => {
      setBtnDisabled(true)
      setDeletedSeats(undefined)
      setName(props.table?.name || '')
      setMaxChairs(props.table?.maxChairs || 5)
      setSeats([])
      console.log(props.table?.guests)

      if (props.table) {
         const seats: IGuest[] = [];
         for (let i = 0; i < props.table.maxChairs; i++) {
            seats.push({
               id: -1,
               name: '',
               numSeat: i,
               plusOne: '',
               group: '',
               isPlusOne: false
            })
         }
         props.table.guests.forEach(guest => {
            seats[guest.numSeat] = guest;
         });
         setSeats(seats)
      }

   }, [props.table, props.open]);

   const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const id = props.table?.id || -1;
      const pos_x = props.table?.pos_x || 500;
      const pos_y = props.table?.pos_y || 500;
      props.handleClose({ id: id, name, maxChairs, guests: seats, pos_x, pos_y }, deletedSeats);
   }

   const onDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
      event.dataTransfer.setData("index", index.toString());
   }

   const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
   }

   const onDrop = (event: React.DragEvent<HTMLDivElement>, index: number) => {
      const draggedIndex = event.dataTransfer.getData("index");
      const draggedIndexNumber = parseInt(draggedIndex);

      const tempSeats = [...seats];

      const [removed] = tempSeats.splice(draggedIndexNumber, 1);
      tempSeats.splice(index, 0, removed);

      tempSeats.forEach((seat, i) => {
         seat.numSeat = i;
      });

      setSeats(tempSeats);
      setBtnDisabled(false)
   }

   const removeGuest = (seat: IGuest) => {
      setSeats(seats.map(s => s.id === seat.id ? { id: -1, name: '', numSeat: s.numSeat, plusOne: '', group: '', isPlusOne: false } : s));
      setDeletedSeats(deletedSeats ? [...deletedSeats, seat] : [seat]);
      setBtnDisabled(false)
   }

   const handleDeleteTable = () => {
      setOpenConfirmation(true)
   }

   return (<>
      <Dialog
         fullWidth
         maxWidth={"xs"}
         open={props.open}
         onClose={props.handleCancel}
      >
         <DialogTitle className="d-flex justify-content-between align-items-center">
            {props.table ? 'Editar mesa' : 'Nueva mesa'}
            <IconButton onClick={props.handleCancel}>
               <CloseIcon />
            </IconButton>
         </DialogTitle>
         <form onSubmit={handleApply}>
            <DialogContent>
               <TextField
                  onChange={(e) => {
                     setName(e.currentTarget.value)
                     setBtnDisabled(false)
                  }}
                  className="mb-3"
                  value={name}
                  autoFocus={true}
                  required
                  margin="dense"
                  label="Nombre"
                  fullWidth
                  variant="standard"
               />
               <TextField
                  type="number"
                  InputProps={{
                     inputProps: {
                        max: 15,
                        min: 5,
                     }
                  }}
                  onChange={(e) => {
                     setMaxChairs(parseInt(e.currentTarget.value))
                     setBtnDisabled(false)
                  }}
                  className="mb-3"
                  value={maxChairs}
                  required
                  margin="dense"
                  label="Número de sillas"
                  fullWidth
                  variant="standard"
               />

               {props.table &&
                  <div id="contentTableSeats">
                     {seats.map((seat, index) => (
                        <div
                           onMouseEnter={() => {
                              if (seat.plusOne !== '') setIdMarked(seat.id)
                           }}
                           onMouseLeave={() => {
                              if (seat.plusOne !== '') setIdMarked(-1)
                           }}
                           draggable
                           key={index}
                           className={seat.name === '' ? 'tableSeat tableSeatEmpty' :
                              (idMarked === seat.id ? 'tableSeat tableSeatGuest tableSeatGuestMarked' : 'tableSeat tableSeatGuest')}
                           onDragStart={(e) => onDragStart(e, index)}
                           onDragOver={onDragOver}
                           onDrop={(e) => onDrop(e, index)}
                        >
                           <p className="p-0 m-0">
                              {seat.name !== '' ? seat.name : 'Asiento vacío'}
                           </p>
                           {seat.name !== '' && !seat.isPlusOne &&
                              <Tooltip title="Eliminar" placement="right">
                                 <IconButton className="py-0" onClick={() => removeGuest(seat)}><DeleteIcon fontSize="small" /></IconButton>
                              </Tooltip>
                           }
                        </div>

                     ))}
                  </div>
               }
            </DialogContent>
            <DialogActions className="d-flex justify-content-evenly">
               {props.table &&
                  <Button color="error" onClick={() => handleDeleteTable()}>Eliminar mesa</Button>
               }
               <Button color="inherit" type="submit" disabled={btnDisabled}>{props.table ? 'Aplicar' : 'Añadir'}</Button>
            </DialogActions>
         </form>
      </Dialog >
      <ConfirmationDialog
         open={openConfirmation}
         handleAccept={() => {
            props.handleDelete(props.table!)
            setOpenConfirmation(false)
         }}
         handleRefuse={() => setOpenConfirmation(false)}
         title="¿Estás seguro de que quieres eliminar esta mesa?"
      />
   </>)
}

export default DialogTable;
