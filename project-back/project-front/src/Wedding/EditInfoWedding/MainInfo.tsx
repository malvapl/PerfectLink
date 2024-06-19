import { Button, FormHelperText, FormLabel, Grid, TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ConfirmationDialog from '../../ConfirmationDialog';


type FormValues = {
   spouse1: string,
   spouse2: string,
   date: dayjs.Dayjs,
   maxDateConfirmation: dayjs.Dayjs | null,
   startHour: dayjs.Dayjs,
   image: File | null,
   location: string,
   locationCeremony: string,
   locationParty: string,
   messageGuests: string,
}

const MainInfo = (props: {
   data: FormValues, setShowAlert: (a: boolean) => void,
   setAlertVariant: (a: "error" | "info" | "success" | "warning") => void,
   setAlertMessage: (a: string) => void
}) => {

   const [openConfirmation, setOpenConfirmation] = useState(false);
   const navigate = useNavigate();
   const { id } = useParams();
   const { setValue, register, handleSubmit, control, getValues, formState: { isDirty, isValid } }
      = useForm<FormValues>({
         mode: "onChange", defaultValues: {
            date: dayjs(),
            maxDateConfirmation: dayjs(),
            startHour: dayjs(),
         }
      })

   useEffect(() => {
      console.log(props.data)
      setValue('spouse1', props.data.spouse1)
      setValue('spouse2', props.data.spouse2)
      setValue('date', props.data.date)
      setValue('maxDateConfirmation', props.data.maxDateConfirmation)
      setValue('startHour', props.data.startHour)
      setValue('image', props.data.image)
      setValue('location', props.data.location)
      setValue('locationCeremony', props.data.locationCeremony)
      setValue('locationParty', props.data.locationParty)
      setValue('messageGuests', props.data.messageGuests)
   }, [props.data, setValue])

   const onSubmit: SubmitHandler<FormValues> = async (data) => {
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify({
         ...data,
         startHour: dayjs(data.startHour).format('HH:mm'),
         date: dayjs(data.date).format('YYYY-MM-DD'),
         maxDateConfirmation: dayjs(data.maxDateConfirmation).format('YYYY-MM-DD')
      });

      const requestOptions: RequestInit = {
         method: "PATCH",
         headers: myHeaders,
         body: raw,
         redirect: "follow"
      };

      console.log(raw)

      fetch(`${import.meta.env.VITE_HOST}weddings/${id}`, requestOptions)
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
         });
   }

   const handleDeleteWedding = async () => {
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
         method: "DELETE",
         headers: myHeaders,
         redirect: "follow"
      }
      fetch(`${import.meta.env.VITE_HOST}weddings/${id}`, requestOptions)
         .then((response) => response.json())
         .then(() => {
            setOpenConfirmation(false)
            props.setAlertMessage('Boda eliminada')
            props.setAlertVariant('success')
            props.setShowAlert(true)
            localStorage.removeItem("hasOwnWedding");
            window.dispatchEvent(new Event("storage"));
            setTimeout(() => {
               navigate("/");
            }, 1000);
         })
         .catch((error) => {
            console.log('error', error)
            props.setShowAlert(true);
            props.setAlertMessage('No se ha podido eliminar la boda')
            props.setAlertVariant('error')
         })
   }

   return (<>
      <form onSubmit={handleSubmit(onSubmit)}>
         <Grid container spacing={4}>
            {/* <Grid item xs={12}>
               <Input
                  id='image'
                  value={getValues('image')}
                  onChange={(e) => setValue('image', (e.target as HTMLInputElement).files![0])}
                  fullWidth
                  name='image'
                  type='file'
                  inputProps={{ accept: 'image/png, image/jpeg' }}
               ></Input>
               <FormHelperText>
                  Sube una imágen de la pareja
               </FormHelperText>
            </Grid> */}
            <Grid item xs={6}>
               <TextField InputLabelProps={{ shrink: true }}
                  {...register('spouse1')}
                  className='col-6'
                  name='spouse1'
                  fullWidth
                  size='small'
                  label="Novi@"
               />
            </Grid>
            <Grid item xs={6}>
               <TextField InputLabelProps={{ shrink: true }}
                  {...register('spouse2')}
                  className='col-6'
                  name='spouse2'
                  fullWidth
                  size='small'
                  label="Novi@"
               />
            </Grid>
            <Grid item xs={6}>
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                     name='date'
                     control={control}
                     render={({ field: { value, onChange } }) => (
                        <DatePicker
                           label="Fecha"
                           value={value}
                           format='DD/MM/YYYY'
                           onChange={(newValue) => onChange(newValue)}
                           minDate={dayjs().add(1, 'day')}
                           slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                        />
                     )}
                  >
                  </Controller>
               </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                     name='startHour'
                     control={control}
                     render={({ field: { value, onChange } }) => (
                        <TimePicker
                           label="Hora"
                           value={value}
                           onChange={(newValue) => onChange(newValue)}
                           ampm={false}
                           slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                        />
                     )}
                  >
                  </Controller>
               </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
               <FormLabel className='w-100 text-center'>Ubicación</FormLabel>
               <Grid item xs={12} className='d-flex flex-column gap-3'>
                  <TextField InputLabelProps={{ shrink: true }}
                     {...register('location')}
                     name='location'
                     fullWidth
                     size='small'
                     label="General"
                  />
                  <TextField InputLabelProps={{ shrink: true }}
                     {...register('locationCeremony')}
                     name='locationCeremony'
                     fullWidth
                     size='small'
                     label="Ceremonia"
                  />
                  <TextField InputLabelProps={{ shrink: true }}
                     {...register('locationParty')}
                     name='locationParty'
                     fullWidth
                     size='small'
                     label="Fiesta"
                  />

               </Grid>
            </Grid>
            <Grid item xs={12}>
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                     name='maxDateConfirmation'
                     control={control}
                     render={({ field: { value, onChange } }) => (
                        <DatePicker
                           label="Fecha máxima para confirmar"
                           value={value}
                           format='DD/MM/YYYY'
                           onChange={(newValue) => onChange(newValue)}
                           maxDate={dayjs(getValues('date')).subtract(1, 'day')}
                           slotProps={{
                              textField: { fullWidth: true, size: 'small' }
                           }}
                        />
                     )}
                  >
                  </Controller>
               </LocalizationProvider>
               <FormHelperText>
                  A partir de esta fecha los invitados no podrán confirmar su asistencia.
               </FormHelperText>
            </Grid>
            <Grid item xs={12}>
               <FormLabel>Mensaje para los invitados:</FormLabel>
               <textarea {...register('messageGuests')} name='messageGuests' rows={3}></textarea>
            </Grid>
         </Grid>
         <Grid item xs={12}>
            <div className='d-flex flex-column text-center'>
               <div><Button variant='contained' type='submit' disabled={!isDirty || !isValid} sx={{ marginTop: 3 }}>Guardar</Button></div>
            </div>
         </Grid>
      </form>
      <Grid item xs={12}>
         <div className='d-flex flex-column text-end mt-5'>
            <div><Button onClick={() => setOpenConfirmation(true)} variant='outlined' color='error'>Cancelar boda</Button></div>
         </div>
      </Grid>

      <ConfirmationDialog
         open={openConfirmation}
         handleAccept={handleDeleteWedding}
         handleRefuse={() => setOpenConfirmation(false)}
         title='¿Seguro que quieres cancelar la boda?'
      />
   </>)
}

export default MainInfo