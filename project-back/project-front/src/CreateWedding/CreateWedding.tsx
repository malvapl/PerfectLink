import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useNavigate } from "react-router-dom";
import { Button, Container, Grid, TextField, FormLabel, FormHelperText, RadioGroup, FormControlLabel, Radio, Switch, Stack } from '@mui/material';
import { useEffect, useState } from "react";
import SpinnerForm from "../SpinnerForm.tsx";
import Message from '../Message.tsx';
import GavelIcon from '@mui/icons-material/Gavel';
import ChurchIcon from '@mui/icons-material/Church';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import theme from '../theme/theme.ts';

type FormValues = {
   spouse1: string,
   spouse2: string,
   date: dayjs.Dayjs,
   startHour: dayjs.Dayjs,
   location: string,
   messageGuests: string,
   ceremony: boolean,
   prewedding: number,
   bus: number
}

const CreateWedding = () => {

   const navigate = useNavigate();

   const [loading, setLoading] = useState(false);
   const [showAlert, setShowAlert] = useState(false);
   const [alertVariant, setAlertVariant] = useState<"error" | "info" | "success" | "warning">("info");
   const [alertMessage, setAlertMessage] = useState("");
   const [helperPrewedding, setHelperPrewedding] = useState(false)
   const [helperBus, setHelperBus] = useState(false)

   const { register, handleSubmit, control, formState: { errors, isDirty, isValid } }
      = useForm<FormValues>({
         mode: "onBlur", defaultValues: {
            prewedding: 1,
            bus: 1,
            ceremony: true,
            date: dayjs().add(1, 'day'),
            startHour: dayjs().hour(12).minute(0)
         }
      })

   useEffect(() => {
      if (localStorage.getItem('token') === null) {
         navigate('/login')
      }
   }, [navigate])

   const onSubmit: SubmitHandler<FormValues> = async (data) => {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token") || '');

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify({
         ...data,
         startHour: dayjs(data.startHour).format('HH:mm'),
         date: dayjs(data.date).format('YYYY-MM-DD')
      });
      console.log(raw)

      const requestOptions: RequestInit = {
         method: "POST",
         headers: myHeaders,
         body: raw,
         redirect: "follow"
      };

      fetch(`${import.meta.env.VITE_HOST}weddings`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            if (result.error) {
               setAlertMessage(result.error);
               setAlertVariant("error");
               setShowAlert(true)
               setLoading(false)
               return;
            } else {
               console.log(result)
               setAlertMessage("Creando sala de la boda...");
               setAlertVariant("success");
               setShowAlert(true);
               localStorage.setItem("hasOwnWedding", JSON.stringify(result.id));
               window.dispatchEvent(new Event("storage"));
               setTimeout(() => {
                  navigate("/wedding/" + result.id);
               }, 3000);
            }
         })
         .catch((error) => {
            console.log(error)
            setAlertMessage("No se ha podido crear la boda");
            setAlertVariant("error");
            setShowAlert(true)
            setLoading(false)
         })
   }


   return (
      <>
         <Message
            showAlert={showAlert}
            color={alertVariant}
            message={alertMessage}
            setShowAlert={setShowAlert}
         />

         <Container maxWidth="sm" sx={{
            boxShadow: 3,
            borderRadius: 2,
            p: 3,
            mt: 3,
            backgroundColor: theme.palette.background.default
         }}>
            <h1 className="titleRL text-center fw-normal mb-3">Nueva boda</h1>
            <p className='text-center mb-4'>Vamos a empezar con la información esencial para crear la sala de la boda.
               No os preocupéis, ¡siempre podréis editarlo más tarde!</p>
            <form className='mb-5' onSubmit={handleSubmit(onSubmit)}>
               <Grid container spacing={3}>
                  <Grid item xs={6}>
                     <TextField
                        {...register('spouse1', { required: 'Rellena este campo' })}
                        fullWidth
                        label="Tú eres..."
                        error={!!errors.spouse1}
                        helperText={errors.spouse1 ? errors.spouse1.message : ''}
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <TextField
                        {...register('spouse2', { required: 'Rellena este campo' })}
                        fullWidth
                        label="Tu pareja es..."
                        error={!!errors.spouse2}
                        helperText={errors.spouse2 ? errors.spouse2.message : ''}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        {...register('location', {
                           required: 'Rellena este campo'
                        })}
                        fullWidth
                        label="Ubicación (ciudad)"
                        error={!!errors.location}
                        helperText={errors.location ? errors.location.message : ''}
                     />
                  </Grid>
                  <Grid item xs={6} >
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                           name='date'
                           control={control}
                           render={({ field: { value, onChange } }) => (
                              <DatePicker
                                 label="Fecha"
                                 format='DD/MM/YYYY'
                                 value={value}
                                 onChange={(newValue) => onChange(newValue)}
                                 minDate={dayjs().add(1, 'day')}
                                 slotProps={{ textField: { fullWidth: true } }}
                              />
                           )}
                        >
                        </Controller>
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                           name='startHour'
                           control={control}
                           render={({ field: { value, onChange } }) => (
                              <TimePicker
                                 label="Hora"
                                 value={value}
                                 onChange={onChange}
                                 ampm={false}
                                 slotProps={{ textField: { fullWidth: true } }}
                              />
                           )}
                        >
                        </Controller>
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                     <Controller
                        name="ceremony"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                           <Stack direction="row" spacing={1} alignItems="center">
                              <p>Civil</p>
                              <GavelIcon />
                              <Switch checked={value} onChange={onChange} />
                              <ChurchIcon />
                              <p>Religiosa</p>
                           </Stack>
                        )}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <div className='d-flex gap-4 align-items-center'>
                        <FormLabel>¿Haréis fiesta preboda?</FormLabel>
                        <Controller
                           name="prewedding"
                           control={control}
                           render={({ field }) => (
                              <RadioGroup
                                 {...field}
                                 row
                                 value={field.value ?? 1}
                                 onChange={(e) => {
                                    const value = parseInt(e.target.value)
                                    field.onChange(value)
                                    setHelperPrewedding(value === 0)
                                 }}
                              >
                                 <FormControlLabel value={0} control={<Radio size='small' />} label="No" />
                                 <FormControlLabel value={1} control={<Radio size='small' />} label="Sí" />
                              </RadioGroup>
                           )}
                        />
                     </div>
                  </Grid>
                  <FormHelperText hidden={!helperPrewedding} className='ms-5' error>Esta opción no se puede activar más adelante, pero siempre la podréis desactivar</FormHelperText>
                  <Grid item xs={12}>
                     <div className='d-flex gap-4 align-items-center py-0'>
                        <FormLabel>¿Habrá buses para los invitados?</FormLabel>
                        <Controller
                           name="bus"
                           control={control}
                           render={({ field }) => (
                              <RadioGroup
                                 {...field}
                                 row
                                 value={field.value ?? 1}
                                 onChange={(e) => {
                                    const value = parseInt(e.target.value)
                                    field.onChange(value)
                                    setHelperBus(value === 0)
                                 }}
                              >
                                 <FormControlLabel value={0} control={<Radio size='small' />} label="No" />
                                 <FormControlLabel value={1} control={<Radio size='small' />} label="Sí" />
                              </RadioGroup>
                           )}
                        />
                     </div>
                  </Grid>
                  <FormHelperText hidden={!helperBus} className='ms-5' error>Esta opción no se puede activar más adelante, pero siempre la podréis desactivar</FormHelperText>
                  <Grid item xs={12} className='d-flex flex-column gap-2'>
                     <FormLabel>¿Algo que queráis decir a los invitados?</FormLabel>
                     <textarea {...register('messageGuests')} rows={3}>
                     </textarea>
                  </Grid>
                  <Grid className='text-center' item xs={12}>
                     {loading ? (
                        <SpinnerForm />
                     ) : (
                        <Button type="submit" variant="contained" color="primary" disabled={!isDirty || !isValid}>Continuar</Button>
                     )}
                  </Grid>
               </Grid>
            </form>
         </Container>
      </ >
   )
}

export default CreateWedding