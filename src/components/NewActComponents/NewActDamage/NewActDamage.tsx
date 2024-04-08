import React, { FC, useEffect, useState } from "react";
import Buttons from "../../Buttons/Buttons";
import { RouteNames } from "../../../routes";
import { useNavigate } from "react-router-dom";
import { useTypeSelector } from "../../../hooks/useTypedSelector";
import ActsApiRequest from "../../../api/Acts/Acts";

const NewActDamage: FC = () => {
  const navigate = useNavigate();
  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );

  const actsApi = new ActsApiRequest();

  const [isDamageType, setIsDamageType] = useState([]);
  const [isNames, setIsNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const damageTypesResp = await actsApi.getDamageTypes();
      const namesResp = await actsApi.getNames();

      if (damageTypesResp.success && namesResp.success) {
        const damages =
          damageTypesResp.data && damageTypesResp.data.results
            ? damageTypesResp.data.results.map((item: any) => ({
                id: item.id,
                value: item.id,
                display_name: item.name,
              }))
            : [];
        setIsDamageType(damages);

        const names =
          namesResp.data && namesResp.data.results
            ? namesResp.data.results.map((item: any) => ({
                id: item.id,
                value: item.id,
                display_name: item.name,
              }))
            : [];
        setIsNames(names);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="containerPageSlide">
      <h1 className="titleSlide">Повреждения</h1>
      <Buttons
        text={"Добавить повреждение"}
        onClick={() => navigate(RouteNames.ADDDAMAGEPAGE)}
      />
      <h2 className="titlePageMini">Типы повреждений</h2>

      <div>
        {dataPress.damages &&
          dataPress.damages.map((item: any) => {
            const damageType = isDamageType.find(
              (data: any) => data.value === item.name
            );
            console.log("damageType", damageType);

            return (
              <div key={item.id}>
                <h1>
                  {damageType
                    ? //@ts-ignore
                      damageType.display_name
                    : "Unknown"}
                </h1>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default NewActDamage;
