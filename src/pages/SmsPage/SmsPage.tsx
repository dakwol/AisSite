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
import { AuthActionCreators } from "../../store/reducers/auth/action-creator";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";

interface IPhonePage {
  title: string;
  type: string;
}

const SmsPage: FC = () => {
  const [isCode, setIsCode] = useState("");
  const navigate = useNavigate();
  const [isTimer, setIsTimer] = useState<number>(0);
  const dispatch = useDispatch();
  const userApi = new UserApiRequest();

  const params = useParams();
  const { type } = params;

  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );

  const { isAuth, error, isLoading } = useTypeSelector(
    (state) => state.authReducer
  );

  const getCode = () => {
    setIsTimer(60);
    userApi.authCode({ phone_number: dataPress.phone }).then((resp) => {
      if (resp.success) {
        setIsCode(resp.data && resp.data.code);
      }
    });
  };

  useEffect(() => {
    getCode();
  }, []);

  useEffect(() => {
    isTimer > 0 && setTimeout(() => setIsTimer(isTimer - 1), 1000);
  }, [isTimer]);

  const handleChange = (fieldName: string, fieldValue: string | boolean) => {
    dispatch(DataPressActionCreators.setDataPress(fieldName, fieldValue));
  };

  const authUser = () => {
    dispatch(
      //@ts-ignore
      AuthActionCreators.login(dataPress.phone, dataPress.code)
    );
  };

  useEffect(() => {
    if (isAuth) {
      navigate(RouteNames.ACCOUNTPAGE);
    }
  }, [isAuth]);

  return (
    <Fragment>
      <section className="section">
        <div className="containerPage">
          <div className="logoContainer">
            <h1 className="titlePage">
              Подтверждение <br /> по СМС
            </h1>
          </div>

          <div className="containerLogin">
            <FormInput
              style={""}
              value={undefined}
              type="string"
              onChange={(e) => handleChange("code", e)}
              subInput={"Код из СМС"}
              required={false}
              error={""}
              keyData={""}
            />

            {isTimer === 0 ? (
              <p
                className="buttonRepeat getCodeText"
                onClick={() => {
                  getCode();
                }}
              >
                Запросить повторно
              </p>
            ) : (
              <p className="buttonRepeat getCodeText">
                {`Запросить повторно через  ${isTimer}`}
              </p>
            )}

            <div className="containerButton">
              <Buttons
                text={"Отправить"}
                onClick={() => {
                  authUser();
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default SmsPage;
