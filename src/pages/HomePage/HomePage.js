import * as React from "react";
import { CardMedia, Grid, Typography, Button, Card, CardContent, Stack, CardActions } from "@mui/material";
import imageUrl from "./images/home_image.jpg";
import MiniCalendar from '../components/MiniCalendar';
import HomeCard from "./components/HomeCard";

import dayjs from 'dayjs';


import car1 from "../components/images/car1.png"
import car2 from "../components/images/car2.png"
import car3 from "../components/images/car3.png"
import car4 from "../components/images/car4.png"
import car5 from "../components/images/car5.png"

import brake from './images/brake.png'
import engine from './images/engine.png'
import filters from './images/filters.png'
import suspension from './images/suspension.png'

import car from "../components/images/car.png"
import audi from "../components/images/audi-a3.png"
import audiq8 from "../components/images/audi_q8.png"
import bmwx5 from "../components/images/bmw_x5.png"
import mersedes_s from "../components/images/mercedes_s.png"
import volvo_xc90 from "../components/images/volvo_xc90.png"

import { getUserId, request, setAuthHeader } from '../../helpers/axios_helper';

// const cars = [
//     {
//         id: 1,
//         src: car,
//         title: 'Lamborgini Urus',
//     },
//     {
//         id: 2,
//         src: audiq8,
//         title: 'Audi Q8',
//     },
//     {
//         id: 3,
//         src: bmwx5,
//         title: 'Bmw X5',
//     },
//     {
//         id: 4,
//         src: mersedes_s,
//         title: 'Mersedes S-class',
//     },
//     {
//         id: 5,
//         src: volvo_xc90,
//         title: 'Volvo XC90',
//     },
//     // {
//     //     id: 6,
//     //     src: audi,
//     //     title: 'Audi A3',
//     // },
// ]

const parts = [brake, engine, filters, suspension];

// function fakeFetch(date, { signal }) {
//     return new Promise((resolve, reject) => {
//         const timeout = setTimeout(() => {
//             //const currentMonth = date.month();
//             //const currentYear = date.year();
//             //отримуємо події з бази даних за місяцем
//             const events = [
//                 {
//                     day: 25,
//                     type: 'oil_change',
//                     desk: 'Oil change',
//                     carImage: car,
//                 },
//
//                 {
//                     day: 25,
//                     type: 'belt_change',
//                     desk: 'Replacing belts',
//                     carImage: mersedes_s,
//                 },
//
//                 {
//                     day: 25,
//                     type: 'battery_replacement',
//                     desk: 'Scheduled battery replacement',
//                     carImage: volvo_xc90,
//                 },
//
//                 {
//                     day: 30,
//                     type: 'filter_change',
//                     desk: 'Replace filters',
//                     carImage: bmwx5,
//                 },
//                 {
//                     day: 2,
//                     type: 'routine_maintenance',
//                     desk: 'Scheduled maintenance',
//                     carImage: volvo_xc90,
//                 },
//             ];
//
//
//             resolve({ events });
//         }, 500);
//
//         signal.onabort = () => {
//             clearTimeout(timeout);
//             reject(new DOMException('aborted', 'AbortError'));
//         };
//     });
// }


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


const HomePage = ({ theme, language }) => {

    // Ініціалізація стану для автомобілів
    const [cars, setCars] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [events, setEvents] = React.useState([]);
    const requestAbortController = React.useRef(null);

    // Оновлена функція для отримання автомобілів
    const getUser = () => {
        request("GET", "/users", {}).then(
            (response) => {
                setUsers(response.data)
            }).catch((error) => {
            console.log(error);
            setIsLoading(false); // Обробка помилки
        });
    };

    const getCars = () => {
        request("GET", "/cars/get-garage", {}).then(
            (response) => {
                setCars(response.data.content); // Оновлення стану автомобілів
                setIsLoading(false); // Завершення завантаження
            }).catch((error) => {
            console.log(error);
            setIsLoading(false); // Обробка помилки
        });
    };

    // Виклик getCars при монтуванні компонента
    React.useEffect(() => {
        setIsLoading(true);
        getCars();
        getUser();
    }, []);


    const fetchEvents2 = (date) => {
        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            getEvents(date.month() + 1, date.year())
                .then(events => {
                    resolve(events); // Resolve the promise with events
                })
                .catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error('Failed to fetch events:', error);
                        reject(error); // Reject the promise on error
                    }
                });
        });
    };


    const currentDate = new Date();
    const getFormattedDate = (locale) => {
        return currentDate.toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const content = {
        uk: {
            title: "Доброго дня,",
            body: { formattedDate: getFormattedDate('uk-UA') },
            car: "Мої авто",
            prom: "Акції",
            advice: "Поради",
            cal: "Календар",
            parts: ['Гальма', 'Двигун і частини двигуна', 'Фільтри', 'Кермове управління і підвіска']
        },
        en: {
            title: "Hello, Pavlo!",
            body: { formattedDate: getFormattedDate('en-US') },
            car: "My cars",
            prom: "Promotions",
            advice: "Advice",
            cal: "Calendar",
            parts: ['Brakes', 'Engine & Engine Parts', 'Filters', 'Steering & Suspension'],
        }
    };

    const [calendarValue, setCalendarValue] = React.useState(dayjs());


    // const fetchEvents = (date) => {
    //     const controller = new AbortController();
    //     fakeFetch(date, {
    //         signal: controller.signal,
    //     })
    //         .then(({ events }) => {
    //             setEvents(events);
    //             setIsLoading(false);
    //         })
    //         .catch((error) => {
    //             if (error.name !== 'AbortError') {
    //                 throw error;
    //             }
    //         });
    //
    //     requestAbortController.current = controller;
    // };


    React.useEffect(() => {
        setIsLoading(true); // Початок завантаження
        fetchEvents2(calendarValue, { signal: requestAbortController.current?.signal })
            .then(events => {
                console.log('Events:', events); // Перевірте дані в консолі
                setEvents(events);
                setIsLoading(false);
            })

            .catch(error => {
                console.error('Failed to fetch events:', error);
                setIsLoading(false);
            })
        ;

        return () => requestAbortController.current?.abort(); // Відміна запиту при розмонтуванні компоненту
    }, [calendarValue]); // Залежність від зміни вибраної дати




    const handleMonthChange = (date) => {
        if (requestAbortController.current) {
            requestAbortController.current.abort();
        }
        setIsLoading(true);
        setEvents([]);
        fetchEvents2(date);
    };


    return (
        <>
            <CardMedia
                component="img"
                alt="Home Image"
                height="300"
                width="100%"
                image={imageUrl}
                style={{ objectFit: 'cover' }}
            />

            <Typography variant="h5" style={{ position: "absolute", top: "100px", left: "100px", color: theme.palette.text.primary }}>
                {content[language].title + users.firstName + "!"}
            </Typography>
            <Typography variant="body1" style={{ position: "absolute", top: "135px", left: "100px", color: theme.palette.text.primary }}>
                {content[language].body.formattedDate}
            </Typography>

            <Grid container spacing={4} marginTop={-12} paddingLeft={{ xs: 1, md: 3 }} paddingRight={{ xs: 1, md: 3 }}>
                <Grid item sx={{ width: { xs: '100%', md: 'calc(100% - 450px)' } }}>
                    <HomeCard theme={theme} title={content[language].car} navigateTo={'garage'}>
                        <Stack direction="row" spacing={2}>
                            {cars.map((car, index) => (
                                <Card key={index} sx={{ background: theme.palette.background.default, width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                                    <CardMedia
                                        image={car1}
                                        title={car.carModel}
                                        component="img"
                                        width="100%"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" style={{ color: theme.palette.text.primary, textAlign: 'center' }}>
                                            {car.carModel}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    </HomeCard>


                    <HomeCard theme={theme} title={content[language].prom}
                              // navigateTo={'promotion'}
                              marginTop={10}>
                        <Stack direction="row" spacing={2}>
                            {parts.map((part, index) => (
                                <Card key={index} sx={{ background: theme.palette.background.default, width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                                    <CardMedia
                                        image={part}
                                        title={content[language].parts[index]}
                                        component="img"
                                        width="100%"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" style={{ color: theme.palette.text.primary, textAlign: 'center' }}>
                                            {content[language].parts[index]}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    </HomeCard>
                </Grid>

                <Grid item sx={{ width: { xs: '100%', md: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center' } }}>
                    <HomeCard theme={theme} title={content[language].cal} navigateTo={'calendar'}>
                        <MiniCalendar theme={theme} language={language} value={calendarValue} setValue={setCalendarValue}
                            handleMonthChange={handleMonthChange} highlightedDays={events} isLoading={isLoading} size='large' />
                    </HomeCard>
                </Grid>

            </Grid>

        </>
    );
}

export default HomePage;
