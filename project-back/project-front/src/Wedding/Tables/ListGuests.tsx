import { Divider, Drawer, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IGuest } from "./SpaceTables";
import { useEffect, useState } from "react";
import theme from "../../theme/theme";

interface GroupedGuests {
   group: string;
   guests: IGuest[];
}

const drawerWidth = 300;
const ListGuests = (props: {
   guests: IGuest[],
   groups: string[],
   handlePlaceGuest: (guest: IGuest) => void
}) => {

   const [groupedGuests, setGroupedGuests] = useState<GroupedGuests[]>([])

   useEffect(() => {
      console.log(props.guests)
      setGroupedGuests([])
      props.groups.map(group => {
         setGroupedGuests(gg => [...gg, {
            group: group,
            guests: group === 'Sin asignar' ? props.guests.filter(guest => guest.group === null)
               : props.guests.filter(guest => guest.group === group)
         }])
      })
   }, [props.groups, props.guests])

   return (
      <Drawer
         sx={{
            width: drawerWidth,
            flexShrink: 0,
            zIndex: 1,
            position: 'absolute',
            '& .MuiDrawer-paper': {
               width: drawerWidth,
               boxSizing: 'border-box',
               paddingTop: '75px',
               boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.25)',
               background: theme.palette.background.default,
            },
         }}
         variant="permanent"
         anchor="left"
      >
         <h2 className="text-center">Invitados</h2>
         <h5 className="text-center">(confirmados)</h5>
         {props.guests.length === 0 ? (<>
         <div>
            <Typography sx={{marginTop: 3, textAlign: 'center'}}>No hay invitados</Typography>
         </div>
         </>) : (<List>
            {groupedGuests.filter(gg => gg.guests.length > 0).map(gg => (
               <div key={gg.group}>
                  <Divider variant="fullWidth" />
                  <ListItemText
                     sx={{ marginLeft: 1 }}
                     secondary={gg.group}
                  />
                  <Divider variant="fullWidth" />
                  {gg.guests.map((guest, index) => (
                     <ListItem
                        key={index}
                        secondaryAction={
                           <Tooltip title="Colocar" placement="right">
                              <IconButton edge="end" aria-label="add"
                                 onClick={() => props.handlePlaceGuest({ ...guest, numSeat: -1 })}>
                                 <ArrowForwardIosIcon fontSize="small" />
                              </IconButton>
                           </Tooltip>
                        }
                     >
                        <div className="d-flex flex-column justify-content-center">
                           <ListItemText
                              primary={guest.name}
                           />
                           {guest.plusOne &&
                              <ListItemText
                                 secondary={'(+1) ' + guest.plusOne}
                              />
                           }
                        </div>
                     </ListItem>
                  ))}
               </div>
            ))}
         </List>)
         }
      </Drawer >
   )
}

export default ListGuests