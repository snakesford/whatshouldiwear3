import React, { useEffect, useState } from "react";
import data from "../weatherSample.json"

const ReadJson = () => {
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formattedTime = new Intl.DateTimeFormat("en-US", {
                timeZone: "America/Los_Angeles",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }).format(now);

            setCurrentTime(formattedTime);
        }

        const invtervalID = setInterval(updateTime, 1000);

        return () => clearInterval(invtervalID);
    }, []);


    const [temperature, setTemperature] = useState(null);

    useEffect(() => {
        // Step 1: Get the current time in Portland
        const localTime = new Date();
    
        // Step 2: Round the time to the nearest hour
        const roundedTime = new Date(localTime);
        if (localTime.getMinutes() >= 30) {
          // Add an extra hour if 30 minutes or more
          roundedTime.setHours(localTime.getHours() + 1);
        }
        // Set minutes, seconds, and milliseconds to zero
        roundedTime.setMinutes(0, 0, 0);
    
        // Step 3: Convert the rounded time to Zulu (UTC) time
        const zuluTime = roundedTime.toISOString().slice(0, 16); // Matches JSON time format
    
        // Step 4: Find the index of the matching time in the JSON
        const timeIndex = data.hourly.time.findIndex((time) => time === zuluTime);
    
        // Step 5: Get the temperature value
        if (timeIndex !== -1) {
          setTemperature(data.hourly.temperature_2m[timeIndex]);
        } else {
          console.error("No matching time found in the JSON data.");
        }
      }, []);




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