import React, { FC, Fragment, useEffect, useState } from "react";
import "./styles.scss";
import { RouteNames } from "../../routes";
import { useNavigate } from "react-router-dom";
import { ISendModeration } from "../../models/ISendModeration";
import { ISendLogin } from "../../models/ISendLogin";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import icons from "../../assets/icons/icons";
import UserApiRequest from "../../api/User/Users";
import Buttons from "../../components/Buttons/Buttons";

const Login: FC = () => {
  const navigation = useNavigate();

  return (
    <Fragment>
      <section className="section">
        <div className="containerPage">
          <div className="logoContainer">
            <img src={icons.Bellogo} className="belLogo"></img>
            <h1 className="titleLogo">АИС «Контроль повреждений»</h1>
          </div>

          <div className="containerLogin">
            <h4 className="titleText">
              Вы пострадавший/представитель пострадавшего?
            </h4>
          </div>
        </div>
        <div className="containerButton">
          <Buttons
            text={"Проверка акта"}
            onClick={() =>
              navigation(`${RouteNames.PHONEPAGE}/${"victim"}`, {
                //@ts-ignore
                type: "victim",
              })
            }
          />
          <Buttons
            text={"Вход для сотрудников"}
            onClick={() =>
              navigation(`${RouteNames.PHONEPAGE}/${"employee"}`, {
                //@ts-ignore
                type: "employee",
              })
            }
            className="whiteButton"
          />
        </div>
      </section>
    </Fragment>
  );
};

export default Login;
