export interface IEmployeeWithoutPasswordAndRole {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  department: string;
  street: string;
  town: string;
  state: string;
  country: string;
  createdBy: string;
  updatedBy: string;
}

export interface IEmployee {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  department: string;
  street: string;
  role: string;
  town: string;
  state: string;
  country: string;
  createdBy: string;
  updatedBy: string;
  password: string;
}
