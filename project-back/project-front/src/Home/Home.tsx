import { useNavigate } from "react-router-dom";
import Banner from "./Banner"
import CreateSection from "./CreateSection"
import JoinSection from "./JoinSection"
import '../styles.css';
import { Box, Card, Container, Dialog, Divider, Grid, Typography } from "@mui/material";
import { useState } from "react";
import LoginForm from "../User/LoginForm";
import theme from "../theme/theme";

const Home = () => {

  const navigate = useNavigate();

  const [showDialog, setShowDialog] = useState<{ open: boolean, action: 'join' | 'create' | '' }>({ open: false, action: '' });

  function returnLogin(open: boolean, action: 'join' | 'create' | '') {
    if (open) setShowDialog({ open: false, action: '' })
    if (action === 'create') {
      navigate('/createWedding')
    } else {
      navigate('/')
    }
  }

  return (
    <Box id='containerHome'>
      <Dialog
        id="dialogLogin"
        open={showDialog.open}
        onClose={() => setShowDialog({ open: false, action: '' })}
      >
        <LoginForm action={showDialog.action} dialogLogin={returnLogin} />
      </Dialog>

      <Banner />

      <Container maxWidth='lg'>
        <Grid container sx={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 5 }}>

          <Grid item xs={10} lg={5} sx={{ alignItems: 'stretch' }}>
            <Card sx={{ background: theme.palette.background.default, height: '100%', padding: 2 }}>
              <div className='d-flex justify-content-center mb-3'>
                <Typography fontSize={25}>¡ÚNETE A UNA SALA!</Typography>
              </div>
              <JoinSection
                message="Como invitado"
                role="Guest"
                setDialog={setShowDialog}
              />
              <Divider sx={{ marginY: 2 }} />
              <JoinSection
                message="Como organizador"
                role="Org"
                setDialog={setShowDialog}
              />
            </Card>
          </Grid>

          <Grid item xs={10} lg={5} sx={{ alignItems: 'stretch' }}>
            <Card sx={{ background: theme.palette.background.default, height: '100%', padding: 2 }}>
              <CreateSection setDialog={setShowDialog} />
            </Card>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}

export default Home