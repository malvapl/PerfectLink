import ListGuests from "./ListGuests"
import SpaceTables, { IGuest, ITable } from "./SpaceTables"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ControlPanel from "./ControlPanel";
import Message from "../../Message";
import DialogTable from "./DialogTable";
import { Box, Popover, Typography } from "@mui/material";
import PropagateLoader from "react-spinners/PropagateLoader";

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
   const [loading, setLoading] = useState<boolean>(false);
   const [showAlert, setShowAlert] = useState(false);
   const [alertVariant, setAlertVariant] = useState<"error" | "info" | "success" | "warning">("info");
   const [alertMessage, setAlertMessage] = useState("");

   const [guests, setGuests] = useState<IGuest[]>([])
   const [groups, setGroups] = useState<string[]>([])
   const [tables, setTables] = useState<ITable[]>([])
   const { id } = useParams()
   const navigate = useNavigate()

   useEffect(() => {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
         method: "GET",
         headers: myHeaders,
         redirect: "follow"
      }
      fetch(`${import.meta.env.VITE_HOST}userRole/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            console.log(result.response)
            if (result.response !== 'organizer' && !result.admin) navigate('/')
         })
         .catch((error) => {
            console.log(error)
         })
      fetch(`${import.meta.env.VITE_HOST}guestsNotSeated/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            // console.log(result.data)
            setGuests(result.data.map((g: { id: number, name: string, plusOne: string, group: string, }) => ({ ...g, numSeat: -1 })))
         })
         .catch(() => {
            console.log('error: guests not found')
            setLoading(false)
         })

      fetch(`${import.meta.env.VITE_HOST}guestGroups/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            setGroups([...result, 'Sin asignar'])
         })
         .catch(() => {
            console.log('error: groups not found')
            setLoading(false)
         })

      fetch(`${import.meta.env.VITE_HOST}tables/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            setTables(result.data)
            setLoading(false)
         })
         .catch(() => {
            console.log('error: boda no encontrada')
            setLoading(false)
         })
   }, [id, navigate])

   const handleSave = async () => {
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      tables.forEach(table => {
         const raw = JSON.stringify(table);

         const requestOptions: RequestInit = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
         }
         fetch(`${import.meta.env.VITE_HOST}updateTables/${table.id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
               console.log(result)
               setAlertMessage('Datos actualizados')
               setAlertVariant('success')
               setShowAlert(true)
            })
            .catch((error) => {
               console.log('error', error)
               setShowAlert(true);
               setAlertMessage('No se ha podido actualizar')
               setAlertVariant('error')
            })
      })
   }

   const handleSaveNewTable = async (table: ITable) => {
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify(table);
      const requestOptions: RequestInit = {
         method: "POST",
         headers: myHeaders,
         body: raw,
         redirect: "follow"
      }
      fetch(`${import.meta.env.VITE_HOST}tables/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            console.log(result.data)
            setTables([...tables, { ...result.data, guests: [] }])
            setAlertMessage('Mesa creada')
            setAlertVariant('success')
            setShowAlert(true)
         })
         .catch((error) => {
            console.log('error', error)
            setShowAlert(true);
            setAlertMessage('No se ha podido crear la mesa')
            setAlertVariant('error')
         })
   }

   const deleteTable = async (table: ITable) => {
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify(table);
      const requestOptions: RequestInit = {
         method: "DELETE",
         headers: myHeaders,
         body: raw,
         redirect: "follow"
      }
      fetch(`${import.meta.env.VITE_HOST}tables/${id}/${table.id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            if (result.response === 'success') {
               setTables(tables.filter(t => t.id !== table.id))
               setGuests([...guests, ...table.guests])
               setAlertMessage('Mesa eliminada')
               setAlertVariant('success')
               setShowAlert(true)
            }
         })
         .catch((error) => {
            console.log('error', error)
            setShowAlert(true);
            setAlertMessage('No se ha podido eliminar la mesa')
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
         console.log(newDeletedSeats)
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
      console.log("asd")
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
               console.log(seat)
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
               console.log(bothSeats)
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