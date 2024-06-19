import { Button, Card, Container, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import Grow from '@mui/material/Grow';
import "../../styles.css"
import { IBus, IPrewedding } from "../EditInfoWedding/Extras";
import HourglassTopTwoToneIcon from '@mui/icons-material/HourglassTopTwoTone';
import HourglassBottomTwoToneIcon from '@mui/icons-material/HourglassBottomTwoTone';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import ConfirmationDialog from "../../ConfirmationDialog";
import Message from "../../Message";
import SpinnerForm from "../../SpinnerForm";
import theme from "../../theme/theme";
import PropagateLoader from "react-spinners/PropagateLoader";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import imageDefault from '../../images/mainWedding/couple.jpg';

interface Wedding {
   spouse1: string;
   spouse2: string;
   date: string;
   startHour: string;
   maxDateConfirmation: string | null;
   codeGuest: string;
   codeOrg: string
   image?: string;
   ceremony: boolean;
   location: string;
   locationCeremony: string;
   locationParty: string;
   messageGuests: string;
   bus: boolean;
   prewedding: boolean;
   infos: Info[]
}

interface Info {
   title: string;
   description: string;
   enabled: boolean;
}

const MainPage = () => {

   const [showAlert, setShowAlert] = useState(false);
   const [alertVariant, setAlertVariant] = useState<"error" | "info" | "success" | "warning">("info");
   const [alertMessage, setAlertMessage] = useState("");

   const navigate = useNavigate();
   const { id } = useParams();
   const [role, setRole] = useState<string>()
   const [loading, setLoading] = useState<boolean>(false);
   const [btnLoading, setBtnLoading] = useState<boolean>(false);
   const [wedding, setWedding] = useState<Wedding>({
      spouse1: '',
      spouse2: '',
      date: '',
      startHour: '',
      maxDateConfirmation: null,
      codeGuest: '',
      codeOrg: '',
      image: imageDefault,
      ceremony: false,
      location: '',
      locationCeremony: '',
      locationParty: '',
      messageGuests: '',
      bus: false,
      prewedding: false,
      infos: []
   });
   const [buses, setBuses] = useState<IBus[]>([]);
   const [prewedding, setPrewedding] = useState<IPrewedding>({ location: '', time: '' });


   useEffect(() => {
      const getRole = async () => {
         setLoading(true);
         const token = JSON.parse(localStorage.getItem("token") || '');

         const myHeaders = new Headers();
         myHeaders.append("Content-Type", "application/json");
         myHeaders.append("Authorization", `Bearer ${token}`);

         const requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
         };

         fetch(`${import.meta.env.VITE_HOST}userRole/${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
               console.log(result)
               setRole(result.response);
               if ((result.response === 'guestCanceled' || result.response === 'none') && !result.admin) navigate('/')
            })
            .catch((error) => {
               console.log(error)
            })

         fetch(`${import.meta.env.VITE_HOST}weddingBuses/${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
               setBuses(result.data)
            }).catch(() => {
               console.log('error: boda no encontrada')
               setLoading(false)
            })
         fetch(`${import.meta.env.VITE_HOST}weddingPrewedding/${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
               // console.log(result)
               setPrewedding(result.data)
            }).catch(() => {
               console.log('error: boda no encontrada')
               setLoading(false)
            })
      }

      const getWedding = () => {
         fetch(`${import.meta.env.VITE_HOST}wedding/${id}`, {
            method: "GET"
         }).then((response) => response.json())
            .then((result) => {
               setWedding({
                  ...result.data, image: result.data.image !== null ?
                     import.meta.env.VITE_HOST_IMG + result.data.image :
                     imageDefault,
                     date: result.data.date.split('-').reverse().join('-'),
                     maxDateConfirmation:  result.data.maxDateConfirmation !== null ? 
                     result.data.maxDateConfirmation.split('-').reverse().join('-') :
                     null,
               })
               setLoading(false)
               // console.log(result.data)
            }).catch(() => {
               console.log('error: boda no encontrada')
               setLoading(false)
            })
      }

      getRole();
      getWedding();
   }, [id, navigate])


   const [canConfirm, setCanConfirm] = useState(true)
   useEffect(() => {
      const d = wedding.maxDateConfirmation ? wedding.maxDateConfirmation : wedding.date
      const dbDate = [d.split('-')[1], d.split('-')[0], d.split('-')[2]].join('-')
      if (new Date(dbDate).getTime() < new Date().getTime()) {
         setCanConfirm(false)
      } else {
         setCanConfirm(true)
      }
      
   }, [wedding])

   const handleConfirmInvite = () => {
      navigate('/confirmation/' + id)
   }

   const [openConfirmation, setOpenConfirmation] = useState(false)
   const handleCancelInvite = () => {
      setOpenConfirmation(false)
      setBtnLoading(true);
      const token = JSON.parse(localStorage.getItem("token") || '');

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
         method: "POST",
         headers: myHeaders,
         redirect: "follow"
      };

      fetch(`${import.meta.env.VITE_HOST}users/cancelInvite/${id}`, requestOptions)
         .then((response) => response.json())
         .then(() => {
            window.dispatchEvent(new Event("storage"));
            setTimeout(() => {
               navigate("/");
            }, 2000);
            setAlertMessage("Asistencia cancelada");
            setAlertVariant("success");
            setShowAlert(true);
            setBtnLoading(false);
         })
         .catch((error) => {
            console.log(error)
            setBtnLoading(false);
            setAlertMessage("No se ha podido cancelar");
            setAlertVariant("error");
            setShowAlert(true)
            setLoading(false)
         })
   }

   return (<>
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

               <Message
                  showAlert={showAlert}
                  color={alertVariant}
                  message={alertMessage}
                  setShowAlert={setShowAlert}
               />

               <Container disableGutters maxWidth={'md'} sx={{
                  paddingBottom: 3,
                  marginTop: 4,
                  boxShadow: 5,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.default
               }}>
                  <Card sx={{ backgroundColor: theme.palette.info.main, borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}>
                     <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Grid item sx={{
                           width: '250px',
                           marginLeft: { xs: '27%', sm: 'auto' },
                           justifyContent: { xs: 'center', sm: 'auto' },
                           height: '250px',
                           padding: 3
                        }}>
                           <div id='imageCouple'></div>
                        </Grid>
                        <Grid item xs={12} sm sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           justifyContent: 'center',
                           alignItems: 'center',
                           padding: 3,
                           gap: 3
                        }}>
                           <Typography fontFamily={'DancingScript'} color={theme.palette.primary.light} variant="h2">
                              {wedding.spouse1} & {wedding.spouse2}
                           </Typography>
                           <Typography variant="h5" color={theme.palette.primary.light} align="center" gutterBottom>
                              {wedding.date} a las {wedding.startHour}
                           </Typography>
                           {wedding.messageGuests !== null && <Typography variant="h6" color={theme.palette.primary.main} align="center" gutterBottom>
                              {wedding.messageGuests}
                           </Typography>}
                        </Grid>
                     </Grid>
                  </Card>

                  <Grid container spacing={3} sx={{ paddingX: 4, marginTop: 5 }}>

                     {wedding.bus ? (
                        <Grid item xs={12}>
                           <Card>
                              <Grid container sx={{ padding: 3 }}>
                                 <Grid item xs={12}>
                                    <Typography sx={{ fontSize: 25, textAlign: 'center' }}>Transporte</Typography>
                                 </Grid>
                                 <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Grid container>
                                       {buses.length === 0 ? (<>
                                          <Grid item xs={12}><Typography sx={{ color: 'grey', fontSize: 15, textAlign: 'center', marginTop: 2 }}>Todavía no hay buses asignados</Typography></Grid>
                                          {role === 'organizer' && <div className="d-flex justify-content-center w-100 mt-2"><div>
                                             <Button size="small" variant="outlined" onClick={() => { navigate('/wedding/info/' + id + '/1') }}>Añadir buses</Button>
                                          </div></div>}
                                       </>) : (<>
                                          {buses.filter(b => !b.direction).length > 0 &&
                                             <Grid item xs={12}><Typography sx={{ color: 'grey', fontSize: 13, marginLeft: 3 }}>IDA</Typography></Grid>
                                          }
                                          {buses.filter(b => !b.direction).map((bus, index) => (<>
                                             <Grid key={index} item xs={12} sx={{ padding: 2 }}>
                                                <Paper sx={{ width: '100%', padding: 1, paddingLeft: 3, display: 'flex', justifyContent: 'space-between' }}>
                                                   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                      <AirportShuttleIcon fontSize='large' className={bus.direction ? 'revertedBusIcon' : ''} />
                                                      <Typography fontWeight={'bold'}>{bus.departure}</Typography>
                                                      <Typography fontWeight={'bold'}>{bus.start} </Typography>
                                                      <ArrowRightAltIcon />
                                                      <Typography fontWeight={'bold'}>{bus.end} </Typography>
                                                   </Stack>
                                                </Paper>
                                             </Grid>
                                          </>))}
                                          {buses.filter(b => b.direction).length > 0 &&
                                             <Grid item xs={12}><Typography sx={{ color: 'grey', fontSize: 13, marginLeft: 3 }}>VUELTA</Typography></Grid>
                                          }
                                          {buses.filter(b => b.direction).map((bus, index) => (
                                             <Grid key={index} item xs={12} sx={{ padding: 2 }}>
                                                <Paper sx={{ width: '100%', padding: 1, paddingLeft: 3, display: 'flex', justifyContent: 'space-between' }}>
                                                   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ display: 'flex', alignItems: 'center' }}>
                                                      <AirportShuttleIcon fontSize='large' className={bus.direction ? 'revertedBusIcon' : ''} />
                                                      <Typography fontWeight={'bold'}>{bus.departure}</Typography>
                                                      <Typography fontWeight={'bold'}>{bus.start} </Typography>
                                                      <ArrowRightAltIcon />
                                                      <Typography fontWeight={'bold'}>{bus.end} </Typography>
                                                   </Stack>
                                                </Paper>
                                             </Grid>
                                          ))}
                                       </>)}
                                    </Grid>
                                 </Grid>
                              </Grid>
                           </Card>
                        </Grid>
                     ) : (<></>)}

                     {wedding.prewedding ? (
                        <Grid item xs={12}>
                           <Card>
                              <Grid container height={200}>
                                 <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Typography sx={{ fontSize: 25, textAlign: 'center' }}>Preboda</Typography>
                                    {prewedding.time === 'Invalid Date' || prewedding.location === '' ? (<>
                                       <Typography sx={{ color: 'grey', fontSize: 15, textAlign: 'center', marginTop: 2 }}>Todavía no hay información</Typography>
                                       {role === 'organizer' && <div className="d-flex justify-content-center w-100 mt-2"><div>
                                          <Button size="small" variant="outlined" onClick={() => { navigate('/wedding/info/' + id + '/1') }}>Añadir información</Button>
                                       </div></div>}
                                    </>) : (<>
                                       <h5 className="text-center">{prewedding.location}</h5>
                                       <p className="text-center">{prewedding.time}</p>
                                       <p className="text-center">¡Apúntate al confirmar la invitación!</p>
                                    </>)}
                                 </Grid>
                                 <Grid item xs={4}>
                                    <div id="imgPrewedding"></div>
                                 </Grid>
                              </Grid>
                           </Card>
                        </Grid>
                     ) : (<></>)}

                     <Grid item xs={12}>
                        <Card sx={{ padding: 3 }}>
                           <h3 className="text-center">
                              Lugar de la boda
                              <span className="fs-5"> ({wedding.location})</span>
                           </h3>
                           <Grid container sx={{ height: '330px', textAlign: 'center' }}>
                              <Grid item xs={6}>
                                 <h4>La ceremonia</h4>
                                 {wedding.ceremony ? (<>
                                    <p>{wedding.locationCeremony}</p>
                                    <div id='imgCeremony'></div>
                                 </>) : (<>
                                    <p>Boda civil</p>
                                    <div id='imgNoCeremony'></div>
                                 </>)}
                              </Grid>
                              <Grid item xs={6}>
                                 <h4>La fiesta</h4>
                                 <p>{wedding.locationParty}</p>
                                 <div id='imgParty'></div>
                              </Grid>
                           </Grid>
                        </Card>
                     </Grid>
                     {role === 'organizer' && wedding.infos.filter(i => i.enabled).length === 0 &&
                        <Grid item xs={12} sx={{ marginTop: 2, textAlign: 'center' }}>
                           <div className="d-flex justify-content-center w-100 mt-2"><div>
                              <Button size="small" variant="outlined" onClick={() => { navigate('/wedding/info/' + id + '/2') }}>Añadir información</Button>
                           </div></div>
                        </Grid>
                     }
                     {wedding.infos.filter(i => i.enabled).length > 0 &&
                        <Grid item xs={12} sx={{ marginTop: 2, textAlign: 'center' }}>
                           <Typography fontSize={25} sx={{ marginBottom: 3 }}>Además...</Typography>
                           <Grid container spacing={2} justifyContent={"center"}>
                              {wedding.infos.filter(i => i.enabled).map((i, index) => (
                                 <Grid key={index} item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'stretch' }}>
                                    <Grow in={true} easing={{ enter: 'linear' }}>
                                       <Paper sx={{ padding: 4, width: '-webkit-fill-available' }}>
                                          <h4>{i.title}</h4>
                                          <Divider sx={{ marginY: 3 }} />
                                          <p>{i.description}</p>
                                       </Paper>
                                    </Grow>
                                 </Grid>
                              ))}
                           </Grid>
                        </Grid>
                     }

                     {role === 'guestPending' && (<Grid item xs={12}>
                        <Card sx={{ padding: 3 }}>
                           {wedding.maxDateConfirmation !== null && (<>
                              {!canConfirm ? (
                                 <div className="text-center">
                                    <Typography fontSize={20} color={theme.palette.error.main}>La fecha de confirmación ya ha pasado</Typography>
                                 </div>
                              ) : (<>
                                 <div className="text-center">
                                    <h5>Por favor, confirma antes del
                                       <HourglassTopTwoToneIcon />
                                       {wedding.maxDateConfirmation}
                                       <HourglassBottomTwoToneIcon />
                                    </h5>
                                 </div>

                                 <div className="text-center d-flex justify-content-evenly mt-4">
                                    <Button variant="outlined" onClick={handleConfirmInvite}>Confirmar invitación</Button>
                                    {btnLoading ? (
                                       <SpinnerForm />
                                    ) : (
                                       <Button variant="outlined" color="error" onClick={() => setOpenConfirmation(true)}>Rechazar invitación</Button>
                                    )}
                                 </div>
                              </>)}
                           </>)}
                        </Card>
                     </Grid>)}
                     {role === 'guestConfirmed' && (
                        <Grid item xs={12}>
                           <Card sx={{ padding: 3 }}>
                              <Typography fontSize={20} className="text-center mb-4">¡Asistencia confirmada!</Typography>
                              {
                                 wedding.maxDateConfirmation !== null && canConfirm && (<>
                                    <div className="text-center">
                                       <h6>Si al final no puedes venir, por favor avísanos antes del
                                          <HourglassTopTwoToneIcon />
                                          {wedding.maxDateConfirmation}
                                          <HourglassBottomTwoToneIcon />
                                       </h6>
                                    </div>
                                 </>)
                              }
                              <div className="text-center mt-4">
                                 {btnLoading ? (
                                    <SpinnerForm />
                                 ) : (
                                    <Button variant="outlined" color="error" onClick={() => setOpenConfirmation(true)}>Cancelar invitación</Button>
                                 )}
                              </div>
                           </Card>
                        </Grid>
                     )}
                  </Grid>
               </Container >

               <ConfirmationDialog
                  open={openConfirmation}
                  handleRefuse={() => { setOpenConfirmation(false) }}
                  handleAccept={() => { handleCancelInvite() }}
                  title='¿Estás seguro de que quieres cancelar tu asistencia?'
                  message='No podrás volver a acceder a la sala de la boda.'
               />
            </>)
         }
      </ >
   </>)
}

export default MainPage