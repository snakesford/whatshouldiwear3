import { useEffect, useState } from "react";
import data from "../weatherSample.json"

const ReadJson = () => {
    const [currentTime, setCurrentTime] = useState("");
    const [currentWeather, setCurrentWeather] = useState(null);
    const [temperature, setTemperature] = useState(null);
    const [timeIndex, setTimeIndex] = useState(null)

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

        const localTimeIndex = currentWeather.hourly.time.findIndex((time) => time === zuluTime);
        setTimeIndex(localTimeIndex)

        if (localTimeIndex !== -1) {
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
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Temperature (°F)</th>
                    </tr>
                </thead>
                <tbody>
                    {currentWeather && currentWeather.hourly && currentWeather.hourly.time.slice(timeIndex, timeIndex + 4).map((time, index) => (
                        <tr key={time}>
                            <td>{new Date(time + "Z").toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: '2-digit', minute: '2-digit', hour12: true})}</td>
                            <td>{currentWeather.hourly.temperature_2m[timeIndex + index]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* <p>{currentWeather && currentWeather.hourly && currentWeather.hourly.temperature_2m[timeIndex] !== undefined ? currentWeather.hourly.temperature_2m[timeIndex+1] : "loading..."}</p> */}
        </div>
    );
};

export default ReadJson;