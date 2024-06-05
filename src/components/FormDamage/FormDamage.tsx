import React, { FC, useEffect, useState } from "react";
import FormInput from "../FormInput/FormInput";
import FilePickerModal from "../UI/FilePickerModal/FilePickerModal";
import apiConfig from "../../api/apiConfig";

interface IProps {
  index: number;
  inputDamage: any;
  dataPress: any;
  handleChange: (key: string, value: string | boolean) => void;
  handleType?: (type: number | string) => void;
}

const FormDamage: FC<IProps> = ({
  index,
  inputDamage,
  dataPress,
  handleChange,
  handleType,
}) => {
  const handleTypeDamage = (key: string, value: string) => {
    handleChange(key, value);
  };

  const [arrayImage, setArrayImage] = useState([]);
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    if (arrayImage.length > 0) {
      //@ts-ignore
      handleChange(index, "damage_images", arrayImage);
    }
  }, [arrayImage]);

  console.log("dataPress", dataPress);

  return (
    <div className="formContainer">
      {inputDamage.length > 0 &&
        inputDamage.map((item: any) => {
          if (item.key === "damage_type") {
            return item.options.map((data: any) => {
              return (
                <div onClick={() => handleTypeDamage(data.id, data.value)}>
                  <p>{data.display_name}</p>
                </div>
              );
            });
          }
        })}
      {/* {inputDamage.map((item: any) => {
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
              required={item.key != "note" && true}
              type={item.type}
              error={""}
              keyData={""}
            />
          );
        }
      })} */}
    </div>
  );
};

export default FormDamage;
