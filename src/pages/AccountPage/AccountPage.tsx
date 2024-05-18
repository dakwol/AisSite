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
import ActsApiRequest from "../../api/Acts/Acts";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import HtmlToPdf from "../../components/HtmlToPdf/HtmlToPdf";
import Skeleton from "react-loading-skeleton";

interface IActData {
  id: string;
  number: string;
  victim: string;
}

const AccountPage: FC = () => {
  const actsApi = new ActsApiRequest();
  const [dataAct, setDataAct] = useState<IActData[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isTimer, setIsTimer] = useState<number>(0);
  const [isSearchText, setIsSearchText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const userInfo = decryptData(localStorage.getItem("account") || "") || "{}";

  console.log("userInfo", userInfo);

  useEffect(() => {
    isTimer > 0 && setTimeout(() => setIsTimer(isTimer - 1), 1000);
  }, [isTimer]);

  // const dataAct = [
  //   {
  //     id: 1,
  //     number: "2004242Z12",
  //     user: "Черников",
  //   },
  //   {
  //     id: 2,
  //     number: "2004242Z12",
  //     user: "Черников",
  //   },
  //   {
  //     id: 3,
  //     number: "2004242Z12",
  //     user: "Черников",
  //   },
  //   {
  //     id: 4,
  //     number: "2004242Z12",
  //     user: "Черников",
  //   },
  // ];

  useEffect(() => {
    setLoading(true);
    actsApi
      .list({
        urlParams: userInfo.is_staff
          ? `?employee=${userInfo.id}`
          : `?victim=${userInfo.id}`,
      })
      .then((resp) => {
        if (resp.success) {
          //@ts-ignore
          setDataAct(resp.data.results);
          setLoading(false);
        }
      });
  }, []);

  const handleSearch = () => {
    actsApi
      .list({
        urlParams: userInfo.is_staff
          ? `?employee=${userInfo.id}&search=${isSearchText}`
          : `?victim=${userInfo.id}&search=${isSearchText}`,
      })
      .then((resp) => {
        if (resp.success) {
          //@ts-ignore
          setDataAct(resp.data.results);
        }
      });
  };

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
          {userInfo.is_staff ? (
            <div>
              <Buttons
                text={"Создать акт осмотра"}
                onClick={() => {
                  dispatch(DataPressActionCreators.clearDataPress());
                  navigate(RouteNames.NEWACTADDRESS);
                }}
                className="buttonCreateAct"
              />

              <h2 className="titlePageMini">
                Мои акты{" "}
                <div className="searchActsContainer">
                  <FormInput
                    style={""}
                    value={undefined}
                    onChange={(e) => {
                      setIsSearchText(e);
                    }}
                    subInput={undefined}
                    placeholder="Найти..."
                    required={false}
                    error={""}
                    keyData={""}
                  />
                  <Buttons
                    text={""}
                    ico={icons.search}
                    onClick={handleSearch}
                    className="searchButton"
                  />
                </div>
              </h2>
            </div>
          ) : (
            <h2 className="titlePageMini">Мои акты</h2>
          )}

          <div className="containerDataAct">
            {loading ? (
              <>
                <Skeleton borderRadius={8} height={40} />
                <Skeleton borderRadius={8} height={40} />
                <Skeleton borderRadius={8} height={40} />
                <Skeleton borderRadius={8} height={40} />
                <Skeleton borderRadius={8} height={40} />
              </>
            ) : dataAct.length > 0 ? (
              dataAct.map((item, index) => {
                return (
                  <div
                    key={item.id}
                    className={`containerAct ${!userInfo.is_staff && "center"}`}
                    onClick={() =>
                      navigate(`${RouteNames.ACTINSIDE}/${item.id}`, {
                        //@ts-ignore
                        id: item.id,
                      })
                    }
                  >
                    <p className="numberAct">{item.number}</p>
                    {userInfo.is_staff && (
                      <p className="userAct">{item.victim}</p>
                    )}
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
