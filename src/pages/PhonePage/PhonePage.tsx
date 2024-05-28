import React, { FC, Fragment, useEffect, useState } from "react";
import "./styles.scss";
import { RouteNames } from "../../routes";
import { useNavigate, useParams } from "react-router-dom";
import { ISendModeration } from "../../models/ISendModeration";
import { ISendLogin } from "../../models/ISendLogin";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import icons from "../../assets/icons/icons";
import UserApiRequest from "../../api/User/Users";
import Buttons from "../../components/Buttons/Buttons";
import FormInput from "../../components/FormInput/FormInput";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";

interface IPhonePage {
  title: string;
}

const PhonePage: FC<IPhonePage> = ({ title }) => {
  const [isPhone, setIsPhone] = useState("");
  const navigate = useNavigate();
  const userApi = new UserApiRequest();
  const params = useParams();
  const { type } = params;

  console.log("type", type);

  const dispatch = useDispatch();

  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );

  const handleSmsPage = () => {
    if (dataPress.phone !== "" && dataPress.phone.length === 10) {
      //@ts-ignore
      navigate(`${RouteNames.SMSPAGE}/${type}`, { type: type });
    } else {
      console.error("Неверно введён номер");
    }
  };

  const handleChange = (fieldName: string, fieldValue: string | boolean) => {
    dispatch(DataPressActionCreators.setDataPress(fieldName, fieldValue));
  };

  return (
    <Fragment>
      <section className="section">
        <div className="containerPage">
          <div className="flexCotnainer">
            <div>
              <div className="logoContainer">
                <h1 className="titlePage">
                  {type === "employee"
                    ? "Вход для сотрудников"
                    : "Введите номер телефона, указанный в акте"}
                </h1>
              </div>

              <div className="containerLogin">
                <FormInput
                  style={""}
                  value={dataPress.phone}
                  type="phone"
                  onChange={(e) => handleChange("phone", e)}
                  subInput={"Номер телефона"}
                  required={false}
                  error={""}
                  keyData={""}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="containerButton">
          <Buttons text={"Подтвердить по СМС"} onClick={handleSmsPage} />
        </div>
      </section>
    </Fragment>
  );
};

export default PhonePage;
