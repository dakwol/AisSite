import React, { FC, useEffect, useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import ActsApiRequest from "../../api/Acts/Acts";
import {
  formatDateIntlDate,
  formatDateIntlTimeDate,
} from "../UI/functions/functions";
import apiConfig from "../../api/apiConfig";

// Подключаем кириллический шрифт
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
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
    paddingHorizontal: 44,
    paddingVertical: 40,
    flexDirection: "column",
    justifyContent: "space-between",
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
          <View>
            <Text
              style={{ fontSize: 22 }}
            >{`Акт осмотра ${pdfData?.building_type}, поврежденного в результате чрезвычайной ситуации`}</Text>
            <Text
              style={{
                color: "#2970FF",
                marginTop: 12,
                fontSize: 22,
              }}
            >{`№${pdfData?.number} от ${
              pdfData.signed_at &&
              formatDateIntlTimeDate(pdfData.signed_at || "")
            }`}</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 22,
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#667085",
                    fontSize: 12,
                    fontWeight: 400,
                  }}
                >
                  Муниципальное образование
                </Text>
                <Text
                  style={{ fontSize: 12, fontWeight: 400 }}
                >{`город ${pdfData.municipality}`}</Text>
              </View>
              <View>
                <Text
                  style={{
                    color: "#667085",
                    fontSize: 12,
                    fontWeight: 400,
                  }}
                >
                  тип
                </Text>
                <Text
                  style={{ fontSize: 12, fontWeight: 400 }}
                >{`${pdfData?.building_type}`}</Text>
              </View>
            </View>

            {pdfData?.victim && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 22,
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "#667085",
                      fontSize: 12,
                      fontWeight: 400,
                    }}
                  >
                    ФИО собственника помещения/представителя
                  </Text>
                  <Text
                    style={{ fontSize: 12, fontWeight: 400 }}
                  >{`${pdfData?.victim?.last_name} ${pdfData?.victim?.first_name} ${pdfData?.victim?.patronymic}`}</Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: "#667085",
                      fontSize: 12,
                      fontWeight: 400,
                    }}
                  >
                    Контактный телефон
                  </Text>
                  <Text
                    style={{ fontSize: 12, fontWeight: 400 }}
                  >{`+7${pdfData?.victim?.phone_number}`}</Text>
                </View>
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 22,
              }}
            >
              <View>
                <Text style={{ color: "#667085", fontSize: 12 }}>
                  Адрес объекта
                </Text>
                <Text
                  style={{ fontSize: 12, fontWeight: 200 }}
                >{`${pdfData?.address}`}</Text>
              </View>
            </View>
            <View style={{ marginTop: 24 }}>
              <Text
                style={{ fontSize: 16 }}
              >{`Настоящий акт составлен о том, что по состоянию на  ${
                pdfData.signed_at &&
                formatDateIntlTimeDate(pdfData.signed_at || "")
              }, выявлены следующие повреждения: `}</Text>
            </View>

            <View style={{ marginTop: 12 }}>
              {pdfData?.damages?.map((item: any, index: number) => {
                return (
                  <Text style={{ fontSize: 12 }} key={index}>{`${index + 2}. ${
                    item?.damage_type
                  }, ${item?.name}, ${item?.count}шт (${
                    item?.note
                  }), фото (приложение №${index + 2})`}</Text>
                );
              })}
            </View>
            <View
              style={{
                width: "100%",
                backgroundColor: "#D0D5DD",
                height: 2,
                marginVertical: 20,
              }}
            ></View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 12, marginBottom: 8 }}>
                Подписи лиц, проводивших осмотр помещения
              </Text>
              <Text
                style={{ fontSize: 16, marginBottom: 4 }}
              >{`${pdfData?.employee?.last_name} ${pdfData?.employee?.first_name} ${pdfData?.employee?.patronymic}`}</Text>
              <Text style={{ fontSize: 12, color: "#667085" }}>
                Подписано через систему АИС «Контроль повреждений»
              </Text>
            </View>
            {pdfData?.victim && (
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{ fontSize: 12, fontWeight: "light", marginBottom: 8 }}
                >
                  Подпись лица, присутствующего при осмотре жилого помещения
                  (собственник/представитель)
                </Text>
                <Text
                  style={{ fontSize: 16, marginBottom: 4 }}
                >{`${pdfData?.victim?.last_name} ${pdfData?.victim?.first_name} ${pdfData?.victim?.patronymic}, +7${pdfData?.victim?.phone_number}`}</Text>
                {pdfData.act_images !== 0 ? (
                  <Text
                    style={{ fontSize: 12, color: "#667085" }}
                  >{`Подписано актом через систему АИС «Контроль повреждений» ${
                    pdfData.signed_at &&
                    formatDateIntlTimeDate(pdfData.signed_at || "")
                  } Приложение №1`}</Text>
                ) : (
                  <Text
                    style={{ fontSize: 12, color: "#667085" }}
                  >{`Подписано СМС-сообщением через систему АИС «Контроль повреждений» ${
                    pdfData.signed_at &&
                    formatDateIntlTimeDate(pdfData.signed_at || "")
                  }`}</Text>
                )}
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 12 }}>
              Акт создан в АИС «Контроль повреждений»
            </Text>
            <Text
              style={{ fontSize: 12 }}
              render={({ pageNumber, totalPages }) =>
                `Страница ${pageNumber} из ${totalPages}`
              }
            />
          </View>
        </View>
      </Page>

      {pdfData?.act_images?.map((item: any, index: number) => {
        const pagesCount = Math.ceil(pdfData?.act_images.length / 2); // Calculate the number of pages needed

        // Iterate over the pages
        return Array.from({ length: pagesCount }, (_, pageIndex) => {
          const startIndex = pageIndex * 2;
          const endIndex = Math.min(startIndex + 2, pdfData?.act_images.length);

          // Render the Page component with two images
          return (
            <Page size="A4" style={styles.page} key={`${index}-${pageIndex}`}>
              <View style={styles.section}>
                <View>
                  <Text
                    style={{ fontSize: 12, marginBottom: 8 }}
                  >{`Приложение №1 к акту ${pdfData.number} от ${
                    pdfData.signed_at &&
                    formatDateIntlTimeDate(pdfData.signed_at || "")
                  }`}</Text>
                  {/* Render two images per page */}
                  {pdfData?.act_images
                    .slice(startIndex, endIndex)
                    .map((image: any, imageIndex: number) => {
                      return (
                        <Image
                          key={`${index}-${pageIndex}-${imageIndex}`}
                          style={{
                            width: "100%",
                            objectFit: "cover",
                            height: "50%",
                            marginBottom: 8, // Adjust as needed
                          }}
                          src={`${apiConfig.baseUrlMedia}${image.file}`}
                        />
                      );
                    })}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 12 }}>
                    Акт создан в АИС «Контроль повреждений»
                  </Text>
                  <Text
                    style={{ fontSize: 12 }}
                    render={({ pageNumber, totalPages }) =>
                      `Страница ${pageNumber} из ${totalPages}`
                    }
                  />
                </View>
              </View>
            </Page>
          );
        });
      })}

      {pdfData?.damages?.map((item: any, index: number) => {
        const images = item?.damage_images || [];
        const pagesCount = Math.ceil(images.length / 2); // Calculate the number of pages needed

        // Iterate over the pages
        return Array.from({ length: pagesCount }, (_, pageIndex) => {
          const startIndex = pageIndex * 2;
          const endIndex = Math.min(startIndex + 2, images.length);

          // Render the Page component with two images
          return (
            <Page size="A4" style={styles.page} key={`${index}-${pageIndex}`}>
              <View style={styles.section}>
                <View>
                  <Text
                    style={{ fontSize: 12, marginBottom: 8 }}
                  >{`Приложение №${index + 2} к акту ${pdfData.number} от ${
                    pdfData.signed_at &&
                    formatDateIntlTimeDate(pdfData.signed_at || "")
                  }`}</Text>
                  {/* Render two images per page */}
                  {images
                    .slice(startIndex, endIndex)
                    .map((image: any, imageIndex: number) => {
                      return (
                        <Image
                          key={`${index}-${pageIndex}-${imageIndex}`}
                          style={{
                            width: "100%",
                            objectFit: "cover",
                            height: "50%",
                            marginBottom: 8, // Adjust as needed
                          }}
                          src={`${apiConfig.baseUrlMedia}${image.file}`}
                        />
                      );
                    })}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 12 }}>
                    Акт создан в АИС «Контроль повреждений»
                  </Text>
                  <Text
                    style={{ fontSize: 12 }}
                    render={({ pageNumber, totalPages }) =>
                      `Страница ${pageNumber} из ${totalPages}`
                    }
                  />
                </View>
              </View>
            </Page>
          );
        });
      })}
    </Document>
  );
};

export default MyDocument;
