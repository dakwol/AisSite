import React, { FC, Fragment, useEffect, useState } from "react";
import "./styles.scss";
import { RouteNames } from "../../routes";
import { useNavigate } from "react-router-dom";
import { ISendModeration } from "../../models/ISendModeration";
import { ISendLogin } from "../../models/ISendLogin";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import icons from "../../assets/icons/icons";
import UserApiRequest from "../../api/User/Users";
import Buttons from "../../components/Buttons/Buttons";
import FormInput from "../../components/FormInput/FormInput";
import { AuthActionCreators } from "../../store/reducers/auth/action-creator";
import { decryptData } from "../../components/UI/functions/functions";

interface IPhonePage {
  title: string;
  type: string;
}

const AccountPage: FC = () => {
  const [isPhone, setIsPhone] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isTimer, setIsTimer] = useState<number>(0);

  const userInfo = decryptData(localStorage.getItem("account") || "") || "{}";

  console.log("userInfo", userInfo);

  useEffect(() => {
    isTimer > 0 && setTimeout(() => setIsTimer(isTimer - 1), 1000);
  }, [isTimer]);

  const dataAct = [
    {
      id: 1,
      number: "2004242Z12",
      user: "Черников",
    },
    {
      id: 2,
      number: "2004242Z12",
      user: "Черников",
    },
    {
      id: 3,
      number: "2004242Z12",
      user: "Черников",
    },
    {
      id: 4,
      number: "2004242Z12",
      user: "Черников",
    },
  ];

  const logOut = () => {
    dispatch(
      //@ts-ignore
      AuthActionCreators.logout()
    );
    navigate(RouteNames.LOGIN);
  };

  return (
    <Fragment>
      <section className="section">
        <div className="containerPage">
          <header className="headerAccount">
            <h4 className="userName">{`${userInfo.last_name} ${userInfo.first_name} ${userInfo.patronymic}`}</h4>
            <Buttons
              text={"Выйти"}
              className="logoutButton"
              onClick={() => {
                logOut();
              }}
            />
          </header>
          {userInfo.is_employee ? (
            <div>
              <Buttons
                text={"Создать акт осмотра"}
                onClick={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
              <h2 className="titlePageMini">Мои акты</h2>

              <div>
                <FormInput
                  style={""}
                  value={undefined}
                  onChange={function (
                    value: string,
                    isChecked?: boolean | undefined
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  subInput={undefined}
                  required={false}
                  error={""}
                  keyData={""}
                />
                <Buttons
                  text={""}
                  onClick={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
            </div>
          ) : (
            <h2 className="titlePageMini">Мои акты</h2>
          )}

          <div className="containerDataAct">
            {dataAct.length > 0 ? (
              dataAct.map((item) => {
                return (
                  <div key={item.id} className="containerAct">
                    <p className="numberAct">{item.number}</p>
                    <p className="userAct">{item.user}</p>
                  </div>
                );
              })
            ) : (
              <p className="noActs">Акты не найдены</p>
            )}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default AccountPage;
