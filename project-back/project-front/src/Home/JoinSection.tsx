import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import { Alert, Button, Grid, TextField } from '@mui/material';
import Message from '../Message';
import SpinnerForm from '../SpinnerForm';

const JoinSection = (props: {
   message: string, role: string,
   setDialog: (a: { open: boolean, action: 'join' | 'create' | '' }) => void
}) => {

   const navigate = useNavigate();
   const auth = localStorage.getItem('token') !== null || false;

   const [code, setCode] = useState('');
   const [btnDisabled, setBtnDisabled] = useState(true);
   const [showAlert, setShowAlert] = useState(false)
   const [showAlertSuccess, setShowAlertSuccess] = useState(false);
   const [alertVariant, setAlertVariant] = useState<"error" | "info" | "success" | "warning">("info");
   const [alertMessage, setAlertMessage] = useState("");
   const [loading, setLoading] = useState(false)

   const joinUser = async (code: string, id: string) => {
      console.log("ASD")
      const token = JSON.parse(localStorage.getItem("token") || '');

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
         method: "GET",
         headers: myHeaders,
         redirect: "follow"
      };

      fetch(`${import.meta.env.VITE_HOST}users/joinWedding/${code}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            if (result.error) {
               setLoading(false);
               setAlertMessage(result.error);
               setAlertVariant("error");
               setShowAlertSuccess(true)
            } else {
               window.dispatchEvent(new StorageEvent("storage"));
               setTimeout(() => {
                  navigate("/wedding/" + id);
               }, 3000);
               setAlertMessage("Uniéndose a la boda...");
               setAlertVariant("success");
               setShowAlertSuccess(true);
            }
         })
         .catch((error) => {
            console.log(error)
            setLoading(false);
            setAlertMessage('Error');
            setAlertVariant("error");
            setShowAlertSuccess(true)
         })
   };

   const checkCode = async (code: string) => {
      const data = await fetch(`${import.meta.env.VITE_HOST}wedding/code${props.role}/${code}`, {
         method: "GET"
      });
      const jsonData = await data.json();
      if (jsonData['id']) {
         joinUser(code, jsonData['id']);
      } else {
         setLoading(false);
         setShowAlert(true);
      }
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
         showAlert={showAlertSuccess}
         color={alertVariant}
         message={alertMessage}
         setShowAlert={setShowAlertSuccess}
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