import { Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, Grid, IconButton, Stack, Switch, TextField } from "@mui/material";
import { Button } from "react-bootstrap";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { IBus } from "./Extras";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const BusDialog = (props: {
   open: boolean,
   bus?: IBus,
   handleClose: (d: IBus) => void,
   handleCancel: () => void
}) => {

   const [departure, setDeparture] = useState<dayjs.Dayjs>(dayjs().hour(12).minute(0))
   const [direction, setDirection] = useState(false)
   const [start, setStart] = useState('')
   const [end, setEnd] = useState('')

   useEffect(() => {
      if (props.bus) {
         setDeparture(dayjs(props.bus.departure, 'HH:mm'))
         setDirection(props.bus.direction)
         setStart(props.bus.start ? props.bus.start : '')
         setEnd(props.bus.end ? props.bus.end : '')
      }
   }, [props.bus])

   function resetValues() {
      setDeparture(dayjs().hour(12).minute(0))
      setDirection(false)
      setStart('')
      setEnd('')
   }

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      console.log({
         id: props.bus?.id,
         departure: departure.format('HH:mm'),
         direction: direction,
         start: start,
         end: end
      })
      props.handleClose({
         id: props.bus?.id,
         departure: departure.format('HH:mm'),
         direction: direction,
         start: start,
         end: end
      })
      resetValues();
   }

   return (
      <Dialog
         fullWidth
         maxWidth={"xs"}
         open={props.open}
         onClose={() => {
            resetValues()
            props.handleCancel
         }}
      >
         <DialogTitle className="d-flex justify-content-between align-items-center">
            Nuevo bus
            <IconButton onClick={props.handleCancel}>
               <CloseIcon />
            </IconButton>
         </DialogTitle>
         <form onSubmit={handleSubmit}>
            <DialogContent>
               <Grid container spacing={2}>
                  <Grid item xs={12}>
                     <Stack direction="row" spacing={1} alignItems="center">
                        <FormLabel>Ida</FormLabel>
                        <Switch checked={direction} onChange={() => setDirection(!direction)} />
                        <FormLabel>Vuelta</FormLabel>
                     </Stack>
                  </Grid>
                  <Grid item xs={12}>
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                           label="Salida"
                           value={departure}
                           onChange={(e) => setDeparture(dayjs(e))}
                           ampm={false}
                           slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        size="small"
                        label="Lugar de salida"
                        value={start}
                        required
                        onChange={(e) => setStart(e.target.value)}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        size="small"
                        label="Lugar de salida"
                        value={end}
                        required
                        onChange={(e) => setEnd(e.target.value)}
                     />
                  </Grid>
               </Grid>
            </DialogContent>
            <DialogActions>
               <Button variant="secondary" type="submit">{props.bus ? 'Editar' : 'Añadir'}</Button>
            </DialogActions>
         </form>
      </Dialog >
   )
}

export default BusDialog