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
import FormDamage from "../../components/FormDamage/FormDamage";
import FilePickerModal from "../../components/UI/FilePickerModal/FilePickerModal";
import apiConfig from "../../api/apiConfig";

const NewActSigningPhotoPage: FC = () => {
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
  const [arrayImage, setArrayImage] = useState<any>([]);

  console.log("arrayImage", arrayImage);

  const handleSigningActs = () => {
    if (arrayImage !== 0) {
      actsApi
        .sendSign(`${id}/` as string, { is_code: false, is_photo: true })
        .then((resp) => {
          if (resp.success) {
            actsApi
              //@ts-ignore
              .actsSigning(`${id}/`, { id: Number(id), act_images: arrayImage })
              .then((resp) => {
                if (resp.success) {
                  navigate(
                    //@ts-ignore
                    `${RouteNames.NEWACTCOMPLETEPAGE}/${resp.data.number}`,
                    {
                      //@ts-ignore
                      id: resp.data.number,
                    }
                  );
                }
              });
          }
        });
    }
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
            <h4>Подпишите фотографии акта осмотра</h4>
            <div className="containerImagePicker">
              <FilePickerModal
                type="image"
                setFiles={(e: any) => {
                  //@ts-ignore
                  setArrayImage((prevArray: any[]) => [...prevArray, ...e]);
                }}
              />

              {arrayImage?.length > 0 &&
                arrayImage?.map((item: any) => {
                  return (
                    <img
                      src={`${apiConfig.baseUrlMedia}${item.file}`}
                      className="imageItem"
                      key={item.file}
                      alt="Damage Image"
                    />
                  );
                })}
            </div>
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

export default NewActSigningPhotoPage;
