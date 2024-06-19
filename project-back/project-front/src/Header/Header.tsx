import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { NavLink, useNavigate } from "react-router-dom";
import theme from '../theme/theme';
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../images/home/logo.png';

const pages = [
   { name: 'Sala principal', route: 'wedding/' },
   { name: 'Editar', route: 'wedding/info/' },
   { name: 'Invitados', route: 'wedding/guests/' },
   { name: 'Mesas', route: 'wedding/tables/' },
];

const settingsAuth = [
   { name: 'Cerrar sesión', route: '/logout' }
];


const settingsNoAuth = [
   { name: 'Iniciar sesión', route: '/login' },
   { name: 'Registrarse', route: '/register' }
];

interface Wedding {
   id: string;
   spouse1: string;
   spouse2: string;
}

function Header() {

   const navigate = useNavigate();
   const [auth, setAuth] = useState(localStorage.getItem('token') !== null || false);
   const [token, setToken] = useState('');
   const [admin, setAdmin] = useState<boolean>(false)
   const [weddingsUser, setWeddingsUser] = useState<Wedding[]>([]);
   const [idWedding, setIdWedding] = useState(0);

   const [settings, setSettings] = useState<{ name: string; route: string; }[]>([]);

   useEffect(() => {
      setAdmin(false)
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
         method: "GET",
         headers: myHeaders,
         redirect: "follow"
      };

      window.addEventListener('storage', () => {
         setAdmin(false)
         setAuth(localStorage.getItem('token') !== null || false)
         const value = localStorage.getItem("token")
         if (typeof value === 'string') {
            setToken(JSON.parse(value))
         }
         getWeddings(requestOptions)
         checkAdmin(requestOptions)
         setIdWedding(parseInt(localStorage.getItem("hasOwnWedding") || '') || 0)
      })
      const value = localStorage.getItem("token")
      if (typeof value === 'string') {
         setToken(JSON.parse(value))
      }
      checkAdmin(requestOptions)
      getWeddings(requestOptions)
      setIdWedding(parseInt(localStorage.getItem("hasOwnWedding") || '') || 0)

   }, [token])

   useEffect(() => {
      setSettings(auth ? settingsAuth : settingsNoAuth)
   }, [auth])
   useEffect(() => {
      console.log('ADMIN', admin)
   }, [admin])


   const getWeddings = async (requestOptions: RequestInit) => {
      fetch(`${import.meta.env.VITE_HOST}users/weddings`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            setWeddingsUser(result.data);
         })
         .catch((error) => {
            console.log(error)
         })
   }

   const checkAdmin = async (requestOptions: RequestInit) => {
      fetch(`${import.meta.env.VITE_HOST}checkAdmin`, requestOptions)
         .then((response) => response.json())
         .then((result) => {
            setAdmin(result);
         })
         .catch((error) => {
            setAdmin(false)
            console.log(error)
         })
   }

   const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
   const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
   const [anchorElUserDropdown, setAnchorElUserDropdown] = useState<null | HTMLElement>(null);

   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNav(event.currentTarget);
   };

   const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
   };

   const handleOpenDropdown = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUserDropdown(event.currentTarget);
   };

   const handleCloseUserDropdown = () => {
      setAnchorElUserDropdown(null);
   };

   const handleCloseNavMenu = () => {
      setAnchorElNav(null);
   };

   const handleCloseUserMenu = () => {
      setAnchorElUser(null);
   };

   const drawerWidth = 240;
   const [openDrawer, setOpenDrawer] = useState(false);
   const handleDrawerToggle = () => {
      setOpenDrawer((prevState) => !prevState);
   };

   const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
         <div>
            <Typography variant="h6" sx={{ my: 2 }}>
               <IconButton><CloseIcon /></IconButton>
            </Typography>
            <Divider />

            {!!admin &&
               <List>
                  <Typography fontWeight={'bold'}>ADMIN</Typography>
                  <ListItem disablePadding>
                     <ListItemButton onClick={() => navigate('/adminWeddings')} sx={{ textAlign: 'left' }}>
                        <ListItemText primary={'Gestionar bodas'} />
                     </ListItemButton>
                  </ListItem>
               </List>
            }

            {idWedding !== 0 && (
               <List>
                  <Typography fontWeight={'bold'}>MI BODA</Typography>
                  {pages.map((page, index) => (
                     <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => navigate(page.route + idWedding)} sx={{ textAlign: 'left' }}>
                           <ListItemText primary={page.name} />
                        </ListItemButton>
                     </ListItem>
                  ))}
               </List>
            )}

            {auth && !admin &&
               <List>
                  <Typography fontWeight={'bold'}>INVITACIONES</Typography>
                  {weddingsUser?.length > 0 ? weddingsUser.map((w, index) => (
                     <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => navigate('/wedding/' + w.id)} sx={{ textAlign: 'left' }}>
                           <ListItemText primary={w.spouse1 + " y " + w.spouse2} />
                        </ListItemButton>
                     </ListItem>
                  )) : (
                     <ListItem disabled>
                        <h5 className="fs-5">No hay invitaciones</h5>
                     </ListItem>
                  )}
               </List>
            }
         </div>

         <List>
            {settings.map((page, index) => (
               <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => navigate(page.route + idWedding)} sx={{ textAlign: 'left' }}>
                     <ListItemText primary={page.name} />
                  </ListItemButton>
               </ListItem>
            ))}
         </List>

      </Box>
   )


   return (<>
      <AppBar position='absolute'
         sx={{
            // zIndex: 0,
            backgroundColor: theme.palette.background.default
         }}>
         <Toolbar className='justify-content-between'>
            <Box sx={{ display: 'flex' }}>
               <NavLink to={'/'} className='text-decoration-none text-black'>
                  <IconButton
                     sx={{ textTransform: 'none', paddingY: 1.5 }}
                  >
                     <img src={logo} />
                  </IconButton>
               </NavLink>
            </Box>
            <Box sx={{ flexGrow: -1, display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}>
               <IconButton onClick={() => handleDrawerToggle()}>
                  <MenuIcon fontSize='large' sx={{ color: theme.palette.primary.main }} />
               </IconButton>
            </Box>
            <Box sx={{ flexGrow: -1, display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>

               {!!auth && (<>
                  {admin ? (
                     <Box>
                        <Button
                           size="large"
                           aria-label="account of current user"
                           aria-controls="menu-appbar"
                           aria-haspopup="true"
                           onClick={() => navigate('/adminWeddings')}
                        >
                           Gestionar bodas
                        </Button>
                     </Box>
                  ) : (<> </>)}

                  {idWedding !== 0 && (
                     <Box>
                        <Button
                           size="large"
                           aria-label="account of current user"
                           aria-controls="menu-appbar"
                           aria-haspopup="true"
                           onClick={handleOpenNavMenu}
                        >
                           Mi boda
                        </Button>
                        <Menu
                           id="menu-appbar"
                           anchorEl={anchorElNav}
                           anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                           }}
                           keepMounted
                           transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                           }}
                           open={Boolean(anchorElNav)}
                           onClose={handleCloseNavMenu}
                           sx={{
                              display: { xs: 'block' },
                           }}
                        >
                           {pages.map((page) => (
                              <MenuItem key={page.name} onClick={() => {
                                 navigate(page.route + idWedding)
                                 handleCloseNavMenu()
                              }}>
                                 <h5 className="text-center">{page.name}</h5>
                              </MenuItem>
                           ))}
                        </Menu>
                     </Box>
                  )}

                  {!admin && <Button
                     size="large"
                     aria-label="account of current user"
                     aria-controls="menu-appbar"
                     aria-haspopup="true"
                     onClick={handleOpenDropdown}
                  >
                     Invitaciones
                  </Button>}
                  <Menu
                     open={Boolean(anchorElUserDropdown)}
                     onClose={handleCloseUserDropdown}
                     anchorEl={anchorElUserDropdown}
                     anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                     }}
                     keepMounted
                     transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                     }}
                  >
                     {weddingsUser?.length > 0 ? weddingsUser.map((w) => (
                        <MenuItem key={w.id} onClick={() => {
                           navigate('wedding/' + w.id)
                           handleCloseUserDropdown()
                        }}>
                           <h5 className="fs-5">{w.spouse1 + " y " + w.spouse2}</h5>
                        </MenuItem>
                     )) : (
                        <MenuItem disabled>
                           <h5 className="fs-5">No hay invitaciones</h5>
                        </MenuItem>
                     )}
                  </Menu>
               </>)}

               <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenUserMenu}
               >
                  <AccountCircleIcon fontSize='large' />
               </IconButton>
               <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                     vertical: 'top',
                     horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                     vertical: 'top',
                     horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
               >
                  {settings.map((s) => (
                     <MenuItem key={s.name} onClick={() => {
                        navigate(s.route)
                        handleCloseUserMenu();
                     }}>
                        <h5 className="fs-5">{s.name}</h5>
                     </MenuItem>
                  ))}
               </Menu>
               {/* <Box sx={{ display: { xs: 'none', md: 'flex' }, justifySelf: 'flex-end' }}>
                      <NavLink
                         to={'/login'}
                         className='text-decoration-none'
                      >
                         <Button
                            sx={{ display: 'block', color: 'black' }}
                         >
                            Iniciar sesión
                         </Button>
                      </NavLink>
                      <NavLink
                         to={'/register'}
                         className='text-decoration-none'
                      >
                         <Button
                            sx={{ display: 'block', color: 'black' }}
                         >
                            Registrarse
                         </Button>
                      </NavLink>
                   </Box> */}
            </Box>
         </Toolbar>
      </AppBar>
      <nav>
         <Drawer
            variant="temporary"
            open={openDrawer}
            anchor='right'
            onClose={handleDrawerToggle}
            ModalProps={{
               keepMounted: true,
            }}
            sx={{
               display: { xs: 'block', sm: 'none' },
               '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
         >
            {drawer}
         </Drawer>
      </nav>
   </>);
}
export default Header