import React, { FC, useEffect, useState } from "react";
import Buttons from "../../components/Buttons/Buttons";
import icons from "../../assets/icons/icons";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import ImagePicker from "../../components/UI/ImagePicker/ImagePicker";
import FilePickerModal from "../../components/UI/FilePickerModal/FilePickerModal";
import ActsApiRequest from "../../api/Acts/Acts";
import apiConfig from "../../api/apiConfig";
import "./styles.scss";
import FormDamage from "../../components/FormDamage/FormDamage";

const AddDamagesPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );
  const actsApi = new ActsApiRequest();

  const [isDamageType, setIsDamageType] = useState<any[]>([]);
  const [isNames, setIsNames] = useState<any[]>([]);
  const [isDamageArray, setIsDamageArray] = useState<any[]>([]);

  const [damageArrayCount, setDamageArrayCount] = useState(1);
  const [isTypeDamage, setIsTypeDamage] = useState<string | number>("");

  console.log("da", dataPress);

  const inputDamage = [
    {
      id: 1,
      label: "Тип повреждения",
      key: "damage_type",
      type: "field",
      options: isDamageType || [],
    },
    {
      id: 2,
      label: "Наименование",
      key: "name",
      type: "field",
      options: isNames || [],
    },
    {
      id: 3,
      label: "Количество",
      key: "count",
      type: "string",
    },
    {
      id: 4,
      label: "Примечание",
      key: "note",
      type: "string",
    },
  ];

  useEffect(() => {
    actsApi.getDamageTypes().then((resp) => {
      if (resp.success) {
        const damages =
          resp.data && resp.data.results
            ? resp.data.results.map((item: any) => ({
                id: item.id,
                value: item.id,
                display_name: item.name,
              }))
            : [];
        setIsDamageType(damages);
      }
    });
    actsApi.getNames().then((resp) => {
      if (resp.success) {
        const names =
          resp.data && resp.data.results
            ? resp.data.results.map((item: any) => ({
                id: item.id,
                value: item.id,
                display_name: item.name,
              }))
            : [];
        setIsNames(names);
      }
    });
  }, []);

  const handleChange = (
    index: number,
    fieldName: string,
    fieldValue: string | boolean
  ) => {
    console.log("index", isDamageType);
    console.log("index", index);

    if (index === isDamageArray.length) {
      // Если индекс равен номеру объекта в массиве, добавляем новый объект
      setIsDamageArray((prevArray) => [
        ...prevArray,
        {
          [fieldName]: fieldValue,
          damage_type: isTypeDamage || null,
        },
      ]);
    } else {
      // Если индекс не равен номеру объекта в массиве, обновляем существующий объект
      setIsDamageArray((prevArray) =>
        prevArray.map((item, idx) =>
          idx === index
            ? {
                ...item,
                [fieldName]: fieldValue,
                damage_type: isTypeDamage || null,
              }
            : item
        )
      );
    }
  };

  const onSaveDamages = () => {
    const updatedDamages = dataPress.damages
      ? [...dataPress.damages, ...isDamageArray]
      : [...isDamageArray];

    dispatch(
      //@ts-ignore
      DataPressActionCreators.setDataPress("damages", updatedDamages)
    );
    navigate(-1);
  };

  const addDamageBlock = () => {
    setDamageArrayCount(damageArrayCount + 1);
  };

  return (
    <section className="section">
      <div className="containerPageSlide">
        <h1 className="titleSlide">Добавить повреждение</h1>
        {[...Array(damageArrayCount)].map((_, index) => (
          <FormDamage
            key={index}
            index={index}
            inputDamage={inputDamage}
            dataPress={dataPress}
            handleChange={(index, key, value) =>
              handleChange(index, key, value)
            }
            handleType={(e) => setIsTypeDamage(e)}
          />
        ))}
        <Buttons text={"Добавить блок"} onClick={addDamageBlock} />

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
            ico={icons.checkBlack}
            text={"Сохранить"}
            className="sliderButton"
            onClick={() => {
              onSaveDamages();
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default AddDamagesPage;
