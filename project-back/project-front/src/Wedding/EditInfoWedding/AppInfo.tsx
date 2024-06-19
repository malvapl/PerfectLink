import { Container, Tabs, Tab, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import Message from '../../Message';
import MainInfo from './MainInfo';
import CustomInfo from './CustomInfo';
import '../../styles.css';
import Extras, { IBus, IPrewedding } from './Extras';
import PropagateLoader from 'react-spinners/PropagateLoader';
import theme from '../../theme/theme';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';

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
   messageGuests: string
}

export interface InfoExtra {
   id: number,
   title: string,
   subtitle: string,
   description: string,
   enabled: boolean,
   wedding_id: number
}

const AppInfo = () => {

   const [showAlert, setShowAlert] = useState(false);
   const [alertVariant, setAlertVariant] = useState<"error" | "info" | "success" | "warning">("info");
   const [alertMessage, setAlertMessage] = useState("");

   const navigate = useNavigate();
   const { id } = useParams();
   const { tab } = useParams();
   const [loading, setLoading] = useState<boolean>(false);

   const [codes, setCodes] = useState({ guest: '', org: '' });
   const [mainData, setMainData] = useState<FormValues>({
      spouse1: '',
      spouse2: '',
      date: dayjs(),
      maxDateConfirmation: dayjs(),
      startHour: dayjs(),
      image: null,
      location: '',
      locationCeremony: '',
      locationParty: '',
      messageGuests: '',
   })
   const [info, setInfo] = useState<InfoExtra[]>([]);
   const [buses, setBuses] = useState<IBus[] | string>([]);
   const [prewedding, setPrewedding] = useState<IPrewedding | string>('');

   useEffect(() => {
      console.log("asd")
      const getWedding = async () => {
         const token = JSON.parse(localStorage.getItem("token") || '');
         const myHeaders = new Headers();
         myHeaders.append("Content-Type", "application/json");
         myHeaders.append("Authorization", `Bearer ${token}`);

         const requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
         }
         setLoading(true);
         fetch(`${import.meta.env.VITE_HOST}userRole/${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
               console.log(result.response)
               if (result.response !== 'organizer' && !result.admin) navigate('/')
            })
            .catch((error) => {
               console.log(error)
            })
         fetch(`${import.meta.env.VITE_HOST}wedding/${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
               console.log(result.data)
               setCodes({ guest: result.data.codeGuest, org: result.data.codeOrg })
               setMainData({
                  spouse1: result.data.spouse1,
                  spouse2: result.data.spouse2,
                  date: dayjs(result.data.date),
                  maxDateConfirmation: result.data.maxDateConfirmation ? dayjs(result.data.maxDateConfirmation) : null,
                  startHour: dayjs(result.data.startHour, 'HH:mm'),
                  image: result.data.image,
                  location: result.data.location,
                  locationCeremony: result.data.locationCeremony,
                  locationParty: result.data.locationParty,
                  messageGuests: result.data.messageGuests
               })
            }).catch(() => {
               console.log('error: boda no encontrada')
               setLoading(false)
            })

         fetch(`${import.meta.env.VITE_HOST}weddingInfo/${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
               // console.log(result.data)
               setInfo(result.data)
            }).catch(() => {
               console.log('error: boda no encontrada')
               setLoading(false)
            })
         fetch(`${import.meta.env.VITE_HOST}weddingBuses/${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
               console.log(result.data)
               setBuses(result.data)
            }).catch(() => {
               console.log('error: boda no encontrada')
               setLoading(false)
            })

         fetch(`${import.meta.env.VITE_HOST}weddingPrewedding/${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
               setLoading(false)
               setPrewedding(result.data)
            }).catch(() => {
               console.log('error: boda no encontrada')
               setLoading(false)
            })
      }
      getWedding();
   }, [id, navigate])

   const [value, setValue] = useState<number>(parseInt(tab || '0'));

   const handleChange = (newValue: number) => {
      setValue(newValue);
   };

   return (
      <>
         {
            loading ? (
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

               <div className='text-center m-5 text-white'>
                  <h1>Información de la boda</h1>
                  <p>Esta es la información que verán los invitados al entrar a la sala de tu boda.</p>
               </div>


               <Container maxWidth={'md'} sx={{
                  height: 'auto',
                  p: 3,
                  boxShadow: 3,
                  borderRadius: 2,
                  bgcolor: theme.palette.background.default,
               }}>

                  <Tabs
                     variant="fullWidth"
                     value={value}
                     onChange={(event, value) => handleChange(value)}
                     aria-label="Vertical tabs example"
                     className='mb-3'
                  >
                     <Tab label="Principal" id='0' />
                     <Tab hidden={typeof buses === 'string' && typeof prewedding === 'string'} label="Extra" id='1' />
                     <Tab label="Personalizable" id='2' />
                     <Tab label="Códigos" id='3' />
                  </Tabs>

                  <Container maxWidth={'md'} sx={{
                     borderRadius: 2,
                     p: 3
                  }}
                     role="tabpanel" hidden={value !== 0}
                  >
                     <MainInfo
                        data={mainData}
                        setShowAlert={setShowAlert}
                        setAlertVariant={setAlertVariant}
                        setAlertMessage={setAlertMessage}
                     />
                  </Container>

                  <Container maxWidth={'md'} sx={{
                     borderRadius: 2,
                     p: 3
                  }}
                     role="tabpanel" hidden={value !== 1}
                  >
                     <Extras
                        buses={buses}
                        prewedding={prewedding}
                        setShowAlert={setShowAlert}
                        setAlertVariant={setAlertVariant}
                        setAlertMessage={setAlertMessage}
                     />
                  </Container>

                  <Container maxWidth={'md'} sx={{
                     borderRadius: 2,
                     p: 3
                  }}
                     role="tabpanel" hidden={value !== 2} className='p-4'
                  >
                     <CustomInfo info={info}
                        setShowAlert={setShowAlert}
                        setAlertVariant={setAlertVariant}
                        setAlertMessage={setAlertMessage}
                     />
                  </Container>

                  <div role="tabpanel" hidden={value !== 3}>
                     <Container maxWidth={'xs'} sx={{
                        borderRadius: 2,
                        bgcolor: theme.palette.background.default,
                        p: 3
                     }} >
                        <div>
                           {/* <p>Envíale el código a tus invitados</p> */}
                           {/* {pathname} */}
                        </div>
                        <div className='w-100 d-flex justify-content-evenly'>
                           <div className='d-flex flex-column gap-3 justify-content-center'>
                              <Typography fontSize={20}>Invitados:</Typography>
                              <Typography fontSize={20}>Organizadores:</Typography>
                           </div>
                           <div className='d-flex flex-column gap-3b justify-content-center'>
                              <Typography fontSize={25}>{codes.guest}</Typography>
                              <Typography fontSize={25}>{codes.org}</Typography>
                           </div>
                        </div>
                     </Container>
                  </div>
               </Container >
            </>
            )
         }
      </>
   )
}

export default AppInfo
