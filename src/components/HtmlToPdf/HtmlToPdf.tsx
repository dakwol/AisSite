import React, { FC, useEffect, useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import ActsApiRequest from "../../api/Acts/Acts";
import {
  formatDateIntlDate,
  formatDateIntlTimeDate,
} from "../UI/functions/functions";

// Подключаем кириллический шрифт
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

// Создаем стили для нашего PDF-документа
const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

interface IProps {
  id: string;
}

// Создаем компонент PDF-документа
const MyDocument: FC<IProps> = ({ id }) => {
  const actsApi = new ActsApiRequest();
  const [pdfData, setPdfData] = useState<any>({});

  useEffect(() => {
    actsApi.getPdf(`${id}/`).then((resp) => {
      if (resp.success) {
        setPdfData(resp.data);
      }
    });
  }, [id]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>{`Акт осмотра ${pdfData?.building_type}, поврежденного в результате чрезвычайной ситуации`}</Text>
          <Text style={{ color: "#2970FF", marginTop: 24 }}>{`№${
            pdfData?.number
          } от ${
            pdfData.signed_at && formatDateIntlTimeDate(pdfData.signed_at || "")
          }`}</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 44,
            }}
          >
            <View>
              <Text style={{ color: "#667085", fontSize: 12 }}>
                Муниципальное образование
              </Text>
              <Text>{`город ${pdfData.municipality}`}</Text>
            </View>
            <View>
              <Text style={{ color: "#667085", fontSize: 12 }}>тип</Text>
              <Text>{`${pdfData?.building_type}`}</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 44,
            }}
          >
            <View>
              <Text style={{ color: "#667085", fontSize: 12 }}>
                ФИО собственника помещения/представителя
              </Text>
              <Text>{`${pdfData?.victim?.last_name} ${pdfData?.victim?.first_name} ${pdfData?.victim?.patronymic}`}</Text>
            </View>
            <View>
              <Text style={{ color: "#667085", fontSize: 12 }}>
                Контактный телефон
              </Text>
              <Text>{`+7${pdfData?.victim?.phone_number}`}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 44,
            }}
          >
            <View>
              <Text style={{ color: "#667085", fontSize: 12 }}>
                Адрес объекта
              </Text>
              <Text>{`${pdfData?.address}`}</Text>
            </View>
          </View>
          <View style={{ marginTop: 48 }}>
            <Text>{`Настоящий акт составлен о том, что по состоянию на  ${
              pdfData.signed_at &&
              formatDateIntlTimeDate(pdfData.signed_at || "")
            }, выявлены следующие повреждения: `}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
