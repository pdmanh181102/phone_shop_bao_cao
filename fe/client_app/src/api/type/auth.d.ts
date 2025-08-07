export interface LoginResponse{
    accountUid: string
}

export interface CheckLoginResponse{
    accountUid: string,
    userUid: string,
    authorities: string[],
}