interface IResult {
    [key:string]:any
  }

export interface IPaginationData {
    count: number;
    next: string | null;
    previous: string | null;
    results: IResult[];
}
