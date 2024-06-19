import { useNavigate, useParams } from "react-router-dom"
import List from "./List"
import { useEffect, useState } from "react"
import { Guest } from "./List"
import Message from "../../Message"
import { Container, Paper } from "@mui/material"
import ConfirmationDialog from "../../ConfirmationDialog"
import GuestDialog from "./GuestDialog"
import PropagateLoader from "react-spinners/PropagateLoader"

type ExtraData = {
   confirmed: number;
   bus: number | string;
   prewedding: number | string;
}
const AppGuests = () => {

   const navigate = useNavigate()
   const { id } = useParams()
   const [loading, setLoading] = useState<boolean>(false);
   const [showAlert, setShowAlert] = useState(false);
   const [alertVariant, setAlertVariant] = useState<"error" | "info" | "success" | "warning">("info");
   const [alertMessage, setAlertMessage] = useState("");
   const [openConfirmation, setOpenConfirmation] = useState(false)

   const [guests, setGuests] = useState<Guest[]>([])
   const [guest, setGuest] = useState<Guest>()
   const [groups, setGroups] = useState<string[]>([])
   const [extraData, setExtraData] = useState<ExtraData>({
      confirmed: 0,
      bus: 'none',
      prewedding: 'none'
   })
   const [ids, setIds] = useState<number[]>([])

   //TODO filtrar por grupo

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
      fetch(`${import.meta.env.VITE_HOST}dataGuests/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            setExtraData({
               confirmed: result.confirmed,
               bus: result.bus,
               prewedding: result.prewedding,
            })
            // setLoading(false)
         })
         .catch(() => {
            console.log('error: boda no encontrada')
            setLoading(false)
         })
      fetch(`${import.meta.env.VITE_HOST}guestGroups/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            setGroups(result)
            // setLoading(false)
         })
         .catch(() => {
            console.log('error: boda no encontrada')
            setLoading(false)
         })
      fetch(`${import.meta.env.VITE_HOST}guests/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            console.log(result.data)
            setGuests(result.data)
            setLoading(false)
         })
         .catch(() => {
            console.log('error: boda no encontrada')
            setLoading(false)
         })

   }, [id, navigate])

   const cancelInvite = async (idUser?: number) => {
      setOpenConfirmation(false)
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = idUser ? JSON.stringify({ ids: [idUser] }) : JSON.stringify({ ids });
      const requestOptions: RequestInit = {
         method: "POST",
         headers: myHeaders,
         body: raw,
         redirect: "follow"
      }
      console.log(raw)
      fetch(`${import.meta.env.VITE_HOST}removeGuests/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            console.log(result)
            setIds([])
            setAlertMessage('Invitaciones canceladas')
            setAlertVariant('success')
            setShowAlert(true)
            if (idUser) {
               setGuests(guests.filter((g) => g.id !== idUser))
            } else {
               setGuests(guests.filter((g) => !ids.includes(g.id)))
            }
         })
         .catch((error) => {
            console.log('error', error)
            setShowAlert(true);
            setAlertMessage('Ha ocurrido un error')
            setAlertVariant('error')
         })
   }

   const updateGroup = async (guest: Guest) => {
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);
      console.log(guest)
      console.log(guest.group)
      const raw = JSON.stringify({ group: guest.group || null });
      const requestOptions: RequestInit = {
         method: "POST",
         headers: myHeaders,
         body: raw,
         redirect: "follow"
      }
      console.log(raw)
      fetch(`${import.meta.env.VITE_HOST}updateGroup/${id}/${guest.id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            console.log(result)
            setAlertMessage('Grupo actualizado')
            setAlertVariant('success')
            setShowAlert(true)
            setGuests(guests.map((guest) => guest.id === result.id ? result : guest))
         })
         .catch((error) => {
            console.log('error', error)
            setShowAlert(true);
            setAlertMessage('Ha ocurrido un error')
            setAlertVariant('error')
         })
   }

   const handleCancelInvite = (selected: number[]) => {
      setOpenConfirmation(true)
      setIds(selected)
   }

   return (<>
      {loading ?
         <PropagateLoader
            color={'grey'}
            loading={true}
            cssOverride={{ display: 'flex', marginTop: '30%', justifyContent: 'center' }}
            size={30}
         /> : (<>

            <Message showAlert={showAlert} color={alertVariant} message={alertMessage}
               setShowAlert={setShowAlert}
            />

            <Container maxWidth={'lg'} sx={{
               borderRadius: 2,
               p: 3
            }}>
               <List
                  guests={guests}
                  groups={groups}
                  setGuest={setGuest}
                  handleCancelInvite={handleCancelInvite}
                  bus={extraData.bus !== 'none'}
                  prewedding={extraData.prewedding !== 'none'}
               />

               <Paper className="p-4">
                  <div className="d-flex flex-column gap-3 align-items-center">
                     <div>Total confirmados: {extraData.confirmed}</div>
                     {extraData.bus !== 'none' && <div>Total bus: {extraData.bus}</div>}
                     {extraData.prewedding !== 'none' && <div>Total preboda: {extraData.prewedding}</div>}
                  </div>
               </Paper>
            </Container >

            <GuestDialog
               guest={guest}
               groups={groups}
               open={guest !== undefined}
               handleCancel={() => setGuest(undefined)}
               handleClose={(g: Guest) => {
                  console.log(g)
                  updateGroup(g)
                  setGuest(undefined)
               }}
               handleCancelInvite={(id: number) => {
                  setGuest(undefined)
                  cancelInvite(id)
               }}
            />

            <ConfirmationDialog
               open={openConfirmation}
               handleAccept={cancelInvite}
               handleRefuse={() => setOpenConfirmation(false)}
               title='¿Seguro que quieres cancelar estas invitaciones?'
               message='Los invitados seleccionados no podrán entrar a la sala de la boda'
            />
         </>)}
   </>)
}

export default AppGuests