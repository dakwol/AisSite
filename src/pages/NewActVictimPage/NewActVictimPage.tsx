import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import FormInput from "../../components/FormInput/FormInput";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import icons from "../../assets/icons/icons";
import Buttons from "../../components/Buttons/Buttons";
import { RouteNames } from "../../routes";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/UI/ErrorMassage/ErrorMassage";

interface Victim {
  last_name: string;
  first_name: string;
  patronymic: string;
  phone_number: string;
  [key: string]: string; // Для поддержки дополнительных контактов
}

interface ContactInput {
  id: number;
  label: string;
  key: string;
  type: string;
}

const NewActVictim: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );
  const [isError, setIsError] = useState(false);
  const inputVictim: ContactInput[] = [
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

  const [additionalContacts, setAdditionalContacts] = useState<
    ContactInput[][]
  >([]);

  const handleChange = (fieldName: string, fieldValue: string) => {
    dispatch(
      DataPressActionCreators.setDataPress("victim", {
        ...dataPress.victim,
        [fieldName]: fieldValue,
      })
    );
  };
  const handleChangeAdditional = (
    fieldName: string,
    fieldValue: string,
    index: number
  ) => {
    const additionalContacts = dataPress.victim?.additional_contacts || [];
    const newAdditionalContacts = [...additionalContacts];
    newAdditionalContacts[index] = {
      ...newAdditionalContacts[index],
      [fieldName]: fieldValue,
    };

    dispatch(
      DataPressActionCreators.setDataPress("victim", {
        ...dataPress.victim,
        additional_contacts: newAdditionalContacts,
      })
    );
  };

  const addNewContact = () => {
    const newContacts = inputVictim.map((item, index) => ({
      ...item,
      id: additionalContacts.length * inputVictim.length + index + 1,
      key: item.key,
      label: item.label,
    }));

    setAdditionalContacts([...additionalContacts, newContacts]);

    // Ensure that a new object is added to the dataPress.victim.additional_contacts array
    const newAdditionalContact = newContacts.reduce(
      (acc, item) => ({ ...acc, [item.key]: "" }),
      {}
    );

    dispatch(
      DataPressActionCreators.setDataPress("victim", {
        ...dataPress.victim,
        additional_contacts: [
          ...(dataPress.victim?.additional_contacts || []),
          newAdditionalContact,
        ],
      })
    );
  };

  const movingOn = () => {
    const requiredFieldsFilled = inputVictim.every(
      (item) => dataPress.victim[item.key] !== ""
    );

    if (requiredFieldsFilled) {
      navigate(RouteNames.NEWACTDAMAGEPAGE);
    } else {
      setIsError(true);
    }
  };

  console.log("====================================");
  console.log(dataPress);
  console.log("====================================");

  return (
    <section className="section">
      {isError && (
        <ErrorMessage
          type={"error"}
          message={"не все поля заполнены"}
          onClose={() => setIsError(false)}
        />
      )}
      <div className="containerPageSlide mb-12">
        <h1 className="titleSlide">Данные пострадавшего/представителя</h1>

        <div className="formContainer">
          {inputVictim.map((item) => {
            return (
              <FormInput
                key={item.key}
                style={""}
                value={dataPress?.victim && dataPress?.victim[item.key]}
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

          {additionalContacts.map((contactGroup, index) => (
            <div key={index}>
              <h2 className="titleSlide">{`Контакт ${index + 1}`}</h2>
              {contactGroup.map((item) => (
                <FormInput
                  key={item.key}
                  style={""}
                  value={
                    dataPress?.victim?.additional_contacts?.[index]?.[
                      item.key
                    ] || ""
                  }
                  onChange={(value) =>
                    handleChangeAdditional(item.key, value, index)
                  }
                  subInput={item.label}
                  required={false}
                  type={item.type}
                  error={""}
                  keyData={""}
                />
              ))}
            </div>
          ))}

          <Buttons text={"Дополнительный контакт"} onClick={addNewContact} />
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
          ico={icons.arrowRightOrange}
          text={"Далее"}
          className="sliderButton"
          onClick={movingOn}
        />
      </div>
    </section>
  );
};

export default NewActVictim;
