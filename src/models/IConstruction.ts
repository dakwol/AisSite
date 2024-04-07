
export interface IConstructionInfoStages {
    id: number | string;
    status: number | string;
    is_overdue: boolean;
    date_of_success: string | null | undefined;
    deadline: string | undefined;
    name: string | undefined;
    remark: string | undefined;
    is_ready: boolean | undefined;
  }
  
  export interface IConstructionInfo {
    address: string;
    contractor: string;
    created_at: string;
    id: number | string;
    name: string;
    responsible: {
      email: string;
      fio: string;
      organisation: string;
      phone: string;
    };
    stages: IConstructionInfoStages[];
  }