import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActsApiRequest from "../../api/Acts/Acts";
import {
  decryptData,
  formatDateIntlTimeDate,
} from "../../components/UI/functions/functions";
import UserApiRequest from "../../api/User/Users";
import Buttons from "../../components/Buttons/Buttons";
import "./styles.scss";
import icons from "../../assets/icons/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "../../components/HtmlToPdf/HtmlToPdf";

interface DamageType {
  id: number;
  value: string;
  display_name: string;
}

interface Name {
  id: number;
  value: string;
  display_name: string;
}

const ActInsidePage: FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const actApi = new ActsApiRequest();
  const userApi = new UserApiRequest();
  const [dataAct, setDataAct] = useState<any>({});
  const [userData, setUserData] = useState<any>({});
  const userInfo = decryptData(localStorage.getItem("account") || "") || "{}";

  useEffect(() => {
    actApi.getById({ id: id }).then((resp) => {
      if (resp.success) {
        //@ts-ignore
        const groupedData = groupDataByDamageType(resp.data.damages);
        //@ts-ignore
        setDataAct({ ...resp.data, damages: groupedData });
        console.log("rrrr", resp.data);

        //@ts-ignore
        if (resp.data.victim) {
          //@ts-ignore
          userApi.getById({ id: resp.data.victim.id }).then((user) => {
            console.log("userData", user);
            if (user.success) {
              //@ts-ignore
              setUserData(user.data);
            }
          });
        }
      }
    });
  }, []);

  const groupDataByDamageType = (damages: any[]) => {
    const groupedData: any = {};
    damages.forEach((item) => {
      if (!groupedData[item.damage_type]) {
        groupedData[item.damage_type] = [];
      }
      groupedData[item.damage_type].push(item);
    });
    return groupedData;
  };

  console.log("userData", userData);

  return (
    <section className="section">
      <div className="containerPageInside">
        <div>
          <div className="contaiinerInfoAct">
            <h1 className="titleSlide">{`Акт ${dataAct.number}`}</h1>
            <h4 className="dateActs">
              {dataAct.signed_at &&
                formatDateIntlTimeDate(dataAct.signed_at || "")}
            </h4>
          </div>
          {userInfo.is_employee && userData && (
            <div className="userDataContainer">
              <h1>{`${userData.last_name} ${userData.first_name} ${userData.patronymic}`}</h1>
              <p>{`+7${userData.phone_number}`}</p>
            </div>
          )}
        </div>

        <PDFDownloadLink
          document={<MyDocument id={dataAct.id} />}
          fileName="example.pdf"
        >
          {({ blob, url, loading, error }) => (
            <Buttons
              text={loading ? "Загрузка документа..." : "Скачать акт в PDF"}
              disabled={loading}
              onClick={() => {}}
            />
          )}
        </PDFDownloadLink>

        <h2 className="titlePageMini">Типы повреждений</h2>

        <div className="damageContainer">
          {dataAct.damages &&
            Object.keys(dataAct.damages).map((damageType, index) => (
              <div key={index} className="damageItem">
                <h1 className="damageTitle">{damageType}</h1>
                {dataAct.damages[damageType].map(
                  (damage: any, damageIndex: number) => (
                    <div key={damageIndex} className="containerDamageData">
                      <p>{damage.name}</p>
                      <p>{damage.count}</p>
                    </div>
                  )
                )}
              </div>
            ))}
        </div>

        <div className="containerButton">
          <Buttons
            ico={icons.arrowLeft}
            text={"Назад"}
            className="sliderButton"
            onClick={() => {
              navigate(-1);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ActInsidePage;
