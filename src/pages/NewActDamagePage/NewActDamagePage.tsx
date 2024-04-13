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
import ErrorMessage from "../../components/UI/ErrorMassage/ErrorMassage";

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
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const damageTypesResp = await actsApi.getDamageTypes();
      // const namesResp = await actsApi.getNames();

      if (damageTypesResp.success) {
        const damageTypesData =
          damageTypesResp.data && damageTypesResp.data.results
            ? damageTypesResp.data.results.map((item: any) => ({
                id: item.id,
                value: item.id,
                display_name: item.name,
              }))
            : [];
        setDamageTypes(damageTypesData);

        // const namesData =
        //   namesResp.data && namesResp.data.results
        //     ? namesResp.data.results.map((item: any) => ({
        //         id: item.id,
        //         value: item.id,
        //         display_name: item.name,
        //       }))
        //     : [];
        // setNames(namesData);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
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
          }
        });
    }
  }, []);

  const handleCreateActs = (isSms: boolean, isPhoto: boolean) => {
    createAct(isSms, isPhoto);
  };

  const createAct = (isSms: boolean, isPhoto: boolean) => {
    actsApi.create({ body: dataPress }).then((resp) => {
      if (resp.success) {
        dataPress.victim && isSms
          ? //@ts-ignore
            navigate(`${RouteNames.NEWACTSIGNINGPAGE}/${resp.data.id}`, {
              //@ts-ignore
              id: resp.data.id,
            })
          : isPhoto
          ? navigate(
              //@ts-ignore
              `${RouteNames.NEWACTSIGNINPHOTOGPAGE}/${resp.data.id}`,
              {
                //@ts-ignore
                id: resp.data.id,
              }
            )
          : //@ts-ignore
            navigate(`${RouteNames.NEWACTCOMPLETEPAGE}/${resp.data.number}`, {
              //@ts-ignore
              id: resp.data.number,
            });
      } else {
        setIsError(true);
      }
    });
  };
  const handleDeleteDamage = (
    damageType: DamageType,
    damageItemToDelete: any
  ) => {
    let deleted = false;

    // Создаем новый массив повреждений, исключая удаляемый объект
    const updatedDamages = dataPress.damages.filter((item: any) => {
      if (
        !deleted &&
        item.damage_type === damageType.value &&
        item.name === damageItemToDelete.name
      ) {
        deleted = true; // Устанавливаем флаг, что элемент был удален
        return false; // Удаляем только первый найденный элемент с совпадающим именем
      }
      return true; // Оставляем все остальные элементы без изменений
    });

    // Обновляем состояние dataPress, заменяя старый массив обновленным
    dispatch(DataPressActionCreators.setDataPress("damages", updatedDamages));
  };

  return (
    <section className="section">
      {isError && (
        <ErrorMessage
          type={"error"}
          message={"Произошла ошибка"}
          onClose={() => setIsError(false)}
        />
      )}
      <div className="containerPageSlide">
        <h1 className="titleSlide">Повреждения</h1>
        <Buttons
          text={"Добавить повреждение"}
          onClick={() => navigate(RouteNames.ADDDAMAGEPAGE)}
        />
        <h2 className="titlePageMini">Типы повреждений</h2>

        <div className="damageContainer">
          {dataPress.damages &&
            dataPress.damages.map((item: any) => {
              const damageType = damageTypes.find(
                (type: DamageType) => type.value === item.damage_type
              );
              if (!damageType) {
                return null;
              }
              return (
                <div key={item.id} className="damageItem">
                  <div className="containerDamageData">
                    <h1 className="damageTitle">{damageType.display_name}</h1>
                    <p>{item.count}</p>
                  </div>
                  <p
                    className="deleteButton"
                    onClick={() => handleDeleteDamage(damageType, item)}
                  >
                    Удалить
                  </p>
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
          {dataPress.victim ? (
            <Buttons
              ico={icons.arrowRightOrange}
              text={"Подписание"}
              className="sliderButton"
              onClick={() => {
                handleCreateActs(true, false);
              }}
            />
          ) : (
            <Buttons
              ico={icons.checkBlack}
              text={"Подписать"}
              className="sliderButton"
              onClick={() => {
                handleCreateActs(false, false);
              }}
            />
          )}
          {dataPress.victim && (
            <Buttons
              ico={icons.arrowRightOrange}
              text={"Подписание без СМС"}
              className="sliderButtonAll"
              onClick={() => {
                handleCreateActs(false, true);
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default NewActDamage;
