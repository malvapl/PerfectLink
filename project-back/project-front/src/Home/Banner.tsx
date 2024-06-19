import { Typography } from '@mui/material';
import '../styles.css';
// import logo from '../images/home/logo.png';
import theme from '../theme/theme';

const Banner = () => {

  return (
    <div id='banner'>
      <div className='d-flex h-100 align-items-center'>
        <Typography
          fontSize={70}
          fontFamily={'DancingScript'}
          color={theme.palette.primary.main}
          sx={{ textAlign: 'center', backgroundColor: '#f5f3f77a', width: '100%' }}
        >
          {/* <img src={logo} width={200} height={100} style={{ opacity: .7, marginRight: 20 }} /> */}
          PerfectLink
          {/* <img src={logo} width={200} height={100} style={{ transform: 'scaleX(-1)', opacity: .7, marginLeft: 20 }} /> */}
        </Typography>
      </div>
    </div>
  )
}

export default Banner