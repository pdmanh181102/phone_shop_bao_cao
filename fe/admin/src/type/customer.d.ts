export interface Customer {
  uid: string;

  username: string;

  password: string;

  firstName: string;

  lastName: string;

  gender: string;

  birthDay: string | Date;

  address: string;

  phoneNumber: string;

  email: string;

  photoUrl?: string;
  status: string;
}

export interface CreateCustomer {
  username: string;

  password: string;

  firstName: string;

  lastName: string;

  gender: string;

  birthDay: string; // ISO string: "YYYY-MM-DD"

  address: string;

  phoneNumber: string;

  email: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}
