import { IOptionInput } from "./IOptionInput";

export interface IJobCreate {
    job_type: IOptionInput;
    job_category: IOptionInput;
    job_activity: IOptionInput;
    title: IOptionInput;
    salary_min: IOptionInput;
    salary_max: IOptionInput;
    description: IOptionInput;
    employer: IOptionInput;
}