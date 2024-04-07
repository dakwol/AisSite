import { IOptionInput } from "./IOptionInput";

export interface ISendModeration {
    contact_person_fio: IOptionInput;
    inn: IOptionInput;
    legal_address: IOptionInput;
    name: IOptionInput;
    phone_number: IOptionInput;
}