import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActsApiRequest from "../../api/Acts/Acts";
import Buttons from "../../components/Buttons/Buttons";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { RouteNames } from "../../routes";
import icons from "../../assets/icons/icons";
import "./styles.scss";
import { decryptData } from "../../components/UI/functions/functions";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import { useDispatch } from "react-redux";
import UserApiRequest from "../../api/User/Users";

interface DamageType {
  id: number;
  value: string;
  display_name: string;
}

interface Name {
  id: number;
  value: string;
  display_name: string;
}

const NewActDamage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );

  const actsApi = new ActsApiRequest();
  const userApi = new UserApiRequest();

  const [damageTypes, setDamageTypes] = useState<DamageType[]>([]);
  const [names, setNames] = useState<Name[]>([]);
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const damageTypesResp = await actsApi.getDamageTypes();
      const namesResp = await actsApi.getNames();

      if (damageTypesResp.success && namesResp.success) {
        const damageTypesData =
          damageTypesResp.data && damageTypesResp.data.results
            ? damageTypesResp.data.results.map((item: any) => ({
                id: item.id,
                value: item.id,
                display_name: item.name,
              }))
            : [];
        setDamageTypes(damageTypesData);

        const namesData =
          namesResp.data && namesResp.data.results
            ? namesResp.data.results.map((item: any) => ({
                id: item.id,
                value: item.id,
                display_name: item.name,
              }))
            : [];
        setNames(namesData);
      }
    };

    fetchData();
  }, []);
  const handleCreateActs = () => {
    if (dataPress?.victim?.phone_number) {
      userApi
        .list({ urlParams: `?phone_number=${dataPress.victim.phone_number}` })
        .then((resp) => {
          //@ts-ignore
          if (resp.success && resp.data.results.length > 0) {
            dispatch(
              DataPressActionCreators.setDataPress("victim", {
                ...dataPress.victim,
                //@ts-ignore
                ["id"]: resp.data.results[0].id, // Fix this line
              })
            );
            createAct();
          } else {
            createAct();
          }
        });
    } else {
      createAct();
    }
  };

  const createAct = () => {
    actsApi.create({ body: dataPress }).then((resp) => {
      if (resp.success) {
        dataPress.victim
          ? //@ts-ignore
            navigate(`${RouteNames.NEWACTSIGNINGPAGE}/${resp.data.id}`, {
              //@ts-ignore
              id: resp.data.id,
            })
          : //@ts-ignore
            navigate(`${RouteNames.NEWACTCOMPLETEPAGE}/${resp.data.number}`, {
              //@ts-ignore
              id: resp.data.number,
            });
      }
    });
  };

  return (
    <section className="section">
      <div className="containerPageSlide">
        <h1 className="titleSlide">Повреждения</h1>
        <Buttons
          text={"Добавить повреждение"}
          onClick={() => navigate(RouteNames.ADDDAMAGEPAGE)}
        />
        <h2 className="titlePageMini">Типы повреждений</h2>

        <div className="damageContainer">
          {dataPress.damages &&
            Object.values(
              dataPress.damages.reduce((acc: any, item: any) => {
                const damageType = damageTypes.find(
                  (type: DamageType) => type.value === item.damage_type
                );
                if (!damageType) {
                  return acc;
                }
                const key = damageType.id;
                if (!acc[key]) {
                  acc[key] = {
                    damageType,
                    damageItems: [],
                  };
                }
                acc[key].damageItems.push(item);
                return acc;
              }, {})
            ).map(({ damageType, damageItems }: any) => (
              <div key={damageType.id} className="damageItem">
                <h1 className="damageTitle">{damageType.display_name}</h1>
                {damageItems.map((damageItem: any) => {
                  const damageName = names.find(
                    (nameItem: Name) => nameItem.value === damageItem.name
                  );
                  return (
                    <div
                      key={damageName && damageName.id}
                      className="containerDamageData"
                    >
                      <p>{damageName && damageName.display_name}</p>
                      <p>{damageItem.count}</p>
                    </div>
                  );
                })}
                <p className="deleteButton">Удалить</p>
              </div>
            ))}
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
          {dataPress.victim ? (
            <Buttons
              ico={icons.arrowRightOrange}
              text={"Подписание"}
              className="sliderButton"
              onClick={() => {
                handleCreateActs();
              }}
            />
          ) : (
            <Buttons
              ico={icons.checkBlack}
              text={"Подписать"}
              className="sliderButton"
              onClick={() => {
                handleCreateActs();
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default NewActDamage;
