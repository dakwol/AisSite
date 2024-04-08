import React, { useState, ChangeEvent } from "react";
import icons from "../../../assets/icons/icons";
import UploadImageApiRequest from "../../../api/UploadImage/UploadImage";

const ImagePicker: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isImages, setImages] = useState<File[]>([]);
  const uploadApi = new UploadImageApiRequest();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
      handleImageUpload();
    }
  };

  const handleImageUpload = () => {
    const formData = new FormData();
    selectedImages.forEach((image, index) => {
      formData.append(`images`, image);
    });

    console.log("formData", formData);

    uploadApi.uploadImage(formData).then((resp) => {
      if (resp.success) {
        //@ts-ignore
        resp.data && setImages(resp.data);
      } else {
        // Обработка ошибки загрузки
      }
    });
  };

  console.log("isImages", isImages);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        id="imageInput"
        multiple
      />
      <label htmlFor="imageInput">
        <div>
          <img src={icons.photo} alt="Иконка Фото" />
          <p>Выбрать изображения</p>
        </div>
        {isImages.length > 0 &&
          isImages.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Выбранное изображение ${index + 1}`}
              style={{ marginRight: "10px", marginBottom: "10px" }}
            />
          ))}
      </label>
    </div>
  );
};

export default ImagePicker;
