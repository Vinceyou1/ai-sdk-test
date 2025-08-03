import { cn } from "@/lib/utils";

// API returns this format:
// {
//     "location": {
//         "name": "London",
//         "region": "City of London, Greater London",
//         "country": "United Kingdom",
//         "lat": 51.5171,
//         "lon": -0.1062,
//         "tz_id": "Europe/London",
//         "localtime_epoch": 1754257186,
//         "localtime": "2025-08-03 22:39"
//     },
//     "current": {
//         "last_updated_epoch": 1754256600,
//         "last_updated": "2025-08-03 22:30",
//         "temp_c": 21.3,
//         "temp_f": 70.3,
//         "is_day": 0,
//         "condition": {
//             "text": "Partly Cloudy",
//             "icon": "//cdn.weatherapi.com/weather/64x64/night/116.png",
//             "code": 1003
//         },
//         "wind_mph": 5.8,
//         "wind_kph": 9.4,
//         "wind_degree": 315,
//         "wind_dir": "NW",
//         "pressure_mb": 1018.0,
//         "pressure_in": 30.06,
//         "precip_mm": 0.0,
//         "precip_in": 0.0,
//         "humidity": 56,
//         "cloud": 0,
//         "feelslike_c": 21.3,
//         "feelslike_f": 70.3,
//         "windchill_c": 19.4,
//         "windchill_f": 67.0,
//         "heatindex_c": 19.4,
//         "heatindex_f": 67.0,
//         "dewpoint_c": 10.3,
//         "dewpoint_f": 50.5,
//         "vis_km": 10.0,
//         "vis_miles": 6.0,
//         "uv": 0.0,
//         "gust_mph": 9.1,
//         "gust_kph": 14.6,
//         "short_rad": 0,
//         "diff_rad": 0,
//         "dni": 0,
//         "gti": 0
//     }
// }

type WeatherProps = {
  location: string;
  temperature: number;
  condition: string;
  icon: string; // URL to the weather icon
  is_day: boolean; // true if it's daytime, false if nighttime
  localtime: string; // Optional, local time of the weather data
};

export const Weather = ({
  temperature,
  condition,
  location,
  icon,
  is_day,
  localtime,
}: WeatherProps) => {
  return (
    <div
      className={cn("mb-4 rounded-lg p-4 text-white", {
        "bg-blue-600": is_day,
        "bg-gray-800": !is_day,
      })}
    >
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl font-semibold">{location}</h2>
        <span className="text-md">{new Date(localtime).toLocaleString()}</span>
      </div>
      <div className="mt-1 flex flex-row justify-between items-center">
        <div className="text-lg">
          <p>{condition}</p>
          <p>{temperature}°F</p>
        </div>
        <img src={icon} alt={condition} />
      </div>
    </div>
  );
};
