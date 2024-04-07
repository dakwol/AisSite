export interface IUser {
    email: string;
    lastname?: string;
    firstname?: string;
    patronymic?: string;
    password: string;
    birth_date?:string;
    fio?:string;
    phone_number?:string;
    resume?:string;
    user?:number;
    id?:number|string;
}
export interface IUserReg {
    contact_person_fio: string;
    inn: string;
    legal_address: string;
    name: string;
    phone_number: string;
}