import React, {useEffect} from 'react';
import CarCarousel from './components/CarCarousel'
import car from "./../components/images/car.png"
import {Box, Container, FormControl, Grid, InputLabel, MenuItem, Select, Typography,} from '@mui/material';


import {
    Adjust,
    AttachMoney,
    LocalGasStation,
    MoveUp,
    Palette,
    Schedule,
    Sell,
    Settings,
    TimesOneMobiledata,
    TimeToLeave
} from '@mui/icons-material';
import InfoCard, {getPropertyValue} from '../components/InfoCard.js';

import {request} from '../../helpers/axios_helper';


const content = {
    uk: {
        configuration: ['Марка', 'Модель', 'Рік випуску', 'Тип двигуна', 'Кінські сили', 'Тип трансмісії', 'Кількість передач', 'Привід', 'Колір', 'Ціна'],
        found: 'Знайдено ',
        cars: ' Авто',
        make: 'Марка',
    },
    en: {
        configuration: ['Make', 'Model', 'Year', 'Engine Type', 'Horsepower', 'Transmission Type', 'Number of Gears', 'Drive', 'Color', 'Price'],
        found: 'Found ',
        cars: ' cars',
        make: 'Make',
    },
}
const icons = [<TimeToLeave/>, <Sell/>, <Schedule/>, <LocalGasStation/>, <TimesOneMobiledata/>, <Settings/>, <MoveUp/>,
    <Adjust/>, <Palette/>, <AttachMoney/>]
const properties = ['make.name', 'model.name', 'years[0].year', 'engine.type', 'engine.horsepower', 'transmission.transmissionType', 'transmission.numberOfSpeeds', 'drivenWheels', 'colors[1].options[0].name', 'price.baseMsrp'];

// const cars = [
//
//   {
//     src: car,
//     title: 'Lamborgini Urus',
//     json: json,
//   },
//   {
//     src: audiq8,
//     title: 'Audi Q8',
//     json: json,
//   },
//   {
//     src: bmwx5,
//     title: 'Bmw X5',
//     json: json,
//   },
//   {
//     src: mersedes_s,
//     title: 'Mersedes S-class',
//     json: json,
//   },
//   {
//     src: volvo_xc90,
//     title: 'Volvo XC90',
//     json: json,
//   },
//   {
//     src: audi,
//     title: 'Audi A3',
//     json: json2,
//   },
//   {
//     src: audiq8,
//     title: 'Audi Q8',
//     json: json,
//   },
//   {
//     src: bmwx5,
//     title: 'Bmw X5',
//     json: json,
//   },
//   {
//     src: car5,
//     title: 'Bmw dsc',
//     json: json,
//   },
//   {
//     src: car1,
//     title: 'Bmw dsc',
//     json: json,
//   },
//   {
//     src: car2,
//     title: 'Bmw dsc',
//     json: json,
//   },
//   {
//     src: car3,
//     title: 'Bmw dsc',
//     json: json,
//   },
//   {
//     src: car4,
//     title: 'Bmw dsc',
//     json: json,
//   },
// ];

// function getCars() {
//   request(
//     "GET",
//     "/cars/get-garage",
//     {}).then(
//       (response) => {
//         console.log(response.data);
//       }).catch(
//         (error) => {
//           // if (error.response.status === 401) {
//           //     setAuthHeader(null);
//           // }
//           console.log(error);
//         }
//       );
// }
function deleteCar(id) {
    request(
        "DELETE",
        "/cars/delete",
        {
            id: id,
        }).then(
        (response) => {
            console.log(response);
        }).catch(
        (error) => {
            // if (error.response.status === 401) {
            //     setAuthHeader(null);
            // }
            console.log(error);
        }
    );
}

const GaragePage = ({theme, language}) => {

    const [isDataLoaded, setIsDataLoaded] = React.useState(false);
    const [cars, setCars] = React.useState([]);
    const [selectedCar, setSelectedCar] = React.useState(0);
    const [brand, setBrand] = React.useState('');
    const [makes, setMakes] = React.useState(['All']);
    const [filteredCars, setFilteredCars] = React.useState(cars);
    React.useEffect(() => {
        console.log('useEffect запущено');
        getCars();
    }, []);
    const handleChange = (event) => {
        setBrand(event.target.value);
        if (event.target.value === 'All')
            setFilteredCars(cars);
        else {
            let filCars = []
            for (const car of cars)
                if (getPropertyValue(car.allInfoAboutCar, properties[0]) === event.target.value)
                    filCars.push(car);
            setFilteredCars(filCars);
        }
    };
    const getCars = () => {
        console.log("dima")
        request("GET", "/cars/get-garage", {}).then(
            (response) => {

                setCars(response.data.content);
                setFilteredCars(response.data.content);
                setIsDataLoaded(true);
                console.log(response.data.content[0].allInfoAboutCar)
            }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        console.log("nata")
        let makes0 = ['All'];
        for (const car of cars) {
            console.log(car.allInfoAboutCar)
            const makeName = getPropertyValue(car.allInfoAboutCar, properties[0]);

            if (!makes0.includes(makeName)) {
                makes0.push(makeName);
            }
        }
        setMakes(makes0);
    }, [cars]);



    return (

        <Container disableGutters sx={{padding: 1}}

                   maxWidth="100%">
            <Container disableGutters maxWidth='100%' sx={{
                margin: 0,
                paddingBlock: 1,
                paddingLeft: '20px',
                paddingRight: '20px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    color={theme.palette.text.main}
                >
                    {content[language].found}{filteredCars.length}{content[language].cars}
                </Typography>
                <Box sx={{minWidth: 120, width: '150px'}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label"
                                    sx={{color: theme.palette.secondary.main}}>{content[language].make}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={brand}
                            label={content[language].make}
                            onChange={handleChange}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: 'transparent',
                                    }
                                }
                            }}
                            sx={{
                                '& .MuiInputBase-input':
                                    {
                                        color: theme.palette.text.main,
                                    },
                                '& fieldset': {
                                    borderColor: theme.palette.secondary.main,
                                },
                                '& .MuiSelect-icon': {
                                    color: theme.palette.secondary.main,
                                },
                            }}
                        >
                            {makes.map(make => (

                                <MenuItem key={make} value={make}>{make}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Container>
            <Container disableGutters sx={{margin: 0, paddingLeft: 5, paddingRight: 5}} maxWidth='100%'>
                <CarCarousel theme={theme} images={filteredCars} selectedCar={selectedCar}
                             setSelectedCar={setSelectedCar}/>
            </Container>
            {isDataLoaded && cars[selectedCar] && (
                <Grid container spacing={0} sx={{marginBlock: 2}}>


                    <Grid item xs={12} md={6}>
                        {cars[selectedCar] && (
                            <InfoCard
                                theme={theme}
                                language={language}
                                title={cars[selectedCar].carModel}
                                icons={icons}
                                configuration={content[language].configuration}
                                properties={properties}
                                json={filteredCars[selectedCar].allInfoAboutCar}
                                type='control'
                            />
                        )}
                    </Grid>

                    <Grid item xs={12} md={6} sx={{
                        display: {xs: 'none', md: 'flex'},
                        position: 'relative',
                        marginBlock: 2,
                        paddingBlock: 5
                    }}>
                        <Container disableGutters sx={{
                            width: '90%',
                            height: {md: '200px', lg: '250px'},
                            background: `linear-gradient(to bottom, transparent, rgba(0, 123, 255, 0.37) 100%)`,
                            borderRadius: '50%',
                            filter: 'blur(10px)',
                            position: 'relative',
                            zIndex: 1,
                            marginTop: '25%',
                            marginLeft: 0
                        }}></Container>
                        <img src={car}
                             alt={cars[selectedCar].carModel}
                             style={{
                                 width: '90%', zIndex: 2, top: 0,
                                 position: 'absolute',
                             }}/>
                    </Grid>
                </Grid>
            )}
        </Container>
    )
}

export default GaragePage
