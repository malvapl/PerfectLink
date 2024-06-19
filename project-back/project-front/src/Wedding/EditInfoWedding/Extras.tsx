import { Button, Grid, IconButton, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import BusDialog from './BusDialog';
import EditIcon from '@mui/icons-material/Edit';
import { concat } from 'lodash';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import ConfirmationDialog from '../../ConfirmationDialog';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

export interface IBus {
   id?: number;
   departure: string;
   direction: boolean; // 0-> ida, 1-> vuelta
   start: string;
   end: string;
}
export interface IPrewedding {
   location: string | null;
   time: string | null;
}

const Extras = (props: {
   buses: IBus[] | string,
   prewedding: IPrewedding | string,
   setShowAlert: (a: boolean) => void,
   setAlertVariant: (a: "error" | "info" | "success" | "warning") => void,
   setAlertMessage: (a: string) => void
}) => {

   const { id } = useParams();
   const [openDialog, setOpenDialog] = useState(false);
   const [btnDisabledBus, setBtnDisabledBus] = useState(true);
   const [btnDisabledPW, setBtnDisabledPW] = useState(true);
   const [openConfirmationBuses, setOpenConfirmationBuses] = useState(false);
   const [openConfirmationPW, setOpenConfirmationPW] = useState(false);

   const [buses, setBuses] = useState<IBus[]>([]);
   const [editBus, setEditBus] = useState<IBus | undefined>();
   const [deletedBuses, setDeletedBuses] = useState<IBus[]>([]);
   const [prewedding, setPrewedding] = useState(false)
   const [location, setLocation] = useState('');
   const [time, setTime] = useState<dayjs.Dayjs>();


   useEffect(() => {
      setEditBus(undefined)
      setDeletedBuses([])
      if (typeof props.buses !== 'string') setBuses(props.buses)
      if (typeof props.prewedding !== 'string') {
         setPrewedding(true)
         setTime(dayjs(props.prewedding.time, 'HH:mm') || dayjs().hour(12).minute(0))
         setLocation(props.prewedding.location || '')
      }
   }, [props.buses, props.prewedding])

   const handleSaveBuses = async () => {
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      console.log(deletedBuses.filter(b => b.id !== undefined).map(b => ({ ...b, deleted: true })))

      const allBuses = concat(buses.map(b => ({ ...b, deleted: false })), deletedBuses.filter(b => b.id !== undefined).map(b => ({ ...b, deleted: true })))
      console.log(allBuses)
      allBuses.forEach(bus => {
         const raw = JSON.stringify(bus);
         console.log(raw)
         const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
         }
         fetch(`${import.meta.env.VITE_HOST}wedding/updateBus/${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
               console.log(result)
               setDeletedBuses([])
               props.setAlertMessage('Datos actualizados')
               props.setAlertVariant('success')
               props.setShowAlert(true)
            })
            .catch((error) => {
               console.log('error', error)
               props.setShowAlert(true);
               props.setAlertMessage('No se ha podido actualizar')
               props.setAlertVariant('error')
            })
      })
   }

   const handleSaveBus = async (bus: IBus) => {
      console.log(bus)
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify({ ...bus, deleted: false });
      console.log(raw)
      const requestOptions: RequestInit = {
         method: "POST",
         headers: myHeaders,
         body: raw,
         redirect: "follow"
      }
      fetch(`${import.meta.env.VITE_HOST}wedding/addBus/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            console.log(result)
            setBuses([...buses, { ...result.data, deleted: false }])
            props.setAlertMessage('Bus añadido')
            props.setAlertVariant('success')
            props.setShowAlert(true)
         })
         .catch((error) => {
            console.log('error', error)
            props.setShowAlert(true);
            props.setAlertMessage('No se ha podido añadir')
            props.setAlertVariant('error')
         })
   }

   const handleDelete = (bus: IBus) => {
      setBuses(buses.filter(b => b.id !== bus.id))
      setDeletedBuses([...deletedBuses, bus])
      setBtnDisabledBus(false)
   }

   const handleEdit = (bus: IBus) => {
      setEditBus(bus)
      setOpenDialog(true)
   }

   const handleSavePW = async () => {
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify({ location, time: time?.format('HH:mm') });
      console.log(raw)
      const requestOptions: RequestInit = {
         method: "POST",
         headers: myHeaders,
         body: raw,
         redirect: "follow"
      }
      fetch(`${import.meta.env.VITE_HOST}wedding/updatePrewedding/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            console.log(result)
            props.setAlertMessage('Datos actualizados')
            props.setAlertVariant('success')
            props.setShowAlert(true)
         })
         .catch((error) => {
            console.log('error', error)
            props.setShowAlert(true);
            props.setAlertMessage('No se ha podido actualizar')
            props.setAlertVariant('error')
         })
   }

   const handleCancelBuses = async () => {
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
         method: "POST",
         headers: myHeaders,
         redirect: "follow"
      }
      fetch(`${import.meta.env.VITE_HOST}cancelBuses/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            console.log(result)
            props.setAlertMessage('Buses cancelados')
            window.location.reload();
            props.setAlertVariant('success')
            props.setShowAlert(true)
         })
         .catch((error) => {
            console.log('error', error)
            props.setShowAlert(true);
            props.setAlertMessage('No se ha podido actualizar')
            props.setAlertVariant('error')
         })
   }

   const handleCancelPW = async () => {
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
         method: "POST",
         headers: myHeaders,
         redirect: "follow"
      }
      fetch(`${import.meta.env.VITE_HOST}cancelPrewedding/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            console.log(result)
            props.setAlertMessage('Preboda cancelada')
            window.location.reload();
            props.setAlertVariant('success')
            props.setShowAlert(true)
         })
         .catch((error) => {
            console.log('error', error)
            props.setShowAlert(true);
            props.setAlertMessage('No se ha podido actualizar')
            props.setAlertVariant('error')
         })
   }

   return (<>
      <Grid container spacing={2}>
         <Grid item xs={12} sx={{ marginBottom: 1 }}>
            <Typography sx={{ fontSize: 17, color: 'grey', textAlign: 'center' }}>
               Los invitados podrán apuntarse a estos eventos para que podáis organizarlos mejor.
            </Typography>
            <Typography sx={{ fontSize: 15, color: 'grey', textAlign: 'center' }}>
               Podéis verlo en la pestaña de invitados.
            </Typography>
         </Grid>
         {typeof props.buses !== 'string' && (<>
            <Grid item xs={12}>
               <Paper className='p-3'>
                  <Grid item xs={12}>
                     <Typography sx={{ fontSize: 25, textAlign: 'center' }}>Transporte</Typography>
                  </Grid>
                  <Grid container>
                     {/* <Typography sx={{ fontSize: 20, textAlign: 'center', marginBottom: 2 }}>Ida</Typography> */}
                     {buses.filter(b => !b.direction).length > 0 &&
                        <Grid item xs={12}><Typography sx={{ color: 'grey', fontSize: 13, marginLeft: 3 }}>IDA</Typography></Grid>
                     }
                     {buses.filter(b => !b.direction).map((bus, index) => (<>
                        <Bus key={index} data={bus} handleDelete={handleDelete} handleEdit={handleEdit} />
                     </>))}
                     {buses.filter(b => b.direction).length > 0 &&
                        <Grid item xs={12}><Typography sx={{ color: 'grey', fontSize: 13, marginLeft: 3 }}>VUELTA</Typography></Grid>
                     }
                     {buses.filter(b => b.direction).map((bus, index) => (
                        <Bus key={index} data={bus} handleDelete={handleDelete} handleEdit={handleEdit} />
                     ))}
                  </Grid>
                  <div className='d-flex justify-content-between align-items-center w-100 m-3 pe-4'>
                     <Button variant='contained' onClick={() => { setOpenDialog(true) }}>
                        <AddBoxIcon />Nuevo
                     </Button>
                     <Button onClick={handleSaveBuses} variant='contained' disabled={btnDisabledBus}>Guardar</Button>
                  </div>
               </Paper>
               <div className='d-flex justify-content-end w-100 m-3 pe-4'>
                  <Button onClick={() => { setOpenConfirmationBuses(true) }} variant='outlined' color='error'>Cancelar buses</Button>
               </div>
            </Grid>
         </>)}

         {prewedding && <>
            <Grid item xs={12}>
               <Paper className='p-3'>
                  <Grid item xs={12} sx={{ marginBottom: 3 }}>
                     <Typography sx={{ fontSize: 25, textAlign: 'center' }}>Preboda</Typography>
                  </Grid>
                  <Grid container spacing={2}>
                     <Grid item xs={6}>
                        <TextField
                           fullWidth
                           label="Ubicación"
                           value={location}
                           onChange={(e) => {
                              setLocation(e.target.value)
                              setBtnDisabledPW(false)
                           }}
                           error={location === ''}
                        />
                     </Grid>
                     <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                           <TimePicker
                              label="Hora"
                              value={dayjs(time)}
                              onChange={(e) => {
                                 setTime(dayjs(e))
                                 setBtnDisabledPW(false)
                              }}
                              ampm={false}
                              slotProps={{ textField: { fullWidth: true } }}
                           />
                        </LocalizationProvider>
                     </Grid>
                  </Grid>
                  <div className='d-flex justify-content-end align-items-center w-100 mt-3'>
                     <Button onClick={handleSavePW} variant='contained' disabled={btnDisabledPW} sx={{ marginTop: 3 }}>Guardar</Button>
                  </div>
               </Paper>
               <div className='d-flex justify-content-end w-100 m-3 pe-4'>
                  <Button onClick={() => { setOpenConfirmationPW(true) }} variant='outlined' color='error'>Cancelar preboda</Button>
               </div>
            </Grid>
         </>}

      </Grid>
      <BusDialog
         open={openDialog}
         bus={editBus}
         handleClose={(b: IBus) => {
            console.log(b)
            if (b.id) {
               setBuses(buses.map(bus => bus.id === b.id ? b : bus))
            } else {
               handleSaveBus(b)
            }
            setBtnDisabledBus(false)
            setOpenDialog(false)
         }}
         handleCancel={() => { setOpenDialog(false) }}
      />

      <ConfirmationDialog
         open={openConfirmationBuses}
         handleAccept={() => handleCancelBuses()}
         handleRefuse={() => setOpenConfirmationBuses(false)}
         title='¿Seguro que quieres cancelar el transporte?'
         message='No podrás volver a activarlo'
      />
      <ConfirmationDialog
         open={openConfirmationPW}
         handleAccept={() => handleCancelPW()}
         handleRefuse={() => setOpenConfirmationPW(false)}
         title='¿Seguro que quieres cancelar la preboda?'
         message='No podrás volver a activarla'
      />
   </>)
}


export default Extras

const Bus = (props: { data: IBus, handleDelete: (b: IBus) => void, handleEdit: (b: IBus) => void }) => {
   return (
      <Grid key={props.data.id} item xs={12} sx={{ padding: 2 }}>
         <Paper sx={{ width: '100%', padding: 1, paddingLeft: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ display: 'flex', alignItems: 'center' }}>
               <AirportShuttleIcon fontSize='large' className={props.data.direction ? 'revertedBusIcon' : ''} />
               <Typography fontWeight={'bold'}>{props.data.departure}</Typography>
               <Typography fontWeight={'bold'}>{props.data.start} </Typography>
               <ArrowRightAltIcon />
               <Typography fontWeight={'bold'}>{props.data.end} </Typography>
            </Stack>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
               <Tooltip title="Editar" placement="left">
                  <IconButton onClick={() => { props.handleEdit(props.data) }}>
                     <EditIcon />
                  </IconButton>
               </Tooltip>
               <Tooltip title="Eliminar" placement="right">
                  <IconButton onClick={() => { props.handleDelete(props.data) }}>
                     <DeleteIcon />
                  </IconButton>
               </Tooltip>
            </div>
         </Paper>
      </Grid >
   )
}