export interface User {
  uid: string;
  email: string;
  displayName: string;
  contacts: Array<unknown>;
  allTasks: Array<unknown>,
  userData: any;
  emailVerified: boolean;
  rememberLogin: boolean;
}
