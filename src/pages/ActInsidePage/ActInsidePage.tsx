import React, { FC, useEffect, useRef, useState } from "react";
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
import Skeleton from "react-loading-skeleton";

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
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [pdfClicked, setPdfClicked] = useState(false); // State for tracking button click
  const userInfo = decryptData(localStorage.getItem("account") || "") || "{}";
  const pdfLinkRef = useRef<any>(null);

  useEffect(() => {
    setLoading(true);
    actApi.getById({ id: id }).then((resp) => {
      if (resp.success) {
        //@ts-ignore
        const groupedData = groupDataByDamageType(resp.data.damages);
        //@ts-ignore
        setDataAct({ ...resp.data, damages: groupedData });
        console.log("rrrr", resp.data);
        setLoading(false);
        //@ts-ignore
        if (resp.data.victim) {
          setLoading(true);
          //@ts-ignore
          userApi.getById({ id: resp.data.victim.id }).then((user) => {
            console.log("userData", user);
            if (user.success) {
              //@ts-ignore
              setUserData(user.data);
              setLoading(false);
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

  const handlePdfButtonClick = () => {
    setPdfClicked(true); // Set the state to true when the button is clicked

    if (pdfLinkRef.current) {
      console.log("Загрузка");

      setIsLoading(true);
      pdfLinkRef.current.click(); // Trigger the click event on the PDFDownloadLink
    }
  };
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
          {loading ? (
            <Skeleton borderRadius={8} height={90} />
          ) : (
            userInfo.is_employee &&
            userData.last_name && (
              <div className="userDataContainer">
                <h1>{`${userData.last_name} ${userData.first_name} ${userData.patronymic}`}</h1>
                <p>{`+7${userData.phone_number}`}</p>
              </div>
            )
          )}
        </div>

        <PDFDownloadLink
          ref={pdfLinkRef}
          document={<MyDocument id={dataAct.id} />}
          fileName="act.pdf"
          download={true}
          onClick={handlePdfButtonClick}
        >
          <Buttons
            text="Скачать акт в PDF"
            ico={isLoading ? icons.ripples : ""}
            onClick={handlePdfButtonClick}
          />
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
