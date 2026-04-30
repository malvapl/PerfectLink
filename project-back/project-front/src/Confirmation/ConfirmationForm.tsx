import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Grid, TextField, FormLabel, FormHelperText, FormControlLabel, Checkbox, FormControl, Select, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import SpinnerForm from '../SpinnerForm.tsx';
import Message from '../Message.tsx';
import { Spinner } from 'react-bootstrap';
import { pickBy } from 'lodash';
import theme from '../theme/theme.ts';
import { useApi } from '../hooks/useApi';

type FormValues = {
   plusOne?: string,
   prewedding?: boolean,
   bus?: boolean,
   infoMenu: string,
   suggestion: string,
   group?: string,
}

const ConfirmationForm = () => {

   const api = useApi();
   const navigate = useNavigate();
   const { id } = useParams()

   const [btnLoading, setBtnLoading] = useState(false);
   const [loading, setLoading] = useState(false);
   const [showAlert, setShowAlert] = useState(false);
   const [alertVariant, setAlertVariant] = useState<'error' | 'info' | 'success' | 'warning'>('info');
   const [alertMessage, setAlertMessage] = useState('');
   const [checkPlusOne, setCheckPlusOne] = useState(false)
   const [helperPlusOne, setHelperPlusOne] = useState(false)
   const [btnDisabled, setBtnDisabled] = useState(false)

   const [errorPlusOne, setErrorPlusOne] = useState(false)
   const { register, handleSubmit, control, setValue }
      = useForm<FormValues>({
         mode: 'onBlur', defaultValues: {
            prewedding: false,
            bus: false,
            group: 'Sin asignar'
         }
      })
   const [groups, setGroups] = useState<string[]>([]);

   useEffect(() => {
      if (localStorage.getItem('token') === null) {
         navigate('/login')
      }

      setLoading(true);

      api.get(`userRole/${id}`)
         .then((result) => {
            if (result.data !== 'guestPending') {
               navigate('/')
            }
         })
         .catch((error) => {
            console.error(error)
         })

      api.get(`guestGroups/${id}`)
         .then((result) => {
            setGroups(result)
            setLoading(false)
         })
         .catch((error) => {
            console.error(error)
            setLoading(false)
         })
   }, [id, navigate, setGroups])

   const onSubmit: SubmitHandler<FormValues> = async (data) => {
      setBtnLoading(true);
            
      const sanitizedValues = pickBy(data, value => typeof value !== 'string' || value.length > 0);

      api.post(`users/confirmInvite/${id}`, sanitizedValues)
         .then((result) => {
            setAlertMessage('Asistencia confirmada');
            setAlertVariant('success');
            setShowAlert(true);
            // setInterval(() => {
               navigate('/wedding/' + id)
            // }, 2000)
         })
         .catch((error) => {
            setAlertMessage('No se ha podido confirmar');
            setAlertVariant('error');
            setShowAlert(true)
            setBtnLoading(false)
         })
   }


   return (<>
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
         <h1 className="titleRL text-center fw-normal mb-3">Confirmar asistencia</h1>
         <p className='text-center mb-4'>Por favor, rellena este formulario para ayudarnos a organizar el día.</p>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} className='px-4'>
               <Grid item xs={12}>
                  <TextField
                     {...register('infoMenu')}
                     fullWidth
                     label="¿Alguna alergia o preferencia de menú?"
                  />
                  <FormHelperText>Ejs.: Menú vegetariano, Alergia al marisco...</FormHelperText>
               </Grid>
               <Grid item xs={12}>
                  <FormLabel sx={{ color: 'black' }}>Llevo acompañante</FormLabel>
                  <Checkbox
                     size='small'
                     checked={checkPlusOne}
                     onClick={() => {
                        if (checkPlusOne) {
                           setValue('plusOne', '')
                           setErrorPlusOne(false)
                           setBtnDisabled(false)
                        } else {
                           setBtnDisabled(true)
                        }
                        setHelperPlusOne(!checkPlusOne)
                        setCheckPlusOne(!checkPlusOne)
                     }} />
               </Grid>
               <Grid item xs={12} hidden={!helperPlusOne}>
                  <TextField
                     {...register('plusOne')}
                     fullWidth
                     error={errorPlusOne}
                     label="Nombre del acompañante"
                     onChange={(e) => {
                        if (e.currentTarget.value === '') {
                           setBtnDisabled(true)
                           setErrorPlusOne(true)
                        } else {
                           setBtnDisabled(false)
                        }
                     }}
                  />
                  <FormHelperText>Asegúrate de informarnos también de sus alergias/preferencias para el menú.</FormHelperText>
               </Grid>
               <Grid item xs={12}>
                  <div className='d-flex gap-4 align-items-center'>
                     <Controller
                        name="prewedding"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                           <FormControlLabel
                              className='m-0'
                              checked={value}
                              label='Voy a la preboda'
                              labelPlacement="start"
                              control={<Checkbox size='small' checked={value} />}
                              onChange={onChange}
                           />
                        )}
                     />
                  </div>
               </Grid>
               <Grid item xs={12}>
                  <div className='d-flex gap-4 align-items-center'>
                     <Controller
                        name="bus"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                           <FormControlLabel
                              className='m-0'
                              checked={value}
                              label='Voy/vuelvo en bus'
                              labelPlacement="start"
                              control={<Checkbox size='small' checked={value} />}
                              onChange={onChange}
                           />
                        )}
                     />
                  </div>
               </Grid>
               <Grid item xs={12}>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                     <FormLabel sx={{ color: 'black' }}>Grupo</FormLabel>
                     <Controller
                        control={control}
                        name='group'
                        render={({ field }) => (
                           <Select {...field}>
                              <MenuItem value='Sin asignar'>Sin asignar</MenuItem>
                              {loading ? <Spinner /> : groups.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                           </Select>
                        )}
                     />
                  </FormControl>
               </Grid>
               <Grid item xs={12} className='d-flex flex-column gap-2'>
                  {/* color: rgba(0, 0, 0, 1) */}
                  <FormLabel>¿Alguna sugerencia?</FormLabel>
                  <textarea {...register('suggestion')} rows={3}>
                  </textarea>
               </Grid>
               <Grid className='text-center' item xs={12}>
                  {btnLoading ? (
                     <SpinnerForm />
                  ) : (
                     <Button disabled={btnDisabled} type="submit" variant="contained" color="primary">Confirmar</Button>
                  )}
               </Grid>
            </Grid>
         </form>
      </Container >
   </>)
}

export default ConfirmationForm