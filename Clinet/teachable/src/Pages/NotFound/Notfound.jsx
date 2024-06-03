import React from "react";
import NotFoundImg from "../../Assets/Images/Notfound/notFound.png";
import { Link } from "react-router-dom";
import "./Style/notfound.css";
import { getAuthUser } from "../../Helper/Storage";
const Notfound = () => {
  const userRole = getAuthUser().data.data.user.role;
  return (
    <section className="notfound">
      <div className="container">
        <div className="notFound-img">
          <img src={NotFoundImg} alt="notfound" loading="lazy" />
        </div>
        <Link to={`/${userRole}/home`} className="back-home">
          Go to Home
        </Link>
      </div>
    </section>
  );
};

export default Notfound;
