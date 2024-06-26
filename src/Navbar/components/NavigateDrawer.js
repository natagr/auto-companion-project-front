import React, {useState} from 'react'

import {
  ListItemIcon,
  ListItemText,
  Divider,
  List,
  ListItemButton,
  ListItem,
  Box,
  Drawer,
  Avatar
} from "@mui/material";

import {
  Home,
  Garage,
  CalendarMonth,
  CarCrash,
  Percent,
  Logout,

} from "@mui/icons-material"
import carImage from '../../pages/components/images/car.png';


import { getUserId, request, setAuthHeader, IsLogged } from '../../helpers/axios_helper';

import { useTheme } from "@mui/material/styles";
import { useLanguage } from '../../context/LanguageContext';

import { useNavigate } from "react-router-dom";

import avatar from "../../images/avatar.png"
import DrawerHeader from './DrawerHeader';


const NavigateDrawer = ({ open, handleDrawerOpen }) => {
  const theme = useTheme();
  const { language } = useLanguage();

  const navigate = useNavigate()
  const drawerWidth = 280;
  const miniDrawerWidth = 65;

  // const icons = [<Home />, <Garage />, <CalendarMonth />
  //   // , <CarCrash />, <Percent />
  // ];
  // const labels = {
  //   uk: ['Головна', 'Гараж', 'Календар', 'Помилки', 'Акції'],
  //   en: ['Home', 'Garage', 'Calendar', 'Bugs', 'Promotions'],
  // };
  // const links = [
  //   '',
  //   'garage',
  //   'calendar',
  //   'bugs',
  //   'promotions'
  // ]
  const iconsBase = [<Home />]; // Базовые иконки, доступные всем пользователям
  const labelsBase = {
    uk: ['Головна'],
    en: ['Home'],
  };
  const linksBase = [''];

  const iconsAuth = [<Garage />, <CalendarMonth />]; // Иконки для аутентифицированных пользователей
  const labelsAuth = {
    uk: ['Гараж', 'Календар'],
    en: ['Garage', 'Calendar'],
  };
  const linksAuth = ['garage', 'calendar'];
  const [isLoading, setIsLoading] = React.useState(false);
  // Объединяем базовые иконки с иконками для аутентифицированных пользователей, если пользователь вошел в систему
  const isUserLogged = IsLogged();
  const icons = isUserLogged ? iconsBase.concat(iconsAuth) : iconsBase;
  const labels = isUserLogged ? {
    uk: labelsBase.uk.concat(labelsAuth.uk),
    en: labelsBase.en.concat(labelsAuth.en),
  } : labelsBase;
  const links = isUserLogged ? linksBase.concat(linksAuth) : linksBase;

  const [user, setUser] = useState([]);
  const getUser = () => {
    request("GET", "/users", {}).then(
        (response) => {
          setUser(response.data)
        }).catch((error) => {
      console.log(error);
      setIsLoading(false); // Обробка помилки

    });
  };

  React.useEffect(() => {
    setIsLoading(true);

    getUser();
  }, []);


  // const userData = {
  //   name: 'Pavlo Her',
  //   email: 'pavlo@gmail.com',
  //   avatar: avatar
  // }

  const content = {
    uk: {
      exit: 'Вийти'
    },
    en: {
      exit: 'Log out'
    }

  }

  const ListItemStyled = ({ click, style, primary, children, secondary }) => {
    return (
      <ListItem key={primary} disablePadding sx={{ height: '48px' }}>
        <ListItemButton onClick={click}>
          <ListItemIcon style={style}>
            {children}
          </ListItemIcon>
          <ListItemText primary={primary} style={style} secondary={secondary}
            sx={{
              '& .css-83ijpv-MuiTypography-root': {
                color: theme.palette.secondary.main
              }
            }} />
        </ListItemButton>
      </ListItem>
    )
  }
  const firstPathSegment = window.location.href.split('/')[3];

  const drawer = (
    <div>
      {open &&
        <DrawerHeader click={handleDrawerOpen} />
      }
      <Divider />
      <List>
        {

          icons.map((icon, index) => (
            <ListItemStyled key={index} click={() => navigate('/' + links[index])}
              style={{ color: links[index] === firstPathSegment ? theme.palette.primary.main : theme.palette.secondary.main }}
              primary={labels[language][index]}>
              {icon}
            </ListItemStyled>
          ))}
      </List>
      <Divider />
      <Box height="260px">

      </Box>
      <Divider />
      {
        IsLogged() &&
        <List>
          <ListItemStyled key={0} click={() => navigate('/profile')} primary={user.firstName} secondary={user.email}>
            <Avatar alt={user.firstName} src={avatar} sx={{ width: '30px', height: '30px' }} />
          </ListItemStyled>

          <ListItemStyled key={1} click={() => {setAuthHeader(null); navigate('/')}}
            style={{ color: theme.palette.error.main }}
            primary={content[language].exit}>
            <Logout />
          </ListItemStyled>
        </List>
      }
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerOpen}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box', width: drawerWidth,
            background: theme.palette.background.default,
          },
          position: 'fixed',
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box', width: miniDrawerWidth,
            background: theme.palette.background.default, marginTop: '64px',
            boxShadow: `0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)`
          },
          position: 'fixed',
          zIndex: 1,
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default NavigateDrawer