import { useState, useEffect } from "react";
import axios from "../utils/axios";
const baseUrl = "https://image.tmdb.org/t/p/original/";
import "./Row.css";
import { useRouter } from "next/router";
function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);

      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);
  const router = useRouter();
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <React.Fragment key={movie.id}>
            {console.log(movie)}
            {movie.backdrop_path !== null ? (
              <img
                onClick={() =>
                  router.push(
                    movie?.release_date
                      ? `/movie/${
                          movie?.title ||
                          movie?.name ||
                          movie?.original_name ||
                          ""
                        }`
                      : movie?.first_air_date
                      ? `/tv/${
                          movie?.title ||
                          movie?.name ||
                          movie?.original_name ||
                          ""
                        }`
                      : ""
                  )
                }
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`${baseUrl}${
                  isLargeRow ? movie?.poster_path : movie?.backdrop_path
                }`}
                alt={movie?.name}
              />
            ) : (
              ""
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
export default Row;
