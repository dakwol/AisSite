import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FormInput from "../../components/FormInput/FormInput";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import icons from "../../assets/icons/icons";
import Buttons from "../../components/Buttons/Buttons";
import { RouteNames } from "../../routes";
import { useNavigate, useParams } from "react-router-dom";
import ActsApiRequest from "../../api/Acts/Acts";
import "./styles.scss";

const NewActCompletePage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  return (
    <section className="section">
      <div className="containerPageSlide">
        <h1 className="titleSlide">Акт подписан и отправлен</h1>

        <div className="containerComplete">
          <h4>
            Сообщите пострадавшему <br /> номер акта:
          </h4>
          <p className="numberActs">{id}</p>
          <h3>
            Пострадавший может проверить акт по адресу{" "}
            <a href="https://belid.ru" target="_blank">
              belid.ru
            </a>
          </h3>
        </div>
      </div>
      <Buttons
        text={"Вернуться на главную"}
        onClick={() => navigate(RouteNames.ACCOUNTPAGE)}
      />
    </section>
  );
};

export default NewActCompletePage;
