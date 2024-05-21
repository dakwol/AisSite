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
import { BlobProvider } from "@react-pdf/renderer";
import MyDocument from "../../components/HtmlToPdf/HtmlToPdf";
import UploadImageApiRequest from "../../api/UploadImage/UploadImage";

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
  const [dataNumber, setDataNumber] = useState<string>("");
  const [dataUser, setDataUser] = useState<any>("");

  const [blobDocument, setBlob] = useState<Blob>();
  const [dataIdDocs, setDataIdDocs] = useState("");
  const [dataIdDocsFix, setDataIdDocsFix] = useState("");

  console.log("dataUser", dataUser);

  const handleSigningActs = () => {
    actsApi
      //@ts-ignore
      .actsSigning(`${id}/`, { code: isSms }, `?code=${isSms}`)
      .then((resp) => {
        if (resp.success && resp.data) {
          setDataIdDocs(id || "");
          setDataIdDocsFix(id || "");
          setDataNumber(resp.data.number);
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
        `${id}/`,
        dataPress.victim.phone_number ? { is_code: true } : { is_code: false }
      )
      .then((resp) => {
        if (resp.success) {
          console.log("res", resp);
          console.log("res", resp);
        }
      });
  }, []);

  useEffect(() => {
    if (blobDocument) {
      const formData = new FormData();
      formData.append("id", dataIdDocsFix);
      formData.append("files", blobDocument, "act.pdf");

      new UploadImageApiRequest().uploadImage(formData).then((resp) => {
        if (resp.success && resp.data) {
          actsApi.uploadPdf(dataIdDocsFix, resp.data[0]).then((item) => {
            if (item.success) {
              setDataIdDocs("");
              //@ts-ignore
              navigate(`${RouteNames.NEWACTCOMPLETEPAGE}/${rdataNumber}`, {
                //@ts-ignore
                id: dataNumber,
              });
            }
          });
        }
      });
    }
  }, [blobDocument]);

  return (
    <>
      {dataIdDocs !== "" && (
        <BlobProvider document={<MyDocument id={dataIdDocs}></MyDocument>}>
          {({ url, loading, blob }) => {
            console.log("url", url);
            if (!loading && blob) {
              setBlob(blob); // Set blob after the document is generated
              setDataIdDocs("");
            }
            return loading ? <></> : <></>;
          }}
        </BlobProvider>
      )}

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
    </>
  );
};

export default NewActSigningPage;
