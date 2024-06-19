//import { useState } from 'react'
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { SubmitHandler, useForm } from "react-hook-form";
import SpinnerForm from "../SpinnerForm";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Message from '../Message';
import theme from '../theme/theme';

type FormValues = {
    email: string
    password: string
}


function LoginForm(props: { dialogLogin?: (open: boolean, action: 'join' | 'create' | '') => void, action?: 'join' | 'create' | '' }) {

    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState<"error" | "info" | "success" | "warning">("info");
    const [alertMessage, setAlertMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function redirigir() {
        window.dispatchEvent(new Event("storage"));
        navigate("/");
    }

    useEffect(()=>{
        if (localStorage.getItem("token")) navigate('/')
    }, [navigate])

    const { register, handleSubmit, reset,
        formState: { errors, isDirty, isValid } }
        = useForm<FormValues>({
            defaultValues: {
                email: "", password: ""
            },
            mode: "onChange"
        })

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoading(true);

        const result = await fetch(
            `${import.meta.env.VITE_HOST}login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

        const jsonData = await result.json();

        if (result.ok) {
            localStorage.setItem("token", JSON.stringify(jsonData.token));
            if (jsonData.wedding) {
                localStorage.setItem("hasOwnWedding", JSON.stringify(jsonData.wedding));
            }
            setAlertVariant("success");
            setAlertMessage("Usuario logeado");
            if (props.dialogLogin) {
                setShowAlert(true);
                setTimeout(() => {
                    window.dispatchEvent(new Event("storage"));
                    props.dialogLogin!(true, props.action!)
                }, 3000);
            } else {
                setShowAlert(true);
                setTimeout(redirigir, 3000);
            }
        } else {
            setAlertMessage("Usuario o contraseña incorrecta. Vuelve a intentarlo");
            setAlertVariant("error");
            setShowAlert(true);
            setLoading(false)
            reset();
        }
    }

    return (
        <div>
            <Message showAlert={showAlert} color={alertVariant} message={alertMessage}
                setShowAlert={setShowAlert}
            />

            <Container maxWidth="sm" sx={{
                boxShadow: 3,
                borderRadius: 2,
                p: 4,
                backgroundColor: theme.palette.background.default
            }}>
                <Typography variant='h2' fontFamily='DancingScript' className=" text-center fw-normal mb-4">Login</Typography>
                <form className='mb-5' onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                {...register('email', {
                                    required: 'Rellena este campo',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Introduce un correo válido'
                                    }
                                })}
                                fullWidth
                                autoFocus={true}
                                label="Email"
                                error={!!errors.email}
                                helperText={errors.email ? errors.email.message : ''}
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
                                type={showPassword ? "text" : "password"}
                                label="Contraseña"
                                error={!!errors.password}
                                helperText={errors.password ? errors.password.message : ''}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <i
                                                className={`fa-solid fa-eye${showPassword ? "-slash" : ""
                                                    } d-flex justify-content-center align-items-center`}
                                                onClick={
                                                    () => setShowPassword(!showPassword) // Toggle the showPassword state
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
                                <Button type="submit" variant="contained" color="primary" disabled={!isDirty || !isValid}>Iniciar sesión</Button>
                            )}
                        </Grid>
                    </Grid>
                </form>
                <hr />
                <p className='text-center mt-5'>¿Todavía no tienes una cuenta?, inicia sesión <a href='/register' style={{color: theme.palette.primary.dark}}>aquí</a></p>
            </Container>
        </div>
    );
}

export default LoginForm
