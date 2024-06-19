// import { useScrollTrigger } from '@mui/material';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateSection = (props: { setDialog: (a : { open: boolean, action: 'join' | 'create' | '' }) => void }) => {

  const navigate = useNavigate();
  const auth = localStorage.getItem('token') !== null || false;

  const handleCreate = () => {
    if (auth) {
      navigate('/createWedding')
    } else {
      props.setDialog({open: true, action: 'create'})
    }
  }

  return (<>
      <div className='d-flex justify-content-center mb-3'>
        <Typography fontSize={25}>¡CREA UNA SALA PARA TU BODA!</Typography>
      </div>
      <div className='d-flex justify-content-center align-items-end h-50'>
        <Button onClick={handleCreate} id='joinWedding' color='primary' variant='contained'>Empezar</Button>
      </div>
      {/* <Stack>
        <Paper className='mb-3 row my-3'>
          <div className='col-6 text-center p-4'>
            <h4><i className="fa-solid fa-users"></i> GESTIONA TUS INVITADOS</h4>
            <p className='fs-5'>Desde la lista inicial hasta las confirmaciones de asistencia, lleva el control total de tus invitados de manera sencilla y eficiente. ¡Personaliza cada detalle y mantén a todos informados!</p>
          </div>
          <div className='col-6'>
            <img src="" alt="" />
          </div>
        </Paper>
        <Paper className='mb-3 row my-3'>
          <div className='col-6'>
            <img src="../images/home/guests.jpg" alt="" />
          </div>
          <div className='col-6 text-center p-4'>
            <h4>ORGANIZA LAS MESAS <i className="fa-solid fa-sitemap"></i></h4>
            <p className='fs-5'>Dale forma a tu evento de ensueño con nuestra herramienta intuitiva de organización de mesas. Arrastra y suelta para crear la disposición perfecta y asegúrate de que cada invitado se sienta en el lugar adecuado.</p>
          </div>
        </Paper>
        <Paper className='mb-3 row my-3'>
          <div className='col-6 text-center p-4'>
            <h4><i className="fa-regular fa-calendar-days"></i> GUARDA Y COMPARTE LA INFORMACIÓN ESENCIAL</h4>
            <p className='fs-5'>Guarda todos los detalles importantes de tu boda en un solo lugar seguro y accede a ellos en cualquier momento. Desde direcciones hasta preferencias de comida, comparte la información esencial con tu familia y amigos con facilidad.</p>
          </div>
          <div className='col-6'>
            <img src="" alt="" />
          </div>
        </Paper>
      </Stack> */}
  </>)
}

export default CreateSection