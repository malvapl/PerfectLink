import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material"
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const ControlPanel = (props: {
   handleSave: () => void,
   handleAddTable: () => void,
}) => {


   const actions = [
      {
         icon: <AddCircleIcon />,
         name: 'Añadir mesa',
         action: () => { props.handleAddTable() }
      },
      {
         icon: <SaveIcon />,
         name: 'Guardar',
         action: () => { props.handleSave() }
      },
      // {
      //    icon: <SaveIcon />,
      //    name: 'Mostrar invitados',
      //    action: () => { },
      //    nameSecondary: 'Ocultar invitados',
      //    actionSecondary: () => { }
      // },
   ];

   return (
      <Box sx={{
         position: "absolute",
         zIndex: 100,
         right: '0px',
         bgcolor: 'grey'
      }}>
         <SpeedDial
            ariaLabel="Acciones"
            sx={{
               position: 'absolute',
               bottom: 16,
               right: 16,
            }}
            icon={<SpeedDialIcon />}
            FabProps={{
               sx: {
                  bgcolor: 'grey',
                  '&:hover': {
                     bgcolor: 'darkgrey',
                  }
               }
            }}
         >
            {actions.map((action) => (
               <SpeedDialAction
                  sx={{
                     width: 'fit-content',
                     '& .MuiSpeedDialAction-staticTooltipLabel': {
                        width: 'max-content',
                     }
                  }}
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  tooltipOpen
                  onClick={action.action}
               />
            ))}
         </SpeedDial>
      </Box>
   )
}

export default ControlPanel