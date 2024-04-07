import { IOptionInput } from "./IOptionInput";

export interface IList {
  address: IOptionInput;
  contractor: IOptionInput;
  created_at: IOptionInput;
  id: IOptionInput;
  name: IOptionInput;
  responsible: IOptionInput;
  stages: IOptionInput;
}
export interface IResponsible {
  email: string | undefined;
  fio: string | undefined;
  phone: string | undefined;
  work_position: string | undefined;
}
export interface IGetControl {
  address: string | undefined;
  contractor: string | undefined;
  created_at: string | undefined;
  id: string | undefined;
  name: string | undefined;
  responsible: IResponsible | undefined;
  stages: string | undefined;
}

export interface IData {
  data: IList;
}
export interface IDataControl {
  data: IGetControl;
}

export interface ICreateObject {
  dataConstruction: IData;
}