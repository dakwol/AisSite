import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./styles.scss";
import icons from "../../../assets/icons/icons";
import UploadImageApiRequest from "../../../api/UploadImage/UploadImage";

const FilePickerModal = ({ onClose, setFiles, type, isLoading }: any) => {
  const uploadApi = new UploadImageApiRequest();
  const onDrop = useCallback((acceptedFiles: any) => {
    // Обработка выбранных файлов

    // onClose()
    if (acceptedFiles.length > 0) {
      isLoading(true);
      const formData = new FormData();

      acceptedFiles.forEach((file: any) => {
        formData.append("files", file);
      });

      uploadApi.uploadImage(formData).then((resp) => {
        if (resp.success) {
          setFiles(resp.data);
          isLoading(false);
          onClose(); // Закрытие всплывающего окна после загрузки файлов
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      type === "image"
        ? {
            "image/png": [".jpg", ".png", ".jpeg"],
          }
        : {
            "text/html": [".txt", ".docs", ".pdf", ".xlsx"],
          },
  });

  return (
    <div className="file-picker">
      <div className={`file-picker-modal ${isDragActive ? "active" : ""}`}>
        <div
          {...getRootProps()}
          className={`file-picker-dropzone ${isDragActive ? "active" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="buttonPicker">
            <img src={icons.photo} alt="Иконка Фото" />
            <p>Фото</p>
          </div>
          {/* <div className="textUploadContainer">
            <p className="textUpload">
              <b>Нажмите, чтобы загрузить</b>
              или перетащите файл
              {type === "image" ? ` PNG или JPG` : ` PDF, DOCS, XLSX или TXT`}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default FilePickerModal;
