import React, { FC, useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import ActsApiRequest from "../../api/Acts/Acts";

// Создаем стили для нашего PDF-документа
const styles = StyleSheet.create({
  page: {
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
        resp.data && setPdfData(resp.data);
      }
    });
  }, []);

  console.log("pdfData", pdfData);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* <View style={styles.section}>
          <Text>{`Акт осмотра ${pdfData?.building_type}, поврежденного в результате чрезвычайной ситуации`}</Text>
        </View> */}
      </Page>
    </Document>
  );
};

export default MyDocument;
