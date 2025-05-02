export interface Employee {
    id:string,
    emp_id: number;
    name: string;
    organ: string;
    position: string;
    addresses:{location:string ;pincode:number;contact:number}[];
  }
  