import { createTheme } from "@mui/material/styles";

const theme = createTheme({
   typography: {
      fontFamily: 'Quicksand, Courier',
   },
   palette: {
      primary: {
         main: '#4d515d',
         dark: '#202125',
         light: '#75777d'
      },
      secondary: {
         main: '#f1d4dc', // lightpink
         dark: '#e8d3ce', // lightbrown
         contrastText: '#b18b4d' // golden
      },
      error: {
         main: '#f47171',
      },
      warning: {
         main: '#f7c261',
      },
      info: {
         main: '#d7c9ca', // lightgrey
      },
      success: {
         main: '#aef1ae',
      },

      background: {
         default: '#F5F3F7'
      }
   }
});

export default theme;