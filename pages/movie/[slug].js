import { useEffect, useState } from "react";
import { API_KEY } from "../../utils/requests";
import { useRouter } from "next/router";
import Youtube from "react-youtube";
import axios from "../../utils/axios";
import movieTrailer from "movie-trailer";
import Nav from "../../components/Nav";

function Movie() {
  const router = useRouter();
  const { slug } = router.query;
  const baseUrl = "https://image.tmdb.org/t/p/original";
  const [moviesearch, setMoviesearch] = useState("");
  const [movieid, setMovieid] = useState("");
  const [cast, setCast] = useState([]);
  const [movie, setMovie] = useState("");
  const [showimage, setShowImage] = useState(true);
  const [error, setError] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      if (isSubscribed) {
        if (slug === undefined) {
          setLoading(true);
        } else {
          let fetchUrl1 = `search/movie?api_key=${API_KEY}&query=${slug}`;
          const request1 = await axios.get(fetchUrl1);
          setMoviesearch(request1.data.results[0]);
          setMovieid(request1.data.results[0].id);
          setLoading(false);
          if (movieid) {
            let fetchUrl2 = `/movie/${movieid}/credits?api_key=${API_KEY}`;
            const request2 = await axios.get(fetchUrl2);
            setCast(request2.data.cast);
            let fetchUrl3 = `/movie/${movieid}?api_key=${API_KEY}`;
            const request3 = await axios.get(fetchUrl3);
            setMovie(request3.data);
          }

          return request1;
        }
      }
    }
    fetchData();
    return () => (isSubscribed = false);
  }, [movieid, slug]);

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      setShowImage(false);
      movieTrailer(movie?.title || movie?.name || movie?.original_name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((e) => {
          console.table(e);
          setError(e.message);
        });
    }
  };
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  return (
    <>
      <Nav />
      {loading ? (
        "Loading..."
      ) : (
        <div className="movie-container">
          <br />

          <div className="movie">
            <img
              className="imagemovie"
              src={`${baseUrl}${moviesearch?.poster_path}`}
              alt={moviesearch?.original_title || moviesearch?.title}
            />
            <br />
            <div className="details">
              <h1>{moviesearch?.original_title || moviesearch?.title}</h1>
              <br />
              {moviesearch?.adult ? "18+" : ""}
              {moviesearch?.overview}
              <br />
              <br />
              <div
                style={{ display: "flex", alignItems: "center", padding: "0" }}
              >
                <h4 style={{ marginRight: "20px" }}>Genres</h4>
                {movie &&
                  movie?.genres.map((m) => (
                    <li
                      key={m.id}
                      style={{
                        fontSize: "14px",
                        listStyleType: "none",
                        marginRight: "10px",
                        justifyContent: "flex-end",
                      }}
                    >
                      {m.name}
                    </li>
                  ))}
              </div>
              <h4 style={{ marginBottom: "10px" }}>
                Runtime
                <span
                  style={{
                    fontSize: "14px",
                    marginLeft: "10px",
                  }}
                >
                  {movie?.runtime}
                </span>{" "}
                Mins
              </h4>

              <div style={{ display: "flex", marginBottom: "10px" }}>
                <a
                  style={{
                    textDecoration: "none",
                    color: "#D91921",
                    marginRight: "20px",
                  }}
                  href={movie?.homepage}
                  target="_blank"
                >
                  <h4>Movie Page</h4>
                </a>

                <a
                  target="_blank"
                  href={`https://imdb.com/title/${movie?.imdb_id}`}
                  style={{ textDecoration: "none", color: "#e2b616" }}
                >
                  <h4>imdb</h4>
                </a>
              </div>

              <h2
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(movie)}
              >
                Play Trailer
              </h2>
              {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
              <p
                style={{ marginTop: "10px", color: "red", fontWeight: "bold" }}
              >
                {error}
              </p>
            </div>
          </div>
          <h2 style={{ marginLeft: "20px" }}>Cast</h2>
          <div className="casts">
            {cast.map((c) => (
              <React.Fragment key={c.cast_id}>
                {c.profile_path !== null ? (
                  <>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => router.push(`/person/${c?.name}`)}
                      className="cast"
                    >
                      <img
                        width="100px"
                        src={`${baseUrl}${c?.profile_path}`}
                        alt={c.name}
                      />
                      <li>
                        <strong>{c.name}</strong>
                      </li>
                      <li>{c.character}</li>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
export default Movie;
