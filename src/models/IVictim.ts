export interface Victim {
    last_name: string;
    first_name: string;
    patronymic: string;
    phone_number: string;
    [key: string]: string; // Для поддержки дополнительных контактов
  }
  
export interface ContactInput {
    id: number;
    label: string;
    key: string;
    type: string;
}
  