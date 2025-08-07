const ACCOUNT_UID_KEY = "accountUid";
const USER_UID_KEY = "userUid";
const AUTHORIES_KEY = "authories";

export class AuthStorage {
  static getAccountUid(): string | null {
    return localStorage.getItem(ACCOUNT_UID_KEY);
  }

  static getUserUid(): string | null {
    return localStorage.getItem(USER_UID_KEY);
  }

  static setAccountUid(accountUid: string): void {
    localStorage.setItem(ACCOUNT_UID_KEY, accountUid);
  }

  static setUserUid(userUid: string): void {
    localStorage.setItem(USER_UID_KEY, userUid);
  }

  static setAuthories(authories: string[]): void {
    localStorage.setItem(AUTHORIES_KEY, authories.join(","));
  }

  static getAuthories(): string[] {
    const authories = localStorage.getItem(AUTHORIES_KEY)?.split(",");
    if (authories) return authories;
    return [];
  }

  static clear(): void {
    localStorage.clear();
  }
}
