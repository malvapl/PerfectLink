import { Container } from "@mui/material";
import Message from "../Message";
import PropagateLoader from "react-spinners/PropagateLoader";
import { useEffect, useState } from "react";
import Wedding from "./Wedding";
import { useNavigate } from "react-router-dom";

export interface IWedding {
   id: number;
   codeOrg: string;
   codeGuest: string;
   spouse1: string;
   spouse2: string;
   date: string;
   location: string;
   numGuests: number;
   ceremony: number;
}


const ListWeddings = () => {

   const navigate = useNavigate()
   const [loading, setLoading] = useState<boolean>(false);
   const [showAlert, setShowAlert] = useState(false);
   const [alertVariant, setAlertVariant] = useState<"error" | "info" | "success" | "warning">("info");
   const [alertMessage, setAlertMessage] = useState("");

   const [weddings, setWeddings] = useState<IWedding[]>([])

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

      fetch(`${import.meta.env.VITE_HOST}checkAdmin`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            if (!result) navigate('/')
         })
         .catch((error) => {
            console.log(error)
         })

      fetch(`${import.meta.env.VITE_HOST}weddings`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            console.log(result)
            setWeddings(result.data)
            setLoading(false)
         })
         .catch(() => {
            console.log('error: boda no encontrada')
            setLoading(false)
         })

   }, [navigate])

   const deleteWedding = async (weddingId: number) => {
      const token = JSON.parse(localStorage.getItem("token") || '');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
         method: "DELETE",
         headers: myHeaders,
         redirect: "follow"
      }
      fetch(`${import.meta.env.VITE_HOST}weddings/${weddingId}`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            setWeddings(weddings.filter(w => w.id !== result.id))
            localStorage.removeItem("hasOwnWedding");
            window.dispatchEvent(new Event("storage"));
            setAlertMessage('Boda eliminada')
            setAlertVariant('success')
            setShowAlert(true)
         })
         .catch((error) => {
            console.log('error', error)
            setShowAlert(true);
            setAlertMessage('Ha ocurrido un error')
            setAlertVariant('error')
         })
   }

   // const deleteOrganizer = async (weddingId: number) => {
   //    fetch(`${import.meta.env.VITE_HOST}weddings/${weddingId}`, requestOptions)
   //       .then((response) => response.json())
   //       .then((result) => {
   //          window.dispatchEvent(new StorageEvent("create-wedding"));
   //          setWeddings(weddings.filter(w => w.id !== result.id))
   //          setAlertMessage('Boda eliminada')
   //          setAlertVariant('success')
   //          setShowAlert(true)
   //       })
   //       .catch((error) => {
   //          console.log('error', error)
   //          setShowAlert(true);
   //          setAlertMessage('Ha ocurrido un error')
   //          setAlertVariant('error')
   //       })
   // }

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

            <Container maxWidth={'md'} sx={{
               borderRadius: 2,
               p: 3,
            }}>
               {weddings.map((wedding, index) => <Wedding key={index} wedding={wedding} deleteWedding={deleteWedding} />)}
            </Container>
         </>)
      }

   </>)
}

export default ListWeddings