import React, { FC, useEffect, useState } from "react";
import "./styles.scss";
import { useDispatch } from "react-redux";
import ActsApiRequest from "../../api/Acts/Acts";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import icons from "../../assets/icons/icons";
import Buttons from "../../components/Buttons/Buttons";
import { RouteNames } from "../../routes";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../components/UI/functions/functions";
import ErrorMessage from "../../components/UI/ErrorMassage/ErrorMassage";

type iBuildTypes = {
  id: string;
  name: string;
  is_victim: boolean;
};

const NewActType: FC = () => {
  const actsApi = new ActsApiRequest();
  const [typeArray, setTypeArray] = useState<iBuildTypes[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const userInfo = decryptData(localStorage.getItem("account") || "") || "{}";
  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );

  useEffect(() => {
    actsApi.getBuildingTypes().then((resp) => {
      if (resp.success) {
        resp.data && setTypeArray(resp.data.results);
      }
    });
  }, []);

  console.log("typeArray", typeArray);

  const handleChange = (fieldName: string, fieldValue: string | boolean) => {
    dispatch(DataPressActionCreators.setDataPress(fieldName, fieldValue));
  };

  const movingOn = () => {
    dispatch(DataPressActionCreators.setDataPress("employee", userInfo.id));

    if (dataPress.building_type) {
      const selectedType = typeArray.find(
        (item) => item.id === dataPress.building_type
      );

      if (selectedType && selectedType.is_victim) {
        navigate(RouteNames.NEWACTVICTIMPAGE);
      } else {
        navigate(RouteNames.NEWACTDAMAGEPAGE);
      }
    } else {
      setIsError(true);
    }
  };

  return (
    <section className="section">
      {isError && (
        <ErrorMessage
          type={"error"}
          message={"не все поля заполнены"}
          onClose={() => setIsError(false)}
        />
      )}
      <div className="containerPageSlide">
        <h1 className="titleSlide">Выберите один из типов постройки</h1>

        <div className="typeContainer">
          {typeArray.length > 0 &&
            typeArray.map((item) => {
              return (
                <div
                  className={`typeItem ${
                    item.id === dataPress.building_type && "active"
                  }`}
                  onClick={() => handleChange("building_type", item.id)}
                >
                  {item.name}
                </div>
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
              movingOn();
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default NewActType;
