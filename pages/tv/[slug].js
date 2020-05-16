import { useEffect, useState } from "react";
import { API_KEY } from "../../utils/requests";
import { useRouter } from "next/router";
import Youtube from "react-youtube";
import axios from "../../utils/axios";
import movieTrailer from "movie-trailer";
import Nav from "../../components/Nav";

function Tv() {
  const router = useRouter();
  const { slug } = router.query;
  const baseUrl = "https://image.tmdb.org/t/p/original";
  const [tvsearch, setTvsearch] = useState("");
  const [tvid, setTvid] = useState("");
  const [cast, setCast] = useState([]);
  const [tv, setTv] = useState("");
  const [showimage, setShowImage] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      if (isSubscribed) {
        if (slug === undefined) {
          setLoading(true);
        } else {
          let fetchUrl1 = `search/tv?api_key=${API_KEY}&query=${slug}`;
          const request1 = await axios.get(fetchUrl1);
          setTvsearch(request1.data.results[0]);
          setTvid(request1.data.results[0].id);
          setLoading(false);
          if (tvid) {
            let fetchUrl2 = `/tv/${tvid}/credits?api_key=${API_KEY}`;
            const request2 = await axios.get(fetchUrl2);
            setCast(request2.data.cast);
            let fetchUrl3 = `/tv/${tvid}?api_key=${API_KEY}`;
            const request3 = await axios.get(fetchUrl3);
            setTv(request3.data);
          }

          return request1;
        }
      }
    }
    fetchData();
    return () => (isSubscribed = false);
  }, [tvid, slug]);

  const handleClick = (tv) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      setShowImage(false);
      movieTrailer(tv?.name || tv?.original_name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((e) => {
          setError("No trailer found");
          console.error(e);
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
        <div className="tv-container">
          <br />
          {/* {console.log(tv)} */}
          <div className="movie">
            <img
              className="imagemovie"
              src={`${baseUrl}${tvsearch?.poster_path}`}
              alt={tvsearch?.original_title || tvsearch?.title}
            />
            <br />
            <div className="details">
              <h1>{tvsearch?.original_title || tvsearch?.title}</h1>
              <br />
              {tvsearch?.adult ? "18+" : ""}
              {tvsearch?.overview}
              <br />
              <br />
              <div
                style={{ display: "flex", alignItems: "center", padding: "0" }}
              >
                <h4 style={{ marginRight: "20px" }}>Genres</h4>
                {tv &&
                  tv?.genres.map((m) => (
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
                  {tv?.runtime}
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
                  href={tv?.homepage}
                  target="_blank"
                >
                  <h4>Tv Page</h4>
                </a>
                {"   "}
                <a
                  target="_blank"
                  href={`https://imdb.com/title/${tv?.imdb_id}`}
                  style={{ textDecoration: "none", color: "#e2b616" }}
                >
                  <h4>imdb</h4>
                </a>
              </div>

              <h2 style={{ cursor: "pointer" }} onClick={() => handleClick(tv)}>
                Play Trailer <span style={{ color: "#D91921" }}>{error}</span>
              </h2>
              {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
            </div>
          </div>
          <h2 style={{ marginLeft: "20px" }}>Cast</h2>
          <div className="casts">
            {cast.map((c) => (
              <React.Fragment key={c.id}>
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
export default Tv;
