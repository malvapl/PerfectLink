import ListGuests from './ListGuests'
import SpaceTables, { IGuest, ITable } from './SpaceTables'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ControlPanel from './ControlPanel';
import Message from '../../Message';
import DialogTable from './DialogTable';
import { Box, Popover, Typography } from '@mui/material';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { useApi } from '../../hooks/useApi';

export interface DialogEditProps {
   open: boolean;
   handleClose: (table: ITable) => void;
   handleCancel: () => void;
   table: ITable;
}

export interface IPopoverSeat {
   guest: IGuest | undefined;
   position: { x: number, y: number }; // absolute
   open: boolean;
   plusOne?: string | null
}


const AppTables = () => {

   const api = useApi();
   const [loading, setLoading] = useState<boolean>(false);
   const [showAlert, setShowAlert] = useState(false);
   const [alertVariant, setAlertVariant] = useState<'error' | 'info' | 'success' | 'warning'>('info');
   const [alertMessage, setAlertMessage] = useState('');

   const [guests, setGuests] = useState<IGuest[]>([])
   const [groups, setGroups] = useState<string[]>([])
   const [tables, setTables] = useState<ITable[]>([])
   const { id } = useParams()
   const navigate = useNavigate()

   useEffect(() => {
      setLoading(true);

      api.get(`userRole/${id}`)
         .then((result) => {
            if (result.data !== 'organizer' && result.data !== 'admin') { 
               navigate('/')
            }
         })
         .catch((error) => {
            console.error(error)
         })

      api.get(`guestsNotSeated/${id}`)
         .then((result) => {
            setGuests(result.data.map((g: { id: number, name: string, plusOne: string, group: string, }) => ({ ...g, numSeat: -1 })))
         })
         .catch((error) => {
            console.error('Users not found:' + error)
            setLoading(false)
         })

      api.get(`guestGroups/${id}`)
         .then((result) => {
            setGroups([...result.data, 'Sin asignar'])
         })
         .catch((error) => {
            console.error('Groups not found: ' + error)
            setLoading(false)
         })

      api.get(`tables/${id}`)
         .then((result) => {
            setTables(result.data)
            setLoading(false)
         })
         .catch((error) => {
            console.error('Mesas no encontradas: ' + error)
            setLoading(false)
         })
   }, [id, navigate])

   const handleSave = async () => {
      tables.forEach(table => {
         api.patch(`updateTables/${table.id}`, table)
            .then((result) => {
               setAlertMessage('Datos actualizados')
               setAlertVariant('success')
               setShowAlert(true)
            })
            .catch((error) => {
               setShowAlert(true);
               setAlertMessage('No se ha podido actualizar: ' + error)
               setAlertVariant('error')
            })
      })
   }

   const handleSaveNewTable = async (table: ITable) => {
      api.post(`tables/${id}`, table)
         .then((result) => {
            setTables([...tables, { ...result.data, guests: [] }])
            setAlertMessage('Mesa creada')
            setAlertVariant('success')
            setShowAlert(true)
         })
         .catch((error) => {
            setShowAlert(true);
            setAlertMessage('No se ha podido crear la mesa: ' + error)
            setAlertVariant('error')
         })
   }

   const deleteTable = async (table: ITable) => {
      api.delete(`tables/${id}/${table.id}`)
         .then((result) => {
            if (result.success) {
               setTables(tables.filter(t => t.id !== table.id))
               setGuests([...guests, ...table.guests]) // TODO fix
               setAlertMessage('Mesa eliminada')
               setAlertVariant('success')
               setShowAlert(true)
            }
         })
         .catch((error) => {
            setShowAlert(true);
            setAlertMessage('No se ha podido eliminar la mesa: ' + error)
            setAlertVariant('error')
         })
   }

   const editTable = (table: ITable) => {
      setTableDialog(table)
      setOpenDialog(true)
   }

   const handleAddTable = () => {
      setOpenDialog(true)
   }

   const updateTable = (updatedTable: ITable) => {
      if (updatedTable.id === -1) {
         handleSaveNewTable(updatedTable)
      } else {
         const filteredGuests = updatedTable.guests.filter(g => g.id !== -1)
         setTables(tables.map(table => {
            if (table.id === updatedTable.id) {
               return { ...updatedTable, guests: filteredGuests }
            }
            return table
         }))
      }
   };

   const [openDialog, setOpenDialog] = useState(false)
   const [tableDialog, setTableDialog] = useState<ITable | undefined>(undefined)

   const handleClose = (table: ITable, newDeletedSeats: IGuest[] | undefined) => {
      updateTable(table)
      setOpenDialog(false);
      if (newDeletedSeats) {
         setGuests([...guests, ...newDeletedSeats])
      }
      setTableDialog(undefined);
   }

   const [popoverSeat, setPopoverSeat] = useState<IPopoverSeat>({
      guest: undefined,
      position: { x: 0, y: 0 },
      open: false,
      plusOne: null
   })

   const showSeat = (data: IPopoverSeat) => {
      setPopoverSeat(data)
   }

   const [guest, setGuest] = useState<IGuest | undefined>(undefined)

   const handlePlaceGuest = (newGuest: IGuest) => {
      if (guest !== undefined) {
         setAlertMessage('Elige un sitio para ' + guest.name + ' o devuélvelo a la lista haciendo doble click')
         setAlertVariant('info')
         setShowAlert(true)
         setInterval(() => {
            setShowAlert(false)
         }, 10000)
         return;
      }
      setGuests(guests.filter(g => g.name !== newGuest.name))
      setGuest(newGuest)
   }

   const returnGuest = () => {
      setGuests([...guests, guest!])
      setGuest(undefined)
   }

   const checkOverTables = (position: { x: number, y: number }, newGuest: IGuest, onlyCheck?: boolean): number => {
      tables.forEach(table => {
         const distance = Math.sqrt(
            Math.pow(position.x - table.pos_x, 2) + Math.pow(position.y - table.pos_y, 2)
         );
         if (distance < 100) {
            if (onlyCheck) {
               return table.id;
            }
            if (newGuest.plusOne === null) {
               const seat = findSeat(table)
               if (seat !== -1) {
                  setGuest(undefined)
                  updateTable({ ...table, guests: [...table.guests, { ...newGuest, numSeat: seat, isPlusOne: false }] })
               } else {
                  setAlertMessage('No hay asientos disponibles en esta mesa')
                  setAlertVariant('error')
                  setShowAlert(true)
               }
            } else {
               const bothSeats = findTwoSeats(table)
               if (bothSeats[0] !== -1) {
                  const newGuests = [
                     { ...newGuest, numSeat: bothSeats[0], isPlusOne: false },
                     { ...newGuest, numSeat: bothSeats[1], name: '(+1) ' + newGuest.plusOne, plusOne: null, isPlusOne: true }
                  ];
                  setGuest(undefined)
                  updateTable({ ...table, guests: [...table.guests, ...newGuests] })
               } else {
                  setAlertMessage('No hay asientos disponibles en esta mesa')
                  setAlertVariant('error')
                  setShowAlert(true)
               }
            }
         }
      });
      return -1;
   }

   const findSeat = (table: ITable): number => {
      if (table.guests.length === table.maxChairs) return -1;
      for (let i = 0; i < table.maxChairs; i++) {
         if (!table.guests.some(g => g.numSeat === i)) {
            return i
         }
      }
      return -1;
   }

   const findTwoSeats = (table: ITable): number[] => {
      if (table.guests.filter(g => g.name !== '').length >= table.maxChairs - 1) return [-1, -1]
      const emptySeats = [];
      for (let i = 0; i < table.maxChairs; i++) {
         if (!table.guests.some(g => g.numSeat === i)) {
            emptySeats.push(i)
         }
      }
      for (let i = 0; i < emptySeats.length; i++) {
         if (emptySeats[i + 1] === emptySeats[i] + 1 || (emptySeats[i] === table.maxChairs - 1 && emptySeats[i + 1] === 0))
            return [emptySeats[i], emptySeats[i + 1]]
      }
      return [emptySeats[0], emptySeats[1]];
   }

   return (
      <Box id='containerTables'>
         {loading ? (
            <PropagateLoader
               color={'grey'}
               loading={true}
               cssOverride={{ display: 'flex', marginTop: '30%', justifyContent: 'center' }}
               size={30}
            />
         ) : (<>
            <Message showAlert={showAlert} color={alertVariant} message={alertMessage}
               setShowAlert={setShowAlert}
            />

            <ListGuests
               guests={guests}
               groups={groups}
               handlePlaceGuest={handlePlaceGuest}
            />
            <SpaceTables
               tables={tables}
               guest={guest}
               returnGuest={returnGuest}
               checkOverTables={checkOverTables}
               updateTable={updateTable}
               editTable={editTable}
               showSeat={showSeat}
            />
            <ControlPanel
               handleSave={handleSave}
               handleAddTable={handleAddTable}
            />

            <DialogTable
               open={openDialog}
               table={tableDialog}
               handleClose={handleClose}
               handleCancel={() => {
                  setTableDialog(undefined);
                  setOpenDialog(false)
               }}
               handleDelete={() => {
                  deleteTable(tableDialog!)
                  setTableDialog(undefined);
                  setOpenDialog(false)
               }}
            />

            {
               popoverSeat.guest !== undefined &&
               <Popover
                  anchorReference="anchorPosition"
                  sx={{
                     pointerEvents: 'none',
                  }}
                  open={popoverSeat.open}
                  anchorPosition={{
                     left: popoverSeat.position.x,
                     top: popoverSeat.position.y
                  }}
                  transformOrigin={{
                     vertical: 'top',
                     horizontal: 'center',
                  }}
                  anchorEl={null}
                  onClose={() => setPopoverSeat({ ...popoverSeat, open: false })}
                  disableRestoreFocus
               >
                  <Typography sx={{ px: 1 }}>{popoverSeat.guest.name}</Typography>
                  {popoverSeat.plusOne &&
                     <Typography sx={{ px: 1, color: 'grey', textAlign: "center" }}> + {popoverSeat.plusOne}</Typography>
                  }
               </Popover>
            }
         </>)}
      </Box>
   )
}

export default AppTables