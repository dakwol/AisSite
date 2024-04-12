import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FormInput from "../../components/FormInput/FormInput";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import icons from "../../assets/icons/icons";
import Buttons from "../../components/Buttons/Buttons";
import { RouteNames } from "../../routes";
import { useNavigate, useParams } from "react-router-dom";
import ActsApiRequest from "../../api/Acts/Acts";
import UserApiRequest from "../../api/User/Users";
import { formatDateIntlTimeDate } from "../../components/UI/functions/functions";
import "./styles.scss";

const NewActSigningPage: FC = () => {
  const params = useParams();
  const { id } = params;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actsApi = new ActsApiRequest();
  const userApi = new UserApiRequest();
  const dateAct = new Date();
  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );

  const [isSms, setIsSms] = useState<string>("");
  const [dataUser, setDataUser] = useState<any>("");

  console.log("dataUser", dataUser);

  const handleSigningActs = () => {
    actsApi
      //@ts-ignore
      .actsSigning(`${id}/`, { code: isSms }, `?code=${isSms}`)
      .then((resp) => {
        if (resp.success) {
          //@ts-ignore
          navigate(`${RouteNames.NEWACTCOMPLETEPAGE}/${resp.data.number}`, {
            //@ts-ignore
            id: resp.data.number,
          });
        }
      });
  };

  useEffect(() => {
    userApi
      .list({ urlParams: `?phone_number=${dataPress.victim.phone_number}` })
      .then((resp) => {
        if (resp.success) {
          //@ts-ignore
          setDataUser(resp.data.results[0]);
        }
      });
    actsApi
      .sendSign(
        `${id}/` as string,
        dataPress.victim.phone_number ? { is_code: true } : { is_code: false }
      )
      .then((resp) => {
        if (resp.success) {
          console.log("res", resp);
          console.log("res", resp);
        }
      });
  }, []);

  return (
    <section className="section">
      <div className="containerPageSlide">
        <h1 className="titleSlide">Подписание</h1>
        <h4 className="dateActs">
          {dateAct && formatDateIntlTimeDate(dateAct || "")}
        </h4>
        <div className="containerSigning">
          <div>
            <label className="labelVictim">Пострадавший/представитель</label>
            <div className="containerVictim">
              <h1>{`${dataUser.last_name} ${dataUser.first_name} ${dataUser.patronymic}`}</h1>
              <p>{`+7${dataUser.phone_number}`}</p>
            </div>
          </div>
          <div className="signingForm">
            <h4>
              Подпишите кодом из СМС, отправленный на телефон
              пострадавшему/представителю
            </h4>
            <FormInput
              style={""}
              value={isSms}
              onChange={(value) => setIsSms(value)}
              subInput={"Код из СМС"}
              required={false}
              error={""}
              keyData={""}
            />
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
            text={"Подписать"}
            className="sliderButton"
            onClick={() => {
              handleSigningActs();
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default NewActSigningPage;
