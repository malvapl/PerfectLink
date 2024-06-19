import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from "react-router-dom";
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from "react";
import SpinnerForm from "../SpinnerForm.tsx";
import InputAdornment from "@mui/material/InputAdornment";
import '../styles.css';
import Message from '../Message.tsx';
import theme from '../theme/theme.ts';

type FormValues = {
  name: string
  lastname: string
  email: string
  password: string
  password_confirmation: string
}

function Register() {

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate('/')
  }, [navigate])

  const emailDB = async (formdata: FormValues) => {
    const response = await fetch(
      `${import.meta.env.VITE_HOST}searchEmail/${formdata.email}`);

    const data = await response.json();
    console.log(data);
    if (data.response === 'yes') {
      setErrorEmailDB({ color: true, text: 'Este email ya está registrado' });
      return false;
    } else {
      registerUser(formdata);
      setErrorEmailDB({ color: false, text: '' });
    }
  }

  const registerUser = async (data: FormValues) => {
    console.log(data)
    setLoading(true);

    const result = await fetch(
      `${import.meta.env.VITE_HOST}registro`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

    const jsonData = await result.json();
    console.log(jsonData);

    if (result.ok) {
      setAlertMessage("Usuario registrado correctamente");
      setAlertVariant("success");
      setShowAlert(true);
      setTimeout(redirigir, 3000);
    } else {
      setAlertMessage("No se ha podido registrar el usuario");
      setAlertVariant("error");
      setLoading(false)
    }
  }

  const [erroremailDB, setErrorEmailDB] = useState({ color: false, text: '' });

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState<"error" | "info" | "success" | "warning">("info");
  const [alertMessage, setAlertMessage] = useState("");
  const [showPassword, setShowPassword] = useState({
    showPassword: false,
    showConfPassword: false
  });

  const { register, handleSubmit,
    formState: { errors, isDirty, isValid }, watch }
    = useForm<FormValues>({ mode: "onChange" })

  function redirigir() {
    navigate("/login");
  }

  const password = useRef({});
  password.current = watch("password", "");
  const validatePassword = (value: string) => {
    const confirmPassword = value.trim();
    if (confirmPassword !== password.current) return 'Las contraseñas no coinciden';
    return true;
  }


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    emailDB(data);
  }


  return (
    <div id='containerLoginRegister'>
      <Message showAlert={showAlert} color={alertVariant} message={alertMessage}
        setShowAlert={setShowAlert}
      />

      <Container className='boxRL' maxWidth="sm" sx={{
        boxShadow: 3,
        borderRadius: 2,
        p: 3,
        backgroundColor: theme.palette.background.default
      }}>
        <Typography variant='h2' fontFamily='DancingScript' className=" text-center fw-normal mb-4">Registro</Typography>

        <form className='mb-5' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                {...register('name', { required: 'Rellena este campo' })}
                fullWidth
                autoFocus={true}
                label="Nombre"
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('lastname', { required: 'Rellena este campo' })}
                fullWidth
                label="Apellidos"
                error={!!errors.lastname}
                helperText={errors.lastname ? errors.lastname.message : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('email', {
                  required: 'Rellena este campo',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Introduce un correo válido'
                  },
                  // validate: checkMail
                })}
                fullWidth
                label="Email"
                error={!!errors.email || erroremailDB.color}
                helperText={errors.email ? errors.email.message : '' || erroremailDB.text}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('password', {
                  required: 'Rellena este campo',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message: 'La contraseña debe tener al menos 8 caracteres e incluir mayúsculas y minúsculas'
                  }
                })}
                fullWidth
                type={showPassword.showPassword ? "text" : "password"}
                label="Contraseña"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <i
                        className={`fa-solid fa-eye${showPassword.showPassword ? "-slash" : ""
                          } d-flex justify-content-center align-items-center`}
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            showPassword: !showPassword.showPassword
                          })
                        }
                      ></i>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('password_confirmation', {
                  required: 'Rellena este campo',
                  validate: validatePassword
                })}
                fullWidth
                type={showPassword.showConfPassword ? "text" : "password"}
                label="Confirma la contraseña"
                error={!!errors.password_confirmation}
                helperText={errors.password_confirmation ? errors.password_confirmation.message : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <i
                        className={`fa-solid fa-eye${showPassword.showConfPassword ? "-slash" : ""
                          } d-flex justify-content-center align-items-center`}
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            showConfPassword: !showPassword.showConfPassword
                          })
                        }
                      ></i>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid className='text-center' item xs={12}>
              {loading ? (
                <SpinnerForm />
              ) : (
                <Button type="submit" variant="contained" color='primary' disabled={!isDirty || !isValid}>Registrarse</Button>
              )}
            </Grid>
          </Grid>
        </form>
        <hr />
        <p className='text-center mt-5'>Si ya tienes una cuenta, inicia sesión <a href='/login' style={{ color: theme.palette.primary.dark }}>aquí</a></p>
      </Container>
    </div>
  );
}

export default Register
