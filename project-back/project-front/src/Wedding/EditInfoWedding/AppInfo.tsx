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
import { useApi } from '../../hooks/useApi';

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

   const api = useApi();
   const [showAlert, setShowAlert] = useState(false);
   const [alertVariant, setAlertVariant] = useState<'error' | 'info' | 'success' | 'warning'>('info');
   const [alertMessage, setAlertMessage] = useState('');

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
      const getWedding = async () => {
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

         api.get(`wedding/${id}`)
            .then((result) => {
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
            }).catch((error) => {
               console.error(error)
               setLoading(false)
            })

         api.get(`weddingInfo/${id}`)
            .then((result) => {
               setInfo(result.data)
            }).catch((error) => {
               console.error(error)
               setLoading(false)
            })

         api.get(`weddingBuses/${id}`)
            .then((result) => {
               setBuses(result.data)
            }).catch((error) => {
               console.error(error)
               setLoading(false)
            })

         api.get(`weddingPrewedding/${id}`)
            .then((result) => {
               setLoading(false)
               setPrewedding(result.data)
            }).catch((error) => {
               console.error(error)
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
