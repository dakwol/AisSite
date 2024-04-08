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

const AddDamagesPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );
  const actsApi = new ActsApiRequest();

  const [isDamageType, setIsDamageType] = useState();
  const [isNames, setIsNames] = useState();
  const [isData, setIsData] = useState({});

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
  const handleChange = (fieldName: string, fieldValue: string | boolean) => {
    setIsData({
      ...isData,
      [fieldName]: fieldValue,
    });
  };

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
        return setIsDamageType(damages);
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
        return setIsNames(names);
      }
    });
  }, []);

  const onSaveDamages = () => {
    if (!dataPress.damages) {
      dataPress.damages = [];
    }
    const updatedDamages = [...dataPress.damages, isData];
    console.log("updatedDamages", updatedDamages);

    dispatch(
      //@ts-ignore
      DataPressActionCreators.setDataPress("damages", updatedDamages)
    );
    navigate(-1);
  };

  console.log("dataPress", dataPress);

  return (
    <section className="section">
      <div className="containerPageSlide">
        <h1 className="titleSlide">Добавить повреждение</h1>
        <div className="formContainer">
          {inputDamage.map((item) => {
            return (
              <FormInput
                style={""}
                value={dataPress?.damages && dataPress?.damages[item.key]}
                options={item.options}
                onChange={(value) => handleChange(item.key, value)}
                subInput={item.label}
                required={false}
                type={item.type}
                error={""}
                keyData={""}
              />
            );
          })}
          <div className="containerImagePicker">
            <FilePickerModal
              type="image"
              setFiles={(e: any) => handleChange("damage_images", e)}
            />
            {dataPress?.damages?.damage_images?.length > 0 &&
              dataPress?.damages?.damage_images?.map((item: any) => {
                return (
                  <img
                    src={`${apiConfig.baseUrlMedia}${item.file}`}
                    className="imageItem"
                  ></img>
                );
              })}
          </div>
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
