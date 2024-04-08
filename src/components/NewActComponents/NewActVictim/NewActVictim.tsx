import React, { FC } from "react";
import FormInput from "../../FormInput/FormInput";
import { useDispatch } from "react-redux";
import { DataPressActionCreators } from "../../../store/reducers/dataPressItem/action-creator";
import { useTypeSelector } from "../../../hooks/useTypedSelector";

const NewActVictim: FC = () => {
  const dispatch = useDispatch();
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
    dispatch(DataPressActionCreators.setDataPress(fieldName, fieldValue));
  };
  return (
    <div className="containerPageSlide">
      <h1 className="titleSlide">Данные пострадавшего/представителя</h1>

      <div className="formContainer">
        {inputVictim.map((item) => {
          return (
            <FormInput
              style={""}
              value={dataPress[item.key]}
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
    </div>
  );
};

export default NewActVictim;
