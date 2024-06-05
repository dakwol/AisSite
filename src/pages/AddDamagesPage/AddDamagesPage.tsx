import React, { FC, Fragment, useEffect, useState } from "react";
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
import ErrorMessage from "../../components/UI/ErrorMassage/ErrorMassage";

const AddDamagesPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );
  const actsApi = new ActsApiRequest();

  const [isDamageType, setIsDamageType] = useState<any[]>([]);
  const [isError, setIsError] = useState(false);

  const [selectedDamageTypes, setSelectedDamageTypes] = useState<any[]>([]);

  console.log("====================================");
  console.log("dataPress", dataPress);
  console.log("====================================");

  useEffect(() => {
    actsApi.getDamageTypes().then((resp) => {
      if (resp.success && resp.data) {
        setIsDamageType(resp.data.results);
      }
    });
    // actsApi.getNames().then((resp) => {
    //   if (resp.success) {
    //     const names =
    //       resp.data && resp.data.results
    //         ? resp.data.results.map((item: any) => ({
    //             id: item.id,
    //             value: item.id,
    //             display_name: item.name,
    //           }))
    //         : [];
    //     setIsNames(names);
    //   }
    // });
  }, []);

  const onSaveDamages = () => {
    const formattedDamages = selectedDamageTypes.map((damage) => ({
      damage_type: { id: damage.id, name: damage.name },
    }));

    const updatedDamages = dataPress.damages
      ? [...dataPress.damages, ...formattedDamages]
      : [...formattedDamages];

    dispatch(
      //@ts-ignore
      DataPressActionCreators.setDataPress("damages", updatedDamages)
    );

    navigate(-1);
  };

  const handleDamageTypeClick = (damageType: any) => {
    setSelectedDamageTypes((prevSelected) => {
      if (prevSelected.includes(damageType)) {
        // Если элемент уже выбран, убираем его из массива
        return prevSelected.filter((item) => item !== damageType);
      } else {
        // Если элемент не выбран, добавляем его в массив
        return [...prevSelected, damageType];
      }
    });
  };

  return (
    <Fragment>
      {isError && (
        <ErrorMessage
          type={"error"}
          message={"не все поля заполнены"}
          onClose={() => setIsError(false)}
        />
      )}
      <section className="section">
        <div className="containerPageSlide">
          <h1 className="titleSlide">Добавить повреждение</h1>

          <div className="damageArrayContainer">
            {isDamageType.length > 0 &&
              isDamageType.map((item) => {
                return (
                  <p
                    key={item.id}
                    onClick={() => handleDamageTypeClick(item)}
                    className={`damageItem ${
                      selectedDamageTypes.includes(item) ? "selected" : ""
                    }`}
                  >
                    {item.name}
                  </p>
                );
              })}
          </div>
        </div>
        <div className="containerButtonSlider fixed">
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
      </section>
    </Fragment>
  );
};

export default AddDamagesPage;
