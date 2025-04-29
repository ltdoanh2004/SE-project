import { createContext } from "react";

export const AuthProvider = createContext({isAuth: false, setIsAuth: () => {}});
export const UserPublicInfoProvider = createContext({userInfo: {userId: 0, userName: ''}, setUserInfo: () => {}});