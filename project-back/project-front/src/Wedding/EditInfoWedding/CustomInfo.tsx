import { Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Button, Divider } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Card } from 'react-bootstrap'
import AddBoxIcon from '@mui/icons-material/AddBox';
import InfoCardDialog from './InfoCardDialog';
import InfoCard from "./InfoCard"
import { InfoExtra } from './AppInfo';
import { useParams } from 'react-router-dom';


export interface OptionCardData {
   id: number,
   title: string,
   subtitle: string,
   description: string,
   delete: boolean,
   enabled: boolean,
}


const CustomInfo = (props: {
   info: InfoExtra[],
   setShowAlert: (a: boolean) => void,
   setAlertVariant: (a: "error" | "info" | "success" | "warning") => void,
   setAlertMessage: (a: string) => void
}) => {

   const { id } = useParams();

   const [cards, setCards] = useState<OptionCardData[]>([])
   const [checked, setChecked] = useState<number[]>([]);

   const [height, setHeight] = useState<number | undefined>(0);
   const observedDiv = useRef<HTMLInputElement>(null);
   useEffect(() => {
      const token = JSON.parse(localStorage.getItem("token") || '')
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      if (!observedDiv.current) {
         return;
      }

      const resizeObserver = new ResizeObserver(() => {
         setHeight(observedDiv.current?.offsetHeight);
      });

      resizeObserver.observe(observedDiv.current);

      return function cleanup() {
         resizeObserver.disconnect();
      }
   }, [])


   useEffect(() => {
      setCards(props.info.map((i) => {
         const fixed = (i.subtitle === '' || i.subtitle === null) ? false : true;
         return { id: i.id, title: i.title, subtitle: i.subtitle, description: i.description, delete: !fixed, enabled: i.enabled }
      }))
      setChecked(props.info.filter((i) => i.enabled).map((i) => i.id))
   }, [props.info])

   const handleToggle = (id: number) => () => {
      const currentIndex = checked.indexOf(id);

      if (currentIndex === -1) {
         setChecked([...checked, id])
         setCards(cards.map(c => c.id === id ? { ...c, enabled: true } : c))
      } else {
         setChecked(c => c.filter(i => i !== id))
         setCards(cards.map(c => c.id === id ? { ...c, enabled: false } : c))
      }
   }

   const handleSave = async () => {
      const token = JSON.parse(localStorage.getItem("token") || '')
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);
      cards.forEach(card => {
         const raw = JSON.stringify(card);
         const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
         }
         fetch(`${import.meta.env.VITE_HOST}wedding/extraCards/${id}`, requestOptions)
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
            })
      })
   }

   const handleSaveCard = async (card: { title: string, description: string }) => {
      const token = JSON.parse(localStorage.getItem("token") || '')
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);
      const raw = JSON.stringify({ ...card, subtitle: "", delete: true, enabled: true });
      const requestOptions: RequestInit = {
         method: "POST",
         headers: myHeaders,
         body: raw,
         redirect: "follow"
      }
      fetch(`${import.meta.env.VITE_HOST}wedding/extraCard/${id}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            setCards([...cards, result.data])
            setChecked([...checked, result.data.id])
            setOpen(false);
            props.setAlertMessage('Tarjeta añadida')
            props.setAlertVariant('success')
            props.setShowAlert(true)
         })
         .catch((error) => {
            console.log('error', error)
            props.setShowAlert(true);
            props.setAlertMessage('No se ha podido añadir')
            props.setAlertVariant('error')
         })
   }

   const [open, setOpen] = useState(false);

   function handleAddCards() {
      setOpen(true);
   }


   const handleDelete = (id: number) => {
      setChecked(c => c.filter(i => i !== id))
      setCards(cards.map(c => c.id === id ? { ...c, enabled: false, subtitle: 'delete' } : c))

   }

   const handleCancel = () => {
      setOpen(false)
   }

   const handleEdit = (data: OptionCardData) => {
      setCards(cards.map(c => c.id === data.id ? { ...c, title: data.title, description: data.description } : c))
   }

   return (
      <Grid container spacing={2} sx={{
         borderRadius: 2,
         p: 2
      }}>
         <Grid ref={observedDiv} item xs={12} md={6}>
            <Card>
               <Card.Header className='text-center'>
                  Añadidos
               </Card.Header>
               <Card.Body>
                  <Card.Text className='fs-6 text-center'>
                     Estas son algunas de las opciones más comunes que puede tener vuestra boda.
                     Selecciónalas para añadirlas a la página principal.
                  </Card.Text>
                  <List>
                     {cards.map((option) => {
                        if (option.subtitle !== 'delete') {
                           return (
                              <ListItem
                                 key={option.id}
                                 disablePadding
                              >
                                 <ListItemButton role={undefined} dense>
                                    <ListItemIcon>
                                       <Checkbox
                                          edge="start"
                                          onChange={handleToggle(option.id)}
                                          checked={checked.indexOf(option.id) !== -1}
                                          tabIndex={-1}
                                          disableRipple
                                       />
                                    </ListItemIcon>
                                    <ListItemText id={option.title} primary={option.title} secondary={option.subtitle} />
                                    {option.delete && (
                                       <Button variant='text' size='small' onClick={() => handleDelete(option.id)}>Eliminar</Button>
                                    )}
                                 </ListItemButton>
                              </ListItem>
                           )
                        }
                     })}
                     <Divider className="my-4" />
                     <ListItem
                        disablePadding
                     >
                        <ListItemButton role={undefined} dense onClick={handleAddCards}>
                           <AddBoxIcon className='me-4' />
                           <ListItemText primary={'Otro'} secondary={'También puedes crear tus propias tarjetas con la información que quieras compartir.'} />
                        </ListItemButton>
                     </ListItem>
                  </List>
               </Card.Body>
            </Card>
         </Grid>

         <Grid item xs={12} md={6} sx={{ height: { md: height, xs: 'auto' }, overflowY: { md: 'scroll', xs: 'none' }, marginTop: { md: 0, xs: 5 } }}>
            {cards.map((card) => {
               if (card.enabled) {
                  return (
                     <InfoCard key={card.id} data={card} handleEdit={handleEdit} />
                  )
               }
            }
            )}
         </Grid>

         <Grid item xs={12}>
            <div className='d-flex flex-column text-center'>
               <div><Button variant='contained' onClick={handleSave}>Guardar</Button></div>
            </div>
         </Grid>


         <InfoCardDialog open={open} handleClose={handleSaveCard} handleCancel={handleCancel} />
      </Grid>
   )
}

export default CustomInfo