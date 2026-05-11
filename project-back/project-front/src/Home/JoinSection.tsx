import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import { Alert, Button, Grid, TextField } from '@mui/material';
import Message from '../Message';
import SpinnerForm from '../SpinnerForm';
import { useApi } from '../hooks/useApi';

type AlertState = {
   open: boolean;
   variant: 'error' | 'info' | 'success' | 'warning';
   message: string;
}

const JoinSection = (props: {
   message: string, role: string,
   setDialog: (a: { open: boolean, action: 'join' | 'create' | '' }) => void
}) => {

   const api = useApi();
   const navigate = useNavigate();
   const auth = localStorage.getItem('token') !== null || false;

   const [code, setCode] = useState('');
   const [btnDisabled, setBtnDisabled] = useState(true);
   const [showAlert, setShowAlert] = useState(false)
   const [alert, setAlert] = useState<AlertState>({ open: false, variant: 'info', message: '' });
   const [loading, setLoading] = useState(false)

   const joinUser = async (code: string, id: string) => {

      api.get(`users/joinWedding/${code}`)
         .then((result) => {
            console.log(result)
            if (result.error) {
               setLoading(false);
               setAlert({ open: true, variant: 'error', message: result.error });
            } else {
               window.dispatchEvent(new StorageEvent('storage'));
               setTimeout(() => {
                  navigate('/wedding/' + id);
               }, 3000);
               setAlert({ open: true, variant: 'success', message: 'Uniéndose a la boda...' });
            }
         })
         .catch((error) => {
            setLoading(false);
            setAlert({ open: true, variant: 'error', message: 'Error' });
         })
   };

   const checkCode = async (code: string) => {
      api.get(`wedding/code${props.role}/${code}`, false)
         .then((result) => {
            joinUser(code, result.id);
         })
         .catch((error) => {
            setLoading(false);
            setShowAlert(true);
         })
   };

   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const regexp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{5}$/
      setCode(e.target.value);
      if (regexp.test(e.target.value)) {
         setBtnDisabled(false);
      } else {
         setBtnDisabled(true);
      }
   }

   function handleJoin() {
      if (auth) {
         setLoading(true)
         checkCode(code);
      } else {
         props.setDialog({ open: true, action: 'join' });
      }
   }

   return (<>
      <Message
         showAlert={alert.open}
         color={alert.variant}
         message={alert.message}
         setShowAlert={(open) => setAlert((prev) => ({ ...prev, open }))}
      />
      <Snackbar
         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
         open={showAlert}
         autoHideDuration={4000}
         onClose={() => setShowAlert(false)}
      >
         <Alert
            severity='warning'
            variant='filled'
         >
            El código no corresponde a ninguna boda.
         </Alert>
      </Snackbar>

      <Grid container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
         <Grid item xs={12} lg={6}>
            <h4>{props.message}</h4>
         </Grid>
         <Grid item xs={12} lg={6} sx={{display: 'flex'}}>
            {/* <Box sx={{ display: 'flex', alignItems: 'center' }}> */}
               <TextField
                  label="Código"
                  size='small'
                  onChange={handleChange}
               />
               {loading ? (
                  <SpinnerForm />
               ) : (
                  <Button id='joinWedding' className='m-0'
                     variant='contained'
                     color='primary'
                     onClick={handleJoin}
                     disabled={btnDisabled}
                  >
                     Unirse
                  </Button>
               )}
            {/* </Box> */}
         </Grid>
      </Grid>
   </>)
}

export default JoinSection