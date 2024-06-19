import { Container, Paper } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Spinner } from "react-bootstrap";
import theme from "../theme/theme";


const Logout = () => {

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("hasOwnWedding");
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, [navigate])

  return (
    <Container maxWidth='md'>
      <Paper className="text-center m-5 p-3" sx={{ bgcolor: theme.palette.background.default }}>
        <CheckCircleOutlinedIcon fontSize="large" />
        <h1>Has cerrado sesión</h1>
        <h4>¡Vuelve pronto!</h4>
        <div className="d-flex justify-content-center align-items-center">
          Redirigiendo...<Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
            className="m-4"
          />
        </div>
      </Paper>
    </Container>
  )
}

export default Logout