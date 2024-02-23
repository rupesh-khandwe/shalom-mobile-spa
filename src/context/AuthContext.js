import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL_USER_PROFILE } from '@env'


export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [shalom, setShalom] = useState(null);
    const [shalomId , setShalomId] = useState(null);

    const login = (userName, password) => {
        setIsLoading(true);
        console.log("inside AuthProvider=="+BASE_URL_USER_PROFILE+"**"+userName+"=password="+password);
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

     const editorData = (post, id) => {
        setShalom(post);
        setShalomId(id);
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
        <AuthContext.Provider value={{login, logout, isLoading, userToken, userInfo, editorData, shalom, shalomId}}>
            {children}
        </AuthContext.Provider>
    );
}
