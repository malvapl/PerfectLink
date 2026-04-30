import { useNavigate, useParams } from 'react-router-dom'
import List from './List'
import { useEffect, useState } from 'react'
import { Guest } from './List'
import Message from '../../Message'
import { Container, Paper } from '@mui/material'
import ConfirmationDialog from '../../ConfirmationDialog'
import GuestDialog from './GuestDialog'
import PropagateLoader from 'react-spinners/PropagateLoader'
import { useApi } from '../../hooks/useApi'

type ExtraData = {
   confirmed: number;
   bus: number | string;
   prewedding: number | string;
}
const AppGuests = () => {

   const api = useApi();
   const navigate = useNavigate()
   const { id } = useParams()
   const [loading, setLoading] = useState<boolean>(false);
   const [showAlert, setShowAlert] = useState(false);
   const [alertVariant, setAlertVariant] = useState<'error' | 'info' | 'success' | 'warning'>('info');
   const [alertMessage, setAlertMessage] = useState('');
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

      api.get(`userRole/${id}`)
         .then((result) => {
            if (result.data !== 'organizer' && result.data !== 'admin') {
               navigate('/')
            }
         })
         .catch((error) => {
            console.error(error)
         })

      api.get(`dataGuests/${id}`)
         .then((result) => {
            setExtraData({
               confirmed: result.confirmed,
               bus: result.bus,
               prewedding: result.prewedding,
            })
         })
         .catch((error) => {
            console.error(error)
            setLoading(false)
         })

      api.get(`guestGroups/${id}`)
         .then((result) => {
            setGroups(result.data)
         })
         .catch((error) => {
            console.error(error)
            setLoading(false)
         })

      api.get(`guests/${id}`)
         .then((result) => {
            setGuests(result.data)
            setLoading(false)
         })
         .catch((error) => {
            console.error(error)
            setLoading(false)
         })

   }, [id, navigate])

   const cancelInvite = async (idUser?: number) => {
      setOpenConfirmation(false)

      api.post(`removeGuests/${id}`, idUser ? { ids: [idUser] } : { ids })
         .then((result) => {
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
            setShowAlert(true);
            setAlertMessage('Ha ocurrido un error: ' + error)
            setAlertVariant('error')
         })
   }

   const updateGroup = async (guest: Guest) => {
      api.post(`updateGroup/${id}/${guest.id}`, { group: guest.group || null })
         .then((result) => {
            setAlertMessage('Grupo actualizado')
            setAlertVariant('success')
            setShowAlert(true)
            setGuests(guests.map((guest) => guest.id === result.id ? result : guest))
         })
         .catch((error) => {
            setShowAlert(true);
            setAlertMessage('Ha ocurrido un error: ' + error)
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