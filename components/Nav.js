import { useEffect, useState } from "react";
import "./Nav.css";
import { useRouter } from "next/router";

function Nav() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setShow(true);
      } else setShow(false);
    });
    // return () => window.removeEventListener("scroll");
  }, []);
  const router = useRouter();
  return (
    <div className={`nav ${show && "nav__black"}`}>
      <img
        onClick={() => router.push("/")}
        className="nav__logo"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png"
        alt="Netflix Logo"
      />{" "}
      <img
        className="nav__avatar"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRvTJetDBH8ZI4zzlxme4aqq19cDi_RFLuE4w&usqp=CAU"
        alt="user-logo"
      />
    </div>
  );
}

export default Nav;
