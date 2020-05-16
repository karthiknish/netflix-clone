import { useState, useEffect } from "react";
import axios from "../utils/axios";
import requests from "../utils/requests";
import "./Banner.css";
const baseUrl = "https://image.tmdb.org/t/p/original/";
function Banner() {
  const [movie, setMovie] = useState("");
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length)
        ]
      );
      return request;
    }
    fetchData();
  }, []);
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  return (
    <header
      style={{
        backgroundSize: "cover",
        backgroundImage: `linear-gradient(180deg,
    transparent,
    rgba(37, 37, 37, 0.61),
    #111),url(${baseUrl}${movie?.backdrop_path})`,
        backgroundPosition: "center center",
      }}
      className="banner"
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner__buttons">
          <button className="banner__button">Play</button>
          <button className="banner__button">My List</button>
        </div>
        <h1 className="banner__description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>
    </header>
  );
}
export default Banner;
