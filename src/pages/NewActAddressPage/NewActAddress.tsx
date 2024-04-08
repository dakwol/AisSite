import React, { FC, useEffect, useState } from "react";
import "./styles.scss";

import ActsApiRequest from "../../api/Acts/Acts";

import { useDispatch } from "react-redux";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { formatDateIntlTimeDate } from "../../components/UI/functions/functions";
import FormInput from "../../components/FormInput/FormInput";
import Buttons from "../../components/Buttons/Buttons";
import icons from "../../assets/icons/icons";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../routes";

type IMunicipaliti = {
  id: string | number;
  label: string | undefined;
};

const NewActAddress: FC = () => {
  const dateAct = new Date();
  const actsApi = new ActsApiRequest();
  const [municipalitiesArray, setMunicipalitiesArray] = useState<string[]>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );

  const inputAddress = [
    {
      id: 1,
      label: "Муниципальное образование",
      key: "municipality",
      type: "field",
    },
    {
      id: 2,
      label: "Адрес",
      key: "address",
      type: "string",
    },
  ];

  useEffect(() => {
    actsApi.getMunicipalities().then((resp) => {
      if (resp.success) {
        const municipalities =
          resp.data && resp.data.results
            ? resp.data.results.map((item: any) => ({
                id: item.id,
                value: item.id,
                display_name: item.name,
              }))
            : [];
        setMunicipalitiesArray(municipalities);
      }
    });
  }, []);

  const handleChange = (fieldName: string, fieldValue: string | boolean) => {
    dispatch(DataPressActionCreators.setDataPress(fieldName, fieldValue));
  };

  console.log("dataPress", dataPress);

  return (
    <section className="section">
      <div className="containerPageSlide">
        <h1 className="titleSlide">МО и адрес происшествия</h1>

        <h4 className="dateActs">
          {dateAct && formatDateIntlTimeDate(dateAct || "")}
        </h4>

        <div className="formContainer">
          {inputAddress.map((item) => {
            return (
              <FormInput
                style={""}
                value={dataPress[item.key]}
                options={
                  item.key === "municipality" ? municipalitiesArray : undefined
                }
                onChange={(value) => handleChange(item.key, value)}
                subInput={item.label}
                required={false}
                type={item.type}
                error={""}
                keyData={item.key}
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
            text={"Тип постройки"}
            className="sliderButton"
            onClick={() => {
              navigate(RouteNames.NEWACTTYPEPAGE);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default NewActAddress;
