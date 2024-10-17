import React, { useEffect, useState } from 'react';
import './Dashboard.css';
const Dashboard = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?q=Kyiv&appid=bd5e378503939ddaee76f12ad7a97608&units=metric');
                if (!response.ok) {
                    throw new Error('Не вдалося завантажити дані');
                }

                const data = await response.json();

                const forecastByDate = {};

                data.list.forEach(item => {
                    const itemDate = new Date(item.dt * 1000);
                    const dateKey = itemDate.toISOString().split('T')[0];
                    const timeKey = itemDate.toISOString().split('T')[1];

                    if (!forecastByDate[dateKey]) {
                        forecastByDate[dateKey] = item;
                    } else {
                        if(forecastByDate[dateKey].main.temp_max < item.main.temp){
                            forecastByDate[dateKey].main.temp_max = item.main.temp;
                        }
                        if(forecastByDate[dateKey].main.temp_min > item.main.temp){
                            forecastByDate[dateKey].main.temp_min = item.main.temp;
                        }
                    }
                    if(timeKey === "12:00:00.000Z") {
                        forecastByDate[dateKey].weather[0].icon = item.weather[0].icon;
                        console.log(item.weather[0].icon);
                    }
                });
                for (let key in forecastByDate) {
                    if (forecastByDate[key].main) {
                        console.log(forecastByDate[key].main.temp);
                        const avgTemp = (forecastByDate[key].main.temp_max + forecastByDate[key].main.temp_min) / 2;
                        forecastByDate[key].main.temp = parseFloat(avgTemp.toFixed(2));
                    }
                }



                const fiveDayForecast = Object.values(forecastByDate).slice(0, 5);

                setWeatherData(fiveDayForecast);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, []);

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="weather-container">
            <h2>Прогноз погоди на найближчі 5 днів</h2>
            {weatherData.map((item) => (
                <WeatherCard key={item.dt} data={item} />
            ))}
        </div>
    );
};

const WeatherCard = ({ data }) => {
    const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const date = new Date(data.dt * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = date.toLocaleDateString('uk-UA', options);
    formattedDate = formattedDate.replace("понеділок", "Понеділок")
    formattedDate = formattedDate.replace("вівторок", "Вівторок")
    formattedDate = formattedDate.replace("середа", "Середа")
    formattedDate = formattedDate.replace("четвер", "Четвер")
    formattedDate = formattedDate.replace("пʼятницю", "П'ятниця")
    formattedDate = formattedDate.replace("суботу", "Субота")
    formattedDate = formattedDate.replace("неділю", "Неділя")


    const windSpeed = data.wind.speed;
    const windGust = data.wind.gust;
    const windDirection = data.wind.deg;

    return (
        <div className="weather-card">
            <div className="weather-header">
                <h5>{formattedDate}</h5>
                <img src={weatherIcon} alt={data.weather[0].description} />
            </div>
            <div className="weather-info">
                <p>Температура: {data.main.temp} °C</p>
                <p>Макс: {data.main.temp_max} °C | Мін: {data.main.temp_min} °C</p>
            </div>
            <div className="weather-details">
                <p>Вологість: {data.main.humidity}%</p>
                <p>Тиск: {data.main.pressure} hPa</p>
                <p>Вітер: {windSpeed} м/с (пориви: {windGust} м/с, напрямок: {windDirection}°)</p>
            </div>
        </div>
    );
};
export default Dashboard;
