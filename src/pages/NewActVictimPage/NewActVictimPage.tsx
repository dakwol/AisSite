import React, { FC } from "react";
import { useDispatch } from "react-redux";
import FormInput from "../../components/FormInput/FormInput";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import icons from "../../assets/icons/icons";
import Buttons from "../../components/Buttons/Buttons";
import { RouteNames } from "../../routes";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../components/UI/functions/functions";

const NewActVictim: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );
  const inputVictim = [
    {
      id: 1,
      label: "Фамилия",
      key: "last_name",
      type: "string",
    },
    {
      id: 2,
      label: "Имя",
      key: "first_name",
      type: "string",
    },
    {
      id: 3,
      label: "Отчество",
      key: "patronymic",
      type: "string",
    },
    {
      id: 4,
      label: "Мобильный телефон",
      key: "phone_number",
      type: "phone",
    },
  ];

  const handleChange = (fieldName: string, fieldValue: string | boolean) => {
    dispatch(
      DataPressActionCreators.setDataPress("victim", {
        ...dataPress.victim,
        [fieldName]: fieldValue,
      })
    );
  };
  return (
    <section className="section">
      <div className="containerPageSlide">
        <h1 className="titleSlide">Данные пострадавшего/представителя</h1>

        <div className="formContainer">
          {inputVictim.map((item) => {
            return (
              <FormInput
                style={""}
                value={dataPress?.victim && dataPress?.victim[item.key]}
                onChange={(value) => handleChange(item.key, value)}
                subInput={item.label}
                required={false}
                type={item.type}
                error={""}
                keyData={""}
                helpText={
                  item.key === "phone_number"
                    ? "На этот номер пострадавшему/представителю придет СМС для подписания акта"
                    : ""
                }
              />
            );
          })}
        </div>
        <div className="containerButtonSlider">
          <Buttons
            ico={icons.arrowLeft}
            text={""}
            className="sliderButton"
            onClick={() => {
              navigate(-1);
            }}
          />
          <Buttons
            ico={icons.arrowRightOrange}
            text={"Далее"}
            className="sliderButton"
            onClick={() => {
              navigate(RouteNames.NEWACTDAMAGEPAGE);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default NewActVictim;
