import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ActsApiRequest from "../../api/Acts/Acts";
import { formatDateIntlTimeDate } from "../../components/UI/functions/functions";

const ActInsidePage: FC = () => {
  const params = useParams();
  const { id } = params;
  const actApi = new ActsApiRequest();
  const [dataAct, setDataAct] = useState<any>({});

  useEffect(() => {
    actApi.getById({ id: id }).then((resp) => {
      if (resp.success) {
        //@ts-ignore
        resp.data && setDataAct(resp.data);
      }
    });
  }, []);

  return (
    <section className="section">
      <div className="containerPageSlide">
        <h1 className="titleSlide">{`Акт ${dataAct.number}`}</h1>
        <h4 className="dateActs">
          {dataAct.signed_at && formatDateIntlTimeDate(dataAct.signed_at || "")}
        </h4>
        {dataAct.last_name && (
          <div>
            <h1>{`${dataAct.last_name} ${dataAct.first_name} ${dataAct.patronymic}`}</h1>
            <p>{`+7${dataAct.phone_number}`}</p>
          </div>
        )}
        <h2 className="titlePageMini">Типы повреждений</h2>
      </div>
    </section>
  );
};

export default ActInsidePage;
