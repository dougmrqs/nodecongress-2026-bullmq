export interface User {
  username: string;
  email: string;
}

export interface BulkRequest {
  data: User[];
  callbackEmail: string;
}

export interface BulkResponse {
  accepted: boolean;
  callbackEmail: string;
}

export interface BulkRegistrationParentData {
  callbackEmail: string;
}
