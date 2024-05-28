import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import loadImage from "blueimp-load-image";
import "./styles.scss";
import icons from "../../../assets/icons/icons";
import UploadImageApiRequest from "../../../api/UploadImage/UploadImage";

const FilePickerModal = ({ onClose, setFiles, type }: any) => {
  const uploadApi = new UploadImageApiRequest();

  const onDrop = useCallback(
    //@ts-ignore
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const formData = new FormData();

        //@ts-ignore
        acceptedFiles.forEach((file) => {
          loadImage(
            file,
            (canvas) => {
              //@ts-ignore
              canvas.toBlob((blob) => {
                formData.append("files", blob, file.name);
                if (formData.get("files")) {
                  uploadApi.uploadImage(formData).then((resp) => {
                    if (resp.success) {
                      setFiles(resp.data);
                      onClose(); // Close modal after files are uploaded
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
    //@ts-ignore
    accept:
      type === "image"
        ? "image/jpeg, image/png"
        : "text/html, .txt, .doc, .pdf, .xlsx",
    multiple: true,
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
              {type === "image" ? ` PNG или JPG` : ` PDF, DOC, XLSX или TXT`}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default FilePickerModal;
