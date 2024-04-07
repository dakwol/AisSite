import React from "react";
import "./styles.scss";
import Buttons from "../../components/Buttons/Buttons";
import icons from "../../assets/icons/icons";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="containerErrorPage">
      <h1>404</h1>
      <h2>страница не найдена</h2>
      <Buttons
        text={"Вернуться назад"}
        onClick={() => {
          navigate(-1);
        }}
        ico={icons.arrowLeft}
        className="orangeButton"
      />
    </div>
  );
};

export default ErrorPage;
