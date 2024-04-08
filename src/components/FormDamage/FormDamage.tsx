import React, { FC } from "react";
import FormInput from "../FormInput/FormInput";
import FilePickerModal from "../UI/FilePickerModal/FilePickerModal";
import apiConfig from "../../api/apiConfig";

interface IProps {
  index: number;
  inputDamage: any;
  dataPress: any;
  handleChange: (index: number, key: string, value: string | boolean) => void;
  handleType?: (type: number | string) => void;
}

const FormDamage: FC<IProps> = ({
  index,
  inputDamage,
  dataPress,
  handleChange,
  handleType,
}) => {
  const handleTypeDamage = (index: number, key: string, value: string) => {
    handleType && value && handleType(value);
    handleChange(index, key, value);
  };

  return (
    <div className="formContainer">
      {inputDamage.map((item: any) => {
        if (item.key === "damage_type" && index !== 0) {
          return null;
        } else {
          return (
            <FormInput
              style={""}
              value={dataPress?.damages && dataPress?.damages[item.key]}
              options={item.options}
              onChange={(value) =>
                item.key === "damage_type"
                  ? handleTypeDamage(index, item.key, value)
                  : handleChange(index, item.key, value)
              }
              subInput={item.label}
              required={false}
              type={item.type}
              error={""}
              keyData={""}
            />
          );
        }
      })}
      <div className="containerImagePicker">
        <FilePickerModal
          type="image"
          setFiles={(e: any) => handleChange(index, "damage_images", e)}
        />
        {dataPress?.damages?.damage_images?.length > 0 &&
          dataPress?.damages?.damage_images?.map((item: any) => {
            return (
              <img
                src={`${apiConfig.baseUrlMedia}${item.file}`}
                className="imageItem"
                key={item.file} // Добавьте ключ для избежания предупреждения React
                alt="Damage Image"
              />
            );
          })}
      </div>
    </div>
  );
};

export default FormDamage;
