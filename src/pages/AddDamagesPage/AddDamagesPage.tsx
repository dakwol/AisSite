import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Buttons from "../../components/Buttons/Buttons";
import icons from "../../assets/icons/icons";
import { useNavigate } from "react-router-dom";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import ActsApiRequest from "../../api/Acts/Acts";
import apiConfig from "../../api/apiConfig";
import "./styles.scss";
import ErrorMessage from "../../components/UI/ErrorMassage/ErrorMassage";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import UploadImageApiRequest from "../../api/UploadImage/UploadImage";

const AddDamagesPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dataPress = useTypeSelector(
    (state: any) => state.dataPressReducer.dataPress
  );
  const actsApi = new ActsApiRequest();
  const toast = useRef(null);
  const [isDamageType, setIsDamageType] = useState<any[]>([]);
  const [isDamageArray, setIsDamageArray] = useState<any[]>([]);
  const [isError, setIsError] = useState(false);
  const [files, setFiles] = useState<any[]>([]);

  const uploadApi = new UploadImageApiRequest();

  useEffect(() => {
    actsApi.getDamageTypes().then((resp) => {
      if (resp.success) {
        const damages =
          resp.data && resp.data.results
            ? resp.data.results.map((item: any) => ({
                id: item.id,
                value: item.id,
                display_name: item.name,
              }))
            : [];
        setIsDamageType(damages);
      }
    });
  }, []);

  const onUpload = (event: any) => {
    const response = event.xhr.response;
    const data = JSON.parse(response);
    if (data.success) {
      setFiles(data.files);
      //@ts-ignore
      toast.current.show({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
      });
    }
  };

  const onSaveDamages = () => {
    const updatedDamages = dataPress.damages
      ? [...dataPress.damages, ...isDamageArray]
      : [...isDamageArray];

    dispatch(
      //@ts-ignore
      DataPressActionCreators.setDataPress("damages", updatedDamages)
    );
    navigate(-1);
  };

  return (
    <Fragment>
      {isError && (
        <ErrorMessage
          type={"error"}
          message={"не все поля заполнены"}
          onClose={() => setIsError(false)}
        />
      )}
      <section className="section">
        <div className="containerPageSlide">
          <h1 className="titleSlide">Повреждения</h1>

          <Buttons
            text={"Добавить повреждение"}
            onClick={() => setIsDamageArray([...isDamageArray, {}])}
          />

          <div className="card">
            <FileUpload
              mode="basic"
              name="files[]"
              accept="image/*"
              maxFileSize={10000000}
              onUpload={onUpload}
              url={`${apiConfig.baseUrlMedia}upload/`}
              auto
              chooseLabel="Загрузить фотографии"
              className={"button__container"}
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
            text={"Сохранить"}
            className="sliderButton"
            onClick={() => {
              onSaveDamages();
            }}
          />
        </div>
      </section>
    </Fragment>
  );
};

export default AddDamagesPage;
