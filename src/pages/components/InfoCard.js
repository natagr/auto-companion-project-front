import React from 'react'
import {
    Card,
    CardContent,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';

import {MoreVert,} from '@mui/icons-material';


import {useNavigate} from "react-router-dom";

export const getPropertyValue = (data, path, default_value = '') => {
    // Перевірка, чи вхідні дані є рядком, і спроба їх перетворити на об'єкт
    let obj;
    if (typeof data === 'string') {
        try {
            obj = JSON.parse(data);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            return default_value;
        }
    } else {
        obj = data;
    }
    const keys = path.split('.');
    return keys.reduce((acc, key) => {
        if (!acc) return default_value;

        if (key.includes('[')) {
            const [prop, index] = key.split('[').map(item => item.replace(']', ''));
            if (!acc[prop] || !acc[prop][index]) return default_value;
            acc = acc[prop][index];
        } else {
            if (!acc[key]) return default_value;
            acc = acc[key];
        }

        return acc;
    }, obj);
};

const InfoCard = ({theme, language, title, icons, configuration, properties, json, type}) => {
      console.log(title + "i want to die")
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const content = {
        uk: {
            shedule: 'Запланувати сервіс',
            more: 'Більше...',
            history: 'Історія обслуговування',
            delete: 'Видалити',
            none: 'Немає',
        },
        en: {
            shedule: 'Schedule service',
            more: 'More...',
            history: 'Service history',
            delete: 'Delete',
            none: 'None',
        },
    }

    return (
        <Card sx={{background: theme.palette.background.default, margin: 5}}>

            <CardContent>
                {title &&
                    <Container disableGutters sx={{
                        display: 'flex',
                        justifyContent: type === 'control' ? 'space-between' : 'flex-start'
                    }}>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            color="text"
                        >
                            {title}
                        </Typography>
                        {type === 'control' &&
                            <>
                                {/*<IconButton aria-label="more"*/}
                                {/*            color="inherit" onClick={handleClick}>*/}
                                {/*    <MoreVert/>*/}
                                {/*</IconButton>*/}
                                {/*<Menu*/}
                                {/*    id="basic-menu"*/}
                                {/*    anchorEl={anchorEl}*/}
                                {/*    open={open}*/}S
                                {/*    onClose={handleClose}*/}
                                {/*    MenuListProps={{*/}
                                {/*        'aria-labelledby': 'basic-button',*/}
                                {/*    }}*/}
                                {/*    sx={{*/}
                                {/*        '& .MuiPaper-root': {*/}

                                {/*            backgroundColor: 'transparent',*/}
                                {/*        }*/}
                                {/*    }}*/}
                                {/*>*/}
                                {/*    <MenuItem onClick={handleClose}>{content[language].more}</MenuItem>*/}
                                {/*    <MenuItem onClick={() => {*/}
                                {/*        navigate('/history');*/}
                                {/*        handleClose()*/}
                                {/*    }}>{content[language].history}</MenuItem>*/}
                                {/*    <MenuItem onClick={handleClose}>{content[language].shedule}</MenuItem>*/}
                                {/*    <MenuItem onClick={handleClose}>{content[language].delete}</MenuItem>*/}
                                {/*</Menu>*/}
                            </>
                        }
                    </Container>
                }
                <List sx={{marginLeft: '40px'}}>
                    <Grid container spacing={0}>
                        {icons.map((icon, index) => (
                            <Grid item xs={12} sm={6}>
                                <ListItem key={index}>
                                    <ListItemIcon sx={{color: theme.palette.secondary.main}}>
                                        {icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={getPropertyValue(json, properties[index], content[language].none).toString().toLowerCase()}
                                        secondary={configuration[index]}
                                        sx={{
                                            '& .css-83ijpv-MuiTypography-root': {
                                                color: theme.palette.secondary.main
                                            }
                                        }}
                                    />
                                </ListItem>
                            </Grid>
                        ))}
                    </Grid>
                </List>
            </CardContent>
        </Card>
    )
}

export default InfoCard