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
import apiConfig from "../../api/apiConfig";

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

  // const handlePdfButtonClick = () => {
  //   setPdfClicked(true); // Set the state to true when the button is clicked

  //   if (pdfLinkRef.current) {
  //     console.log("Загрузка");

  //     setIsLoading(true);
  //     pdfLinkRef.current.click(); // Trigger the click event on the PDFDownloadLink
  //   }
  // };
  const getDownloadPdf = () => {
    // Запрос на подтверждение скачивания файла
    const confirmed = window.confirm("Вы уверены, что хотите скачать файл?");
    if (!confirmed) {
      return; // Если пользователь отказывается, прерываем процесс скачивания
    }

    actApi
      .getDownloadPdf(`${id}/`)
      .then((resp) => {
        if (resp.success) {
          const fileUrl = `${apiConfig.baseUrlMedia.slice(0, -7)}${
            //@ts-ignore
            resp.data.url
          }`;

          // Загружаем файл как Blob
          fetch(fileUrl)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Ошибка загрузки файла");
              }
              return response.blob(); // Получаем содержимое файла в виде Blob
            })
            .then((blob) => {
              // Создаем ссылку для скачивания файла
              const url = window.URL.createObjectURL(blob);

              const link = document.createElement("a");
              link.href = url;
              link.download = "act.pdf"; // Указываем имя файла для скачивания
              link.style.display = "none"; // Делаем ссылку невидимой
              document.body.appendChild(link);

              link.click(); // Имитируем клик по ссылке для начала скачивания
              document.body.removeChild(link); // Удаляем ссылку из DOM

              window.URL.revokeObjectURL(url); // Освобождаем объект URL после использования
            })
            .catch((error) => {
              console.error("Произошла ошибка при загрузке файла:", error);
            });
        } else {
          //@ts-ignore
          console.error("Ошибка при получении URL:", resp.error);
        }
      })
      .catch((error) => {
        console.error("Произошла ошибка при запросе:", error);
      });
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
            userInfo.is_staff &&
            userData.last_name && (
              <div className="userDataContainer">
                <h1>{`${userData.last_name} ${userData.first_name} ${userData.patronymic}`}</h1>
                <p>{`+7${userData.phone_number}`}</p>
              </div>
            )
          )}
        </div>
        {/* 
        {dataAct.id && (
          <PDFDownloadLink
            ref={pdfLinkRef}
            document={<MyDocument id={dataAct.id} />}
            fileName="act.pdf"
            download={true}
            target="_blank"
          >
         
          </PDFDownloadLink>
        )} */}
        <Buttons
          text="Скачать акт в PDF"
          ico={isLoading ? icons.ripples : ""}
          onClick={() => {
            getDownloadPdf();
          }}
        />
        <h2 className="titlePageMini">Типы повреждений</h2>

        <div className="damageContainer">
          {dataAct.damages &&
            Object.keys(dataAct.damages).map((damageType, index) => (
              <div key={index} className="damageItem">
                <div className="containerDamageData">
                  <h1 className="damageTitle">{damageType}</h1>

                  {dataAct.damages[damageType].map(
                    (damage: any, damageIndex: number) => (
                      <p>{damage.count}</p>
                    )
                  )}
                </div>
              </div>
            ))}
        </div>
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
    </section>
  );
};

export default ActInsidePage;
