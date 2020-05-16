import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "../../utils/axios";
import { API_KEY } from "../../utils/requests";
import Nav from "../../components/Nav";

function Person() {
  const router = useRouter();
  const { slug } = router.query;
  const baseUrl = "https://image.tmdb.org/t/p/original";
  const [personsearch, setPersonsearch] = useState("");
  const [personid, setPersonid] = useState("");
  const [person, setPerson] = useState("");
  const [loading, setLoading] = useState(true);
  const [cast, setCast] = useState([]);
  const [images, setImages] = useState([]);
  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      if (isSubscribed) {
        if (slug === undefined) {
          setLoading(true);
        } else {
          let fetchUrl1 = `/search/person?api_key=${API_KEY}&query=${slug}`;
          const request1 = await axios.get(fetchUrl1);
          setPersonsearch(request1.data.results[0]);
          setPersonid(request1.data.results[0].id);
          setLoading(false);
          if (personid) {
            let fetchUrl2 = `/person/${personid}?api_key=${API_KEY}`;
            const request2 = await axios.get(fetchUrl2);
            setPerson(request2.data);
            let fetchUrl3 = `/person/${personid}/movie_credits?api_key=${API_KEY}`;
            const request3 = await axios.get(fetchUrl3);
            setCast(request3.data.cast);
            let fetchUrl4 = `/person/${personid}/images?api_key=${API_KEY}`;
            const response4 = await axios.get(fetchUrl4);
            setImages(response4.data.profiles);
          }
          return request1;
        }
      }
    }
    fetchData();
    return () => (isSubscribed = false);
  }, [slug, personid]);
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  return (
    <>
      <Nav />
      {loading ? (
        "Loading..."
      ) : (
        <div className="person-container">
          <br />
          <div className="person">
            <img
              className="imageperson"
              src={`${baseUrl}${personsearch.profile_path}`}
              alt={personsearch?.original_title || personsearch?.title}
            />
            <br />
            <div className="overviewperson">
              <h1>{personsearch.name}</h1>
              <h3>{personsearch.known_for_department}</h3>
              <h3>Birthday </h3>
              {person.birthday}
              <br />
              <h3>Biography</h3>{" "}
              <span style={{ marginRight: "20px", marginBottom: "5px" }}>
                {truncate(person.biography, 500)}
              </span>
              <a
                target="_blank"
                href={`https://imdb.com/name/${person?.imdb_id}`}
                style={{ textDecoration: "none", color: "#e2b616" }}
              >
                <h4>imdb</h4>
              </a>
            </div>
          </div>
          <h2 style={{ marginLeft: "20px" }}>Known for</h2>
          <div className="knowns">
            {cast.map((c) => (
              <React.Fragment key={c.id}>
                {c.poster_path !== null ? (
                  <>
                    <div className="known">
                      <img
                        onClick={() =>
                          c?.release_date
                            ? router.push(
                                c?.release_date
                                  ? `/movie/${
                                      c?.title || c?.name || c?.original_name
                                    }`
                                  : ""
                              )
                            : ""
                        }
                        width="100px"
                        alt=""
                        src={`${baseUrl}${c.poster_path}`}
                      />
                      <li style={{ fontSize: "16px" }}>
                        <strong>
                          {truncate(
                            c?.title || c?.name || c?.original_name || "",
                            30
                          )}
                        </strong>
                      </li>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <li
                          style={{
                            fontSize: "12px",
                            marginLeft: "5px",
                            marginRight: "5px",
                          }}
                        >
                          As
                        </li>{" "}
                        <li style={{ fontSize: "14px" }}>
                          {" "}
                          {truncate(c.character, 15)}
                        </li>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </React.Fragment>
            ))}
          </div>
          <div style={{ marginLeft: "10px" }}>Latest posts</div>
          <div className="pics">
            {images.map((i) => (
              <div className="pic">
                <img width="100px" src={`${baseUrl}${i.file_path}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Person;
