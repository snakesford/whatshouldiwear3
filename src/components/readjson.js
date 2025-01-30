import { useEffect, useState } from "react";
import data from "../weatherSample.json"

const ReadJson = () => {
    const [currentTime, setCurrentTime] = useState("");
    const [currentWeather, setCurrentWeather] = useState(null);

    useEffect(() => {
        const now = new Date();
        const formattedTime = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Los_Angeles",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        }).format(now);

        setCurrentTime(formattedTime);
    }, [])


    const [temperature, setTemperature] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=45.575&longitude=-122.851&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1')
                if (!response.ok) {
                    throw new Error("Failed to fetch weather data");
                }
                const data = await response.json();
                setCurrentWeather(data);
            } catch (error) {
                console.error("erro fetching weather:", error)
            }
        }
        fetchWeather()
    }, []);

    useEffect(() => {
        if (!currentWeather) return;
        const localTime = new Date();

        const roundedTime = new Date(localTime);
        if (localTime.getMinutes() >= 30) {
            roundedTime.setHours(localTime.getHours() + 1);
        }
        roundedTime.setMinutes(0, 0, 0);

        const zuluTime = roundedTime.toISOString().slice(0, 16);

        const timeIndex = currentWeather.hourly.time.findIndex((time) => time === zuluTime);

        if (timeIndex !== -1) {
            setTemperature(currentWeather.hourly.temperature_2m[timeIndex]);
        } else {
            console.error("No matching time found in the JSON data.");
        }
    }, [currentWeather])

    console.log(currentWeather);

    return (
        <div>
            <h1>Weather Data</h1>
            <p>{currentTime || "Loading..."}</p>
            <p>{temperature}</p>

            {/* <p>{JSON.stringify(data.hourly.temperature_2m[0], null, 2)}</p> */}
            {/* <p>Current time: {currentTime}</p> */}
            {/* {console.log(data.hourly)} */}
        </div>
    );
};

export default ReadJson;