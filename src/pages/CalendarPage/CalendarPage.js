import React, {useEffect, useState} from 'react'
import MiniCalendar from '../components/MiniCalendar'

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';



import en from 'dayjs/locale/en-gb';
import uk from 'dayjs/locale/uk';

import useMediaQuery from '@mui/material/useMediaQuery';

import {request} from '../../helpers/axios_helper';

import {
    Badge,
    Box,
    Button,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material'
import {ArrowBackIos, ArrowForwardIos, Create, Today,} from '@mui/icons-material';
import {eventTypes} from '../components/eventTypes';


import car from "../components/images/car.png"
import bmwx5 from "../components/images/bmw_x5.png"
import mersedes_s from "../components/images/mercedes_s.png"
import volvo_xc90 from "../components/images/volvo_xc90.png"

import EventDialog from './components/EventDialog';

//
// function fakeFetch(date, {signal}) {
//     return new Promise((resolve, reject) => {
//         const timeout = setTimeout(() => {
//             //const currentMonth = date.month();
//             //const currentYear = date.year();
//             //отримуємо події з бази даних за місяцем
//             // const events = [
//             //     {
//             //         day: 25,
//             //         type: 'oil_change',
//             //         desk: 'Oil change',
//             //         carImage: car,
//             //     },
//             //
//             //     {
//             //         day: 25,
//             //         type: 'belt_change',
//             //         desk: 'Replacing belts',
//             //         carImage: mersedes_s,
//             //     },
//             //
//             //     {
//             //         day: 25,
//             //         type: 'battery_replacement',
//             //         desk: 'Scheduled battery replacement',
//             //         carImage: volvo_xc90,
//             //     },
//             //
//             //     {
//             //         day: 30,
//             //         type: 'filter_change',
//             //         desk: 'Replace filters',
//             //         carImage: bmwx5,
//             //     },
//             //     {
//             //         day: 2,
//             //         type: 'routine_maintenance',
//             //         desk: 'Scheduled maintenance',
//             //         carImage: volvo_xc90,
//             //     },
//             // ];
//             //
//             //
//             // resolve({events});
//         }, 500);
//
//         signal.onabort = () => {
//             clearTimeout(timeout);
//             reject(new DOMException('aborted', 'AbortError'));
//         };
//     });
// }

dayjs.extend(utc);
function equalsDates(date1, date2) {
    if (!date1)
        return false;
    return date1.date() === date2.date() && date1.month() === date2.month() && date1.year() === date2.year();
}

function getColorByType(type) {
    let color = null;

    eventTypes.forEach(event => {
        if (event.type === type) {
            color = event.color;
        }
    });

    return color;
}

function getIconByType(type) {
    let foundIcon = null;

    eventTypes.forEach(event => {
        if (event.type === type) {
            foundIcon = event.icon;
        }
    });

    return foundIcon;
}


function getMonthDays(date) {
    const monthDays = [];
    const daysInMonth = date.daysInMonth();
    let week = [];

    let firstday = dayjs(`${date.year()}-${date.month() + 1}-1`).day(); // Remove the - 1
    if (firstday === 0) firstday = 7; // Adjust for Sunday being 0

    for (let i = 1; i < firstday; i++)
        week[i - 1] = null; // Adjust the index here

    for (let i = 1; i < daysInMonth + 1; i++) {
        let day = dayjs(`${date.year()}-${date.month() + 1}-${i}`);
        let day_index = day.day() - 1;
        if (day_index === -1) {
            week[6] = day;
            monthDays.push([...week]); // Use a copy of the week array
            week = Array(7).fill(null); // Reset week array
        } else
            week[day_index] = day;
    }

    if (week.length > 0) {
        monthDays.push([...week]); // Use a copy of the week array
    }

    return monthDays;
}


function getEvents(month, year) {
    // Assuming that request returns a promise
    console.log('Making request with month:', month, 'and year:', year);

    return request("GET", `/events?month=${month}&year=${year}`)
        .then(response => {
            console.log('Fetched data:', response.data.content);
            if (!Array.isArray(response.data.content)) {
                throw new Error('Response is not an array');
            }

            return response.data.content;
        })
        .catch(error => {
            console.log('Error:', error);
            throw error;
        });
}



const CalendarPage = ({theme, language}) => {
    const [initialDay, setInitialDay] = React.useState(dayjs());
    const [calendarValue, setCalendarValue] = React.useState(dayjs());
    const [isLoading, setIsLoading] = React.useState(false);
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const [events, setEvents] = React.useState([]);
    const requestAbortController = React.useRef(null);

    const fetchEvents = (date) => {
        console.log('Fetching events for date:', date.format()); // Log the date to check its value
        const controller = new AbortController();

        getEvents(date.month() + 1, date.year(), controller)
            .then(events => {
                console.log('Fetching events:', events);
                // const d = new Date(events[0].date);
                // console.log('date:',new Date(events[0].date));
                setEvents(events);
                setIsLoading(false);
            })
            .catch(error => {
                if (error.name !== 'AbortError') {
                    console.error('Failed to fetch events:', error);
                    setIsLoading(false);
                }
            });

        requestAbortController.current = controller;
    };

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

    React.useEffect(() => {
        fetchEvents(initialDay);
        return () => requestAbortController.current?.abort();
    }, [initialDay]);

    React.useEffect(() => {
        if (calendarValue.month() !== initialDay.month() || calendarValue.year() !== initialDay.year())
            setInitialDay(calendarValue);
    }, [calendarValue]);


    const handleMonthChange = (date) => {
        if (requestAbortController.current) {
            requestAbortController.current.abort();
        }

        setIsLoading(true);
        setEvents([]);
        if (language === 'uk') {
            date = date.locale(uk);
        } else {
            date = date.locale(en);
        }
        setInitialDay(date);
        fetchEvents(date);
    };


    const monthMatrix = getMonthDays(initialDay);

    const handleBackClick = () => {
        if (isXs) {

            let date = calendarValue.subtract(1, 'day');
            console.log("date ", date);
            setCalendarValue(date);
        } else {
            let date = initialDay.subtract(1, 'month').startOf('month');
            console.log("date ", date);
            setCalendarValue(date);
            handleMonthChange(date);
        }
    }

    const handleForwardClick = () => {
        if (isXs) {
            let date = calendarValue.add(1, 'day');
            console.log("date ", date);
            setCalendarValue(date);
        } else {
            let date = initialDay.add(1, 'month').startOf('month');
            console.log("date ", date);
            setCalendarValue(date);
            handleMonthChange(date);
        }
    }

    const content = {
        uk: {
            days: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'],
            month: 'Місяць',
            day: 'День',
            add: 'Додати подію',
            today: 'Сьогодні',
            // filter: 'Фільтр',
            // automatic: 'Автоматичні',
            // planned: 'Заплановані',
            noEvents: 'Немає запланованих подій!',
        },
        en: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            month: 'Month',
            day: 'Day',
            add: 'Add event',
            today: 'Today',
            // filter: 'Filter',
            // automatic: 'Automatic',
            // planned: 'Planned',
            noEvents: 'No events scheduled!',
        },
    }

    const [automatic, setAutomatic] = React.useState(true);
    const [planned, setPlanned] = React.useState(true);

    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClickOpenDialog = (clear) => {
        if (clear) {
            setEventDate(calendarValue);
            setEventCar(null);
            setEventType(null);
            setEventDesk(null);
            setIsNew(true)
        }
        setOpenDialog(true);
    };

    const handleClickCloseDialog = () => {
        setOpenDialog(false);
    };

    let hasNonNullItem = false;
    const [initialEvent, setInitialEvent] = React.useState({date: calendarValue});

    const [eventId, setEventId] = React.useState();
    const [eventType, setEventType] = React.useState();
    const [eventCar, setEventCar] = React.useState();
    const [eventDate, setEventDate] = React.useState();
    const [eventDesk, setEventDesk] = React.useState();
    const [isNew, setIsNew] = React.useState(true);

    return (
        <>
            <Grid container spacing={0}>

                {//<MiniCalendar theme={theme} language={language} setInitialDay={setInitialDay}/>
                }
                <Grid item sx={{
                    width: {xs: '100%', md: '330px'},
                    display: 'flex', alignItems: 'center', flexDirection: 'column',
                    borderRight: {md: `1px solid ${theme.palette.secondary.main}`},
                    borderBottom: `1px solid ${theme.palette.secondary.main}`,
                }}>
                    <Button variant="outlined" startIcon={<Create/>} sx={{marginBlock: 3}}
                            onClick={() => handleClickOpenDialog(true)}>
                        {content[language].add}
                    </Button>

                    <Box sx={{borderBlock: `1px solid ${theme.palette.secondary.main}`, width: '100%'}}>
                        <MiniCalendar theme={theme} language={language} value={calendarValue}
                                      setValue={setCalendarValue}
                                      handleMonthChange={handleMonthChange} highlightedDays={events}
                                      isLoading={isLoading}/>
                    </Box>

                    {/*<FormControl sx={{m: 3, width: '90%'}} component="fieldset" variant="standard">*/}
                    {/*    <FormLabel component="legend"*/}
                    {/*               sx={{color: theme.palette.secondary.main}}>{content[language].filter}</FormLabel>*/}
                    {/*    <FormGroup>*/}
                    {/*        <FormControlLabel*/}
                    {/*            control={*/}
                    {/*                <Checkbox checked={automatic} sx={{color: theme.palette.secondary.main}}*/}
                    {/*                          onChange={(event) => setAutomatic(event.target.checked)}*/}
                    {/*                          name="automatic"/>*/}
                    {/*            }*/}
                    {/*            label={content[language].automatic}*/}
                    {/*        />*/}
                    {/*        <FormControlLabel*/}
                    {/*            control={*/}
                    {/*                <Checkbox checked={planned} sx={{color: theme.palette.secondary.main}}*/}
                    {/*                          onChange={(event) => setPlanned(event.target.checked)} name="planned"/>*/}
                    {/*            }*/}
                    {/*            label={content[language].planned}*/}
                    {/*        />*/}
                    {/*    </FormGroup>*/}
                    {/*</FormControl>*/}
                </Grid>


                <Grid item sx={{width: {xs: '100%', md: 'calc(100% - 330px)'}}}>
                    <Container sx={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                color: theme.palette.text.primary,
                                backgroundColor: theme.palette.primary.main,
                                marginBlock: 1,
                                width: '130px',
                                height: '40px',
                                minWidth: '120px',
                            }}
                            startIcon={<Today/>}
                            onClick={() => {
                                setCalendarValue(dayjs());
                                handleMonthChange(dayjs())
                            }}
                        >
                            {content[language].today}
                        </Button>
                        <Container sx={{display: 'flex', justifyContent: 'center', marginBlock: 1}}>
                            <Tooltip>
                                <IconButton aria-label="delete" color='inherit' onClick={handleBackClick}>
                                    <ArrowBackIos/>
                                </IconButton>
                            </Tooltip>


                            <Typography variant="h6" gutterBottom
                                        sx={{marginRight: {xs: 0, sm: 3}, marginLeft: {xs: 0, sm: 3}}}>
                                {isXs ? calendarValue.format('DD.MM.YYYY') : initialDay.locale(language).format('MMMM YYYY')}
                            </Typography>
                            <Tooltip>
                                <IconButton aria-label="delete" color='inherit' onClick={handleForwardClick}>
                                    <ArrowForwardIos/>
                                </IconButton>
                            </Tooltip>
                        </Container>
                        {/*<Button*/}
                        {/*    variant="outlined"*/}
                        {/*    size="small"*/}
                        {/*    sx={{*/}
                        {/*        color: theme.palette.text.primary,*/}
                        {/*        marginBlock: 1,*/}
                        {/*        width: {xs: '200px', sm: '130px'},*/}
                        {/*        height: '40px',*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    {isXs ? content[language].day : content[language].month}*/}
                        {/*</Button>*/}
                    </Container>

                    {!isXs &&
                        <Grid container spacing={0} sx={{paddingLeft: 2, paddingRight: 2}}>
                            {content[language].days.map((day, index) => (
                                <Grid item xs={12 / 7} key={day}
                                      sx={{display: 'flex', justifyContent: 'center', marginTop: 1}}>
                                    <Typography variant="subtitle1" gutterBottom
                                                sx={{color: theme.palette.secondary.main}}>
                                        {day}
                                    </Typography>
                                </Grid>
                            ))}

                            {monthMatrix.map((week, index) => (
                                week.map((day, number) => (
                                    <Grid xs={12 / 7} item key={(index + 1) * (number + 1)} sx={{
                                        border: `1px solid ${equalsDates(day, dayjs()) ? theme.palette.primary.main : theme.palette.secondary.main
                                        }`, padding: 1, minHeight: '90px'
                                    }}>
                                        {day && (

                                            <>
                                                <Typography variant="subtitle1" gutterBottom
                                                            sx={{color: theme.palette.text.main}}>
                                                    {day.date()}
                                                </Typography>

                                                {/*{events.map((item, i) => {*/}
                                                {/*    const eventDate = new Date(item.date);*/}
                                                {/*    const dayDate = new Date(day); // Припускаємо, що `day` теж є датою*/}
                                                {/*    if (eventDate.getDate() === dayDate.getDate() &&*/}
                                                {/*        eventDate.getMonth() === dayDate.getMonth() &&*/}
                                                {/*        eventDate.getFullYear() === dayDate.getFullYear()) {*/}


                                                {events.map((item, i) => {
                                                    const eventDate = dayjs(item.date);
                                                    if (eventDate.date() === day.date() &&
                                                        eventDate.month() === day.month() &&
                                                        eventDate.year() === day.year()) {
                                                        // console.log("dima")
                                                        // console.log("eventDate.getDay()"+eventDate.date())
                                                        // console.log("day.date()"+day.date())
                                                        // console.log("item.date"+item.date+"item.id"+item.id)


                                                        return (
                                                            <Badge
                                                                anchorOrigin={{
                                                                    vertical: 'top',
                                                                    horizontal: 'right',
                                                                }}
                                                                key={i}
                                                                overlap="circular"
                                                                badgeContent={<img
                                                                    src={car}
                                                                    alt="Car"
                                                                    style={{width: '24px', height: '24px'}}
                                                                />}
                                                                sx={{width: '100%'}}
                                                            >
                                                                <Button key={i} variant="contained" sx={{
                                                                    backgroundColor: getColorByType(item.type),
                                                                    color: theme.palette.text.primary,
                                                                    width: '100%',
                                                                    overflow: 'hidden',
                                                                    '& .MuiButtonBase-root': {fontSize: '0,5rem',},
                                                                }}
                                                                        onClick={() => {

                                                                            setEventId(item.id);
                                                                            setEventType(item.type);

                                                                            console.log("item.car"+item.vinCode)
                                                                            const selectedCar = cars.find(car1 => car1.vinCode === item.vinCode);


                                                                            setEventCar(selectedCar.id);

                                                                            setEventDate(dayjs(item.date).utc());
                                                                            setEventDesk(item.description);

                                                                            setIsNew(false);
                                                                            handleClickOpenDialog(false);
                                                                        }}
                                                                >
                                                                    {item.description}
                                                                </Button>
                                                            </Badge>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                            </>
                                        )}
                                    </Grid>
                                ))
                            ))}
                        </Grid>
                    }
                    {isXs &&
                        <>
                            <Typography variant="subtitle1" gutterBottom
                                        sx={{color: theme.palette.secondary.main, textAlign: 'center'}}>
                                {calendarValue.locale(language).format('dddd')}
                            </Typography>

                            {/*{events.map((item, i) => {*/}
                            {/*    const eventDate = new Date(item.date);*/}
                            {/*    const dayDate = new Date(day); // Припускаємо, що `day` теж є датою*/}
                            {/*    if (eventDate.getDate() === dayDate.getDate() &&*/}
                            {/*        eventDate.getMonth() === dayDate.getMonth() &&*/}
                            {/*        eventDate.getFullYear() === dayDate.getFullYear()) {*/}

                            {events.map((item, i) => {
                                const eventDate1 = dayjs(item.date);
                                // const dayDate1 = dayjs(calendarValue);
                                console.log("XS")
                                console.log("eventDate1 ", eventDate1)

                                console.log("calendarValue ", calendarValue)

                                console.log("eventDate1.getDate() ", eventDate1.date())
                                console.log("calendarValue.getDate() ", calendarValue.date())
                                console.log("eventDate1.getMonth() ", eventDate1.month())
                                console.log("calendarValue.getMonth() ", calendarValue.month())
                                console.log("eventDate1.getFullYear() ", eventDate1.year())
                                console.log("calendarValue.getFullYear() ", calendarValue.year())

                                if (eventDate1.date() === calendarValue.date() &&
                                    eventDate1.month() === calendarValue.month() &&
                                    eventDate1.year() === calendarValue.year()) {

                                    console.log("xsIF")
                                    // console.log("eventDate1.getDay()"+eventDate1.date())
                                    // console.log("dayDate1.date()"+dayDate1.date())
                                    // console.log("item.date"+item.date+"item.id"+item.id)
                                    hasNonNullItem = true;
                                    return (
                                        <>
                                            <img alt='car' src={car}
                                                 style={{width: '40px', marginLeft: '20px'}}/>
                                            <Box sx={{
                                                marginBlock: '5px',
                                                marginLeft: '30px',
                                                marginRight: '30px',
                                                borderLeft: `5px solid ${getColorByType(item.type)}`,
                                                padding: '10px'
                                            }}>

                                                <Button key={i} variant="contained"
                                                        startIcon={getIconByType(item.type)}
                                                        sx={{
                                                            backgroundColor: getColorByType(item.type),
                                                            color: theme.palette.text.primary,
                                                            width: '100%',
                                                            overflow: 'hidden',
                                                            '& .MuiButtonBase-root': {fontSize: '0,5rem',},
                                                        }}
                                                        onClick={() => {
                                                            setInitialEvent({
                                                                type: item.type,
                                                                date: new Date(item.date).getDay(),
                                                                desk: item.description,
                                                                car: 1,
                                                            });

                                                            setEventId(item.id);

                                                            setEventType(item.type);

                                                            console.log("item.car"+item.vinCode)
                                                            const selectedCar = cars.find(car1 => car1.vinCode === item.vinCode);


                                                            setEventCar(selectedCar.id);
                                                            setEventDate(dayjs(item.date).utc().format());
                                                            setEventDesk(item.description);
                                                            setIsNew(false);
                                                            handleClickOpenDialog(false);
                                                        }}>
                                                    {item.description}
                                                </Button>
                                            </Box>
                                        </>
                                    );
                                } else {
                                    console.log("naat2")
                                    return null;
                                }
                            })}
                            {!hasNonNullItem && (
                                <Typography variant="subtitle1" gutterBottom
                                            sx={{color: theme.palette.text.primary, margin: 2}}>
                                    {content[language].noEvents}
                                </Typography>
                            )}
                        </>
                    }

                </Grid>
            </Grid>

            <EventDialog theme={theme} language={language} open={openDialog} isNew={isNew}
                         handleClickClose={handleClickCloseDialog} id={eventId} date={eventDate} type={eventType} car={eventCar}
                         desk={eventDesk} setId={{setEventId}} setDate={setEventDate} setType={setEventType} setCar={setEventCar}
                         setDesk={setEventDesk}/>
        </>
    )
}

export default CalendarPage
