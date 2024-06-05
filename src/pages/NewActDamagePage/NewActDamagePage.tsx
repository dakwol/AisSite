import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActsApiRequest from "../../api/Acts/Acts";
import Buttons from "../../components/Buttons/Buttons";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { RouteNames } from "../../routes";
import icons from "../../assets/icons/icons";
import "./styles.scss";
import { decryptData } from "../../components/UI/functions/functions";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import { useDispatch } from "react-redux";
import UserApiRequest from "../../api/User/Users";
import ErrorMessage from "../../components/UI/ErrorMassage/ErrorMassage";
import MyDocument from "../../components/HtmlToPdf/HtmlToPdf";
import {
  BlobProvider,
  PDFDownloadLink,
  PDFRenderer,
  pdf,
} from "@react-pdf/renderer";
import UploadImageApiRequest from "../../api/UploadImage/UploadImage";
import FilePickerModal from "../../components/UI/FilePickerModal/FilePickerModal";
import apiConfig from "../../api/apiConfig";
import FormInput from "../../components/FormInput/FormInput";
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

const NewActDamage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );

  const actsApi = new ActsApiRequest();
  const userApi = new UserApiRequest();

  const [damageTypes, setDamageTypes] = useState<DamageType[]>([]);
  const [isSms, setIsSms] = useState<boolean>(false);
  const [isPhoto, setIsPhoto] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>(0);
  const [actNumber, setActNumber] = useState<string>("");
  const [blobDocument, setBlob] = useState<Blob>();
  const [dataIdDocs, setDataIdDocs] = useState("");
  const [dataIdDocsFix, setDataIdDocsFix] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const pdfLinkRef = useRef<any>(null);

  const [arrayImage, setArrayImage] = useState([]);
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const damageTypesResp = await actsApi.getDamageTypes();

      if (damageTypesResp.success) {
        const damageTypesData =
          damageTypesResp.data && damageTypesResp.data.results
            ? damageTypesResp.data.results.map((item: any) => ({
                id: item.id,
                value: item.id,
                display_name: item.name,
              }))
            : [];
        setDamageTypes(damageTypesData);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dataPress?.victim?.phone_number) {
      userApi
        .list({ urlParams: `?phone_number=${dataPress.victim.phone_number}` })
        .then((resp) => {
          //@ts-ignore
          if (resp.success && resp.data.results.length > 0) {
            dispatch(
              DataPressActionCreators.setDataPress("victim", {
                ...dataPress.victim,
                //@ts-ignore
                ["id"]: resp.data.results[0].id,
              })
            );
          }
        });
    }
  }, []);
  const createAct = async (isSms: boolean, isPhoto: boolean) => {
    const actsApi = new ActsApiRequest();
    setIsSms(isSms);
    setIsPhoto(isPhoto);
    setIsLoading(true);
    try {
      const resp = await actsApi.create({ body: dataPress });
      if (resp.success && resp.data) {
        setDataIdDocs(resp.data.id);
        setDataIdDocsFix(resp.data.id);
        setActNumber(resp.data.number);
      }
    } catch (error) {
      console.error("Error creating act", error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (blobDocument) {
      const formData = new FormData();
      formData.append("id", dataIdDocsFix);
      formData.append("files", blobDocument, "act.pdf");

      new UploadImageApiRequest().uploadImage(formData).then((resp) => {
        if (resp.success && resp.data) {
          const respData = resp.data;
          actsApi.uploadPdf(dataIdDocsFix, respData[0]).then((item) => {
            if (item.success && item.data) {
              setDataIdDocs("");
              if (dataPress.victim && isSms) {
                setIsLoading(false);
                navigate(`${RouteNames.NEWACTSIGNINGPAGE}/${item.data.id}`, {
                  state: { id: item.data.id },
                });
              } else if (isPhoto) {
                setIsLoading(false);
                navigate(
                  `${RouteNames.NEWACTSIGNINPHOTOGPAGE}/${item.data.id}`,
                  {
                    state: { id: item.data.id },
                  }
                );
              } else {
                setIsLoading(false);
                navigate(`${RouteNames.NEWACTCOMPLETEPAGE}/${actNumber}`, {
                  state: { id: actNumber },
                });
              }
            }
          });
        }
      });
    }
  }, [blobDocument]);

  const handleDeleteDamage = (damageItemToDelete: any) => {
    let deleted = false;

    const updatedDamages = dataPress.damages.filter((item: any) => {
      if (!deleted && item.name === damageItemToDelete.name) {
        deleted = true;
        return false;
      }
      return true;
    });

    dispatch(DataPressActionCreators.setDataPress("damages", updatedDamages));
  };

  const handleRemoveImage = (fileToRemove: any) => {
    setArrayImage((prevArray) =>
      //@ts-ignore
      prevArray.filter((item) => item.file !== fileToRemove)
    );
  };

  useEffect(() => {
    if (arrayImage) {
      dispatch(
        //@ts-ignore
        DataPressActionCreators.setDataPress("damage_images", arrayImage)
      );
    }
  }, [arrayImage]);

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
        {isError && (
          <ErrorMessage
            type={"error"}
            message={"Произошла ошибка"}
            onClose={() => setIsError(false)}
          />
        )}
        <div className="containerPageSlide">
          <h1 className="titleSlide">Повреждения</h1>
          <Buttons
            text={"Добавить повреждение"}
            onClick={() => navigate(RouteNames.ADDDAMAGEPAGE)}
          />
          <FilePickerModal
            type="image"
            setFiles={(files: any) => {
              setImageLoading({}); // Сбросим состояние загрузки перед добавлением новых файлов
              //@ts-ignore
              setArrayImage((prevArray) => [...prevArray, ...files]);
            }}
            isLoading={(e: any) => setIsLoad(e)}
          />
          <div className="containerImagePicker">
            {isLoad ? (
              <Skeleton width={"100%"} height={50}></Skeleton>
            ) : (
              arrayImage?.length > 0 &&
              arrayImage?.map((item) => {
                return (
                  //@ts-ignore
                  <div key={item.file.name} className="imageItemContainer">
                    <img
                      //@ts-ignore
                      src={`${apiConfig.baseUrlMedia}${item.file}`}
                      className="imageItem"
                      alt="Damage Image"
                    />
                    <img
                      src={icons.xClose}
                      className="removeButton"
                      //@ts-ignore
                      onClick={() => handleRemoveImage(item.file)}
                    ></img>
                  </div>
                );
              })
            )}
          </div>

          <FormInput
            style={""}
            value={dataPress.note}
            onChange={(value) =>
              dispatch(DataPressActionCreators.setDataPress("note", value))
            }
            subInput={"Примечание"}
            required={false}
            error={""}
            keyData={""}
            textArea
          />

          <h2 className="titlePageMini">Типы повреждений</h2>

          <div className="damageContainer">
            {dataPress.damages &&
              dataPress.damages.map((item: any) => {
                return (
                  <div key={item.damage_type.id} className="damageItem">
                    <div className="containerDamageData">
                      <h1 className="damageTitle">{item.damage_type.name}</h1>
                      <p>{item.damage_type.count}</p>
                    </div>
                    <p
                      className="deleteButton"
                      onClick={() => handleDeleteDamage(item)}
                    >
                      Удалить
                    </p>
                  </div>
                );
              })}
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
          {dataPress.victim ? (
            <Buttons
              ico={icons.arrowRightOrange}
              text={"Подписание"}
              className="sliderButton"
              onClick={() => {
                createAct(true, false);
              }}
            />
          ) : (
            <Buttons
              ico={isLoading ? icons.load : icons.checkBlack}
              text={isLoading ? "Формирование акта" : "Подписать"}
              className="sliderButton"
              onClick={() => {
                createAct(false, false);
              }}
            />
          )}
          {dataPress.victim && (
            <Buttons
              ico={icons.arrowRightOrange}
              text={"Подписание без СМС"}
              className="sliderButtonAll"
              onClick={() => {
                createAct(false, true);
              }}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default NewActDamage;
