import { IWedding } from './ListWeddings'
import { Accordion, AccordionDetails, AccordionSummary, Button, Menu, MenuItem, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ConfirmationDialog from '../ConfirmationDialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const pages = [
   { name: 'Sala principal', route: '/wedding/' },
   { name: 'Editar', route: '/wedding/info/' },
   { name: 'Invitados', route: '/wedding/guests/' },
   { name: 'Mesas', route: '/wedding/tables/' },
];

const Wedding = (props: { wedding: IWedding, deleteWedding: (id: number) => void }) => {

   const navigate = useNavigate()
   const [openConfirmation, setOpenConfirmation] = useState(false)
   const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

   const handleDelete = () => {
      setOpenConfirmation(true)
   }


   return (<>
      <Accordion>
         <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
         >
            <Typography sx={{ width: '45%' }}>{props.wedding.id} - {props.wedding.spouse1} & {props.wedding.spouse2}</Typography>
            <Typography sx={{ width: '50%', paddingRight: 5, color: 'text.secondary' }}>{props.wedding.date}</Typography>
         </AccordionSummary>
         <AccordionDetails className='row'>
            <div className='col-5'>
               <Typography>
                  Código organizador: {props.wedding.codeOrg}
               </Typography>
               <Typography>
                  Código invitado: {props.wedding.codeGuest}
               </Typography>
               <Typography>
                  Ubicacaión: {props.wedding.location}
               </Typography>
               <Typography>
                  Boda religiosa: {props.wedding.ceremony ? 'Sí' : 'No'}
               </Typography>
               <Typography>
                  Número de invitados: {props.wedding.numGuests}
               </Typography>
            </div>
            <div className="col-5 d-flex align-items-center">
               <Typography>
                  {new Date().getTime() < new Date(props.wedding.date).getTime() ? 'Sin completar' : 'Completada'}
               </Typography>
            </div>
            <div className="col-2 d-flex justify-content-center flex-column gap-3 pe-5">
               <Button variant='outlined' size='small'
                  onClick={(e) => setAnchorElNav(e.currentTarget)}
               >Ver</Button>
               <Menu
                  open={Boolean(anchorElNav)}
                  anchorEl={anchorElNav}
                  onClose={() => setAnchorElNav(null)}
                  anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'left',
                  }}
                  transformOrigin={{
                     vertical: 'top',
                     horizontal: 'left',
                  }}>
                  {pages.map((page) => (
                     <MenuItem key={page.name} onClick={() => {
                        navigate(page.route + props.wedding.id)
                        setAnchorElNav(null)
                     }}>
                        <h5 className="text-center">{page.name}</h5>
                     </MenuItem>
                  ))}
               </Menu>
               <Button variant='outlined' size='small' color='error' onClick={handleDelete}>Eliminar</Button>
            </div>
         </AccordionDetails>
      </Accordion >


      <ConfirmationDialog
         open={openConfirmation}
         handleAccept={() => props.deleteWedding(props.wedding.id)}
         handleRefuse={() => setOpenConfirmation(false)}
         title='¿Seguro que quieres eliminar esta boda?'
      />
   </>)
}

export default Wedding