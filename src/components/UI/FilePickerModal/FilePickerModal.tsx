import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import loadImage from "blueimp-load-image";
import "./styles.scss";
import icons from "../../../assets/icons/icons";
import UploadImageApiRequest from "../../../api/UploadImage/UploadImage";

const FilePickerModal = ({ onClose, setFiles, type }: any) => {
  const uploadApi = new UploadImageApiRequest();

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      if (acceptedFiles.length > 0) {
        const formData = new FormData();

        acceptedFiles.forEach((file: any) => {
          loadImage(
            file,
            //@ts-ignore
            (canvas) => {
              //@ts-ignore
              canvas.toBlob((blob) => {
                formData.append("files", blob, file.name);
                if (formData.get("files")) {
                  uploadApi.uploadImage(formData).then((resp) => {
                    if (resp.success) {
                      setFiles(resp.data);
                      onClose(); // Закрытие всплывающего окна после загрузки файлов
                    }
                  });
                }
              }, file.type);
            },
            { orientation: true, canvas: true }
          );
        });
      }
    },
    [uploadApi, setFiles, onClose]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      type === "image"
        ? {
            "image/png": [".jpg", ".png"],
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
