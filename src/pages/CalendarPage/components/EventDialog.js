import React, {useEffect, useState} from 'react'

import { useNavigate } from 'react-router-dom';

import { eventTypes } from '../../components/eventTypes'
import {
    Button,
    Box,
    IconButton,
    FormControl,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@mui/material'



import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
    Close,

} from '@mui/icons-material';
import dayjs from 'dayjs';

import car1 from "../../components/images/car1.png"
import car2 from "../../components/images/car2.png"
import car3 from "../../components/images/car3.png"
import car4 from "../../components/images/car4.png"
import car5 from "../../components/images/car5.png"


import car from "../../components/images/car.png"
import audi from "../../components/images/audi-a3.png"
import audiq8 from "../../components/images/audi_q8.png"
import bmwx5 from "../../components/images/bmw_x5.png"
import mersedes_s from "../../components/images/mercedes_s.png"
import volvo_xc90 from "../../components/images/volvo_xc90.png"


import en from 'dayjs/locale/en-gb';
import uk from 'dayjs/locale/uk';

import { styled } from '@mui/material/styles';
import { getUserId, request, setAuthHeader } from '../../../helpers/axios_helper';

// const cars = [
//     {
//         id: 1,
//         image: car,
//         name: 'Lamborgini Urus',
//     },
//     {
//         id: 2,
//         image: audiq8,
//         name: 'Audi Q8',
//     },
//     {
//         id: 3,
//         image: bmwx5,
//         name: 'Bmw X5',
//     },
//     {
//         id: 4,
//         image: mersedes_s,
//         name: 'Mersedes S-class',
//     },
//     {
//         id: 5,
//         image: volvo_xc90,
//         name: 'Volvo XC90',
//     },
//     {
//         id: 6,
//         image: audi,
//         name: 'Audi A3',
//     },
// ]
const StyledSelect = styled(Select)(({ theme }) => ({
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
}));


const content = {
    uk: {
        addEvent: 'Додавання події',
        editEvent: 'Редагування події',
        event: 'Подія',
        car: 'Авто',
        date: 'Дата',
        desk: 'Опис',
        do: 'Виконати',
        save: 'Зберегти',
    },
    en: {
        addEvent: 'Add event',
        editEvent: 'Edit event',
        event: 'Event',
        car: 'Auto',
        date: 'Date',
        desk: 'Description',
        do: 'Execute',
        save: 'Save',

    }
}

function addEvent(event) {
    request(
      "POST",
      "/events",
      {
        type: event.type,
          description: event.description,
          vinCode: event.vinCode,
        date: event.date
      }).then(
        (response) => {
            console.log(
                "   type: event.type,\n" +event.type+
                "          description: event.description,\n" +event.description+
                "          vinCode: event.vinCode,\n" + event.vinCode+
                "        date: event.date"+event.date);
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
// треьа зробити так як в HistoryPage.js і так всюди треба тобі треба передавати "id" пиши так "DELETE", `/history/${id}`) --->${id}`
//   function deleteEvent(idEvent) {
//     request(
//       "DELETE",
//       "/events",
//       {
//         id: idEvent,
//       }).then(
//         (response) => {
//           console.log(response);
//         }).catch(
//           (error) => {
//             // if (error.response.status === 401) {
//             //     setAuthHeader(null);
//             // }
//             console.log(error);
//           }
//         );
//   }
  function changeEvent(idEvent, event) {

    console.log(

          "   type: event.type,\n" +event.type+
          "          description: event.description,\n" +event.description+
          "          vinCode: event.vinCode,\n" + event.vinCode+
          "        date: event.date"+event.date);
    request(
      "PUT",
        `/events/${idEvent}`,
      {
        type: event.type,
          description: event.description,
          vinCode: event.vinCode,
        date: event.date
      }).then(
        (response) => {
            console.log("UPDATE");
            console.log(
                "   id:\n" +idEvent+
                "   type: event.type,\n" +event.type+
                "          description: event.description,\n" +event.description+
                "          vinCode: event.vinCode,\n" + event.vinCode+
                "        date: event.date"+event.date);

        }).catch(
          (error) => {
            // if (error.response.status === 401) {
            //     setAuthHeader(null);
            // }
            console.log(error);
          }
        );
  }

const EventDialog = ({ theme, language, open, isNew, handleClickClose, id, type, car, date, desk, setId, setDate, setType, setCar, setDesk}) => {

    const [cars, setCars] = useState([]);

    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Функція для отримання даних про автомобілі з сервера
    const getCars = () => {
        console.log("Fetching cars data");
        request("GET", "/cars/get-garage", {}).then(
            (response) => {
                console.log("Fetching cars data", response.data.content);
                setCars(response.data.content);
                setIsDataLoaded(true);

            }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        getCars();
    }, []);






    // const [eventType, setEventType] = React.useState(initialValue.type);
    // const [eventCar, setEventCar] = React.useState(initialValue.car);
    // const [eventDate, setEventDate] = React.useState(initialValue.date);
    // const [eventDesk, setEventDesk] = React.useState(initialValue.desk);

    // React.useEffect(() => {
    //     setEventType(initialValue.type);
    //     setEventCar(initialValue.car);
    //     setEventDate(initialValue.date);
    //     setEventDesk(initialValue.desk);
    // }, [initialValue]);

    // React.useEffect(() => {
    //
    //     addEvent({
    //         type: 'oil_change',
    //         description: 'oil change',
    //         vinCode: 'dsgadhh',
    //         date: dayjs(),
    //     });
    //     deleteEvent(1);
    //     changeEvent({
    //         idEvent: 1,
    //         type: 'oil_change',
    //         description: 'oil change',
    //         vinCode: 'dsgadhh',
    //         date: dayjs(),
    //     });
    //   });



    const handleButtonClick = () => {
        console.log("handleButtonClick");
        const selectedCar = cars.find(car1 => car1.id === car);
        console.log("carId"+car);
        // Отримати значення станів
        const eventData = {
            id: id,
            type: type,
            description: desk,
            vinCode: selectedCar.vinCode,
            date: date
        };

        console.log(
            "   id:\n" +id+
            "   type:\n" +type+
            "          description: ,\n" +desk+
            "          vinCode:\n" + selectedCar.vinCode+
            "        date: "+date);

        // Виклик addEvent та передача eventData
        {!isNew ? changeEvent(eventData.id, eventData) : addEvent(eventData)}


        // Потім виклик handleClickClose
        handleClickClose();
    };


    const navigate = useNavigate(); // Використовуйте хук на верхньому рівні компоненту

    const handleOnClick = () => {
        const selectedCar = cars.find(car1 => car1.id === car);
        console.log("car", selectedCar);
        console.log("carModel", selectedCar.carModel);
        // Передача об'єкта `selectedCar` через стан маршруту

        navigate(`/history/${selectedCar.vinCode}/${selectedCar.carModel}/${selectedCar.carModel}`, { state: { selectedCar } });

    };

    return (
        <Dialog
            onClose={handleClickClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{
                '& .MuiDialogContent-root': {
                    padding: theme.spacing(2),
                },
                '& .MuiDialogActions-root': {
                    padding: theme.spacing(1),
                },
                '& .MuiPaper-root': {
                    backgroundColor: theme.palette.background.default,

                    width: '480px',
                },
            }}

        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                {!isNew ? content[language].editEvent : content[language].addEvent}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClickClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <Close />
            </IconButton>
            <DialogContent dividers>
                <Box>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label" sx={{ color: theme.palette.secondary.main }}>
                            {content[language].event}
                        </InputLabel>
                        <StyledSelect
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            label={content[language].event}
                            onChange={(event) => setType(event.target.value)}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: theme.palette.background.default,
                                    }
                                }
                            }}
                        >
                            {eventTypes.map(eventType => (

                                <MenuItem key={eventType.type} value={eventType.type}>{eventType.icon}{'    '}{eventType.name[language]}</MenuItem>
                            ))}
                        </StyledSelect>
                    </FormControl>
                </Box>



                <Box sx={{ marginTop: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label" sx={{ color: theme.palette.secondary.main }}>
                            {content[language].car}
                        </InputLabel>
                        <StyledSelect
                            autoFocus
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={car}
                            label={content[language].car}

                            onChange={(event) => {
                                const selectedCar = cars.find(car => car.id === event.target.value);
                                console.log("selectedCar"+selectedCar.carModel)
                                console.log("selectedCarVin"+selectedCar.vinCode)
                                setCar(event.target.value);
                                console.log("selectedCarVin"+selectedCar.vinCode)
                            }}



                            // onChange={(event) => setCar(event.target.value)}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: theme.palette.background.default,
                                    }
                                }
                            }}
                        >

                            {cars.map(car => (
                                <MenuItem key={car.carModel} value={car.id}><img src={audi} alt={car.carModel} style={{ width: '36px' }} />{'            '}{car.carModel}</MenuItem>
                            ))}
                        </StyledSelect>
                    </FormControl>
                </Box>

                <Box sx={{ marginTop: 1, width: '100%' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={language === 'uk' ? uk : en}>
                        <DemoContainer components={['DatePicker']} >
                            <DatePicker label={content[language].date} value={date} onChange={(newValue) => setDate(newValue)}
                                sx={{
                                    width: '100%',

                                    '& fieldset': {
                                        borderColor: theme.palette.secondary.main,
                                    },
                                    '& .MuiSvgIcon-root ': {
                                        color: theme.palette.secondary.main,
                                    },
                                    "label": {
                                        color: theme.palette.secondary.main
                                    }
                                }}
                                slotProps={{
                                    layout: {
                                        sx: {
                                            '.MuiDateCalendar-root': {
                                                color: theme.palette.text.primary,
                                                backgroundColor: theme.palette.background.default,
                                            },

                                            "& .MuiIconButton-root": {
                                                color: theme.palette.secondary.main,
                                            },

                                            '& .MuiTypography-root': {
                                                color: theme.palette.secondary.main,
                                            },

                                            "& .css-1eyvkhb-MuiButtonBase-root-MuiPickersDay-root:not(.Mui-selected)": {
                                                borderColor: theme.palette.secondary.main,
                                            },
                                        }
                                    }
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </Box>

                <TextField
                    id="outlined-textarea"
                    label={content[language].desk}
                    multiline
                    value={desk}
                    onChange={(event) => setDesk(event.target.value)}
                    rows={4}
                    sx={{
                        marginTop: 2,
                        width: '100%',
                        // Колір введеного тексту
                        '& input': {
                            color: theme.palette.text.primary,
                        },

                        // Колір обведення елемента TextField (не введеного тексту)
                        '& fieldset': {
                            borderColor: theme.palette.secondary.main,
                        },

                        "label": {
                            color: theme.palette.secondary.main
                        }
                    }}
                />
            </DialogContent>
            <DialogActions>
                {!isNew &&
                    <Button autoFocus onClick={handleOnClick}>
                        {content[language].do}
                    </Button>


                }
                <Button autoFocus onClick={handleButtonClick}>
                    {content[language].save}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EventDialog
