import React, { FC, useEffect, useState } from "react";
import ActsApiRequest from "../../../api/Acts/Acts";
import "./styles.scss";
import { DataPressActionCreators } from "../../../store/reducers/dataPressItem/action-creator";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../../../hooks/useTypedSelector";

type iBuildTypes = {
  id: string;
  name: string;
  is_victim: boolean;
};

const NewActType: FC = () => {
  const actsApi = new ActsApiRequest();
  const [typeArray, setTypeArray] = useState<iBuildTypes[]>([]);
  const dispatch = useDispatch();
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

  return (
    <div className="containerPageSlide">
      <h1 className="titleSlide">Выберите один из типов постройки</h1>

      <div className="typeContainer">
        {typeArray.length > 0 &&
          typeArray.map((item) => {
            return (
              <div
                className={`typeItem ${item.id === dataPress.type && "active"}`}
                onClick={() => handleChange("type", item.id)}
              >
                {item.name}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default NewActType;
