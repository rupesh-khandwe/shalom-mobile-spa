import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
//import { BASE_URL_USER_PROFILE } from '../Config.js'

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    BASE_URL_USER_PROFILE = 'http://192.168.68.133:8090/userProfile/v1';

    const login = (userName, password) => {
        setIsLoading(true);
        axios
        .post(`${BASE_URL_USER_PROFILE}/authenticate`, {
             userName, 
             password
        })
        .then((res) => {
            let userInfo = res.data;
            console.log(JSON.stringify(userInfo));
            setUserInfo(userInfo);
            setUserToken(userInfo.jwttoken);
            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            AsyncStorage.setItem('userToken', userInfo.jwttoken);
        })
        .catch((err) => console.log(`Login error ${err}`)); 
        setIsLoading(false);
     }

     const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');
        setIsLoading(false);
     }

     const isLoggedIn = async()=>{
        try {
            setIsLoading(true);
            let userInfo = await AsyncStorage.getItem('userInfo');
            let userToken = await AsyncStorage.getItem('userToken');
            userInfo = JSON.parse(userInfo);

            if(userInfo){
                setUserToken(userToken);
                setUserInfo(userInfo);
            }
            setIsLoading(false);
        } catch (error) {
            console.log(`isLogged in error ${error}`);
        }
     }

     useEffect(() => {
        isLoggedIn();
     }, []);

    return (
        <AuthContext.Provider value={{login, logout, isLoading, userToken, userInfo}}>
            {children}
        </AuthContext.Provider>
    );
}
