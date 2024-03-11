import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL_USER_PROFILE } from '@env'
//import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [shalom, setShalom] = useState(null);
    const [shalomId , setShalomId] = useState(null);

    const login = (username, password) => {
        setIsLoading(true);
        console.log("inside AuthProvider=="+BASE_URL_USER_PROFILE+"**"+username+"=password="+password);
        axios
        .post(`${BASE_URL_USER_PROFILE}/authenticate`, {
             username, 
             password
        })
        .then((res) => {
            let userInfo = res.data;
            console.log(JSON.stringify(userInfo));
            setCredentials(userInfo)
            setUserToken(userInfo.accessToken);
            setUserInfo(userInfo);
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
            console.log("isLoggedIn***")
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

     async function getAccessUsingRefresh (token) {
        return axios
        .post(`${BASE_URL_USER_PROFILE}/refreshToken`, {
            token
        })
        .then((res) => res.json)
        .catch((err) => console.log(`Login error ${err}`)); 
      }
      
      async function getVerifiedKeys (keys) {
        console.log('Loading keys from storage')
        if (keys) {
          console.log('checking access')
      
          if (!isTokenExpired(keys.accessToken)) {
            console.log('returning access')
      
            return keys
          } else {
            console.log('access expired')
      
            console.log('checking refresh expiry')
      
            if (!isTokenExpired(keys.refreshToken)) {
              console.log('fetching access using refresh')
      
              const response = await getAccessUsingRefresh(keys.refreshToken)
              console("Generated new token== ", response)
      
              await AsyncStorage.setItem('userToken', JSON.stringify(response))
      
              console.log('UPDATED ONE')
      
              return response
            } else {
              console.log('refresh expired, please login')
              AsyncStorage.removeItem('userToken');
              return null
            }
          }
        } else {
          console.log('access not available please login')
      
          return null
        }
      }
      
      function isTokenExpired (token) {
        console.log("token to decode== ",token)
       // var decoded = jwtDecode(token)
  
       ///   console.log("decoded token== ",decoded)
       // if (decoded.exp < Date.now() / 1000) {
        //  console.log("token is expired== ")
       //   return true
       // } else {
       //   console.log(" token is not expired== ")
          return false
       // }
      }
      
     const setCredentials = async keys => {
        try {
          console.log("set credentials=", JSON.stringify(keys))
          await AsyncStorage.setItem('userToken', keys.accessToken)
          await AsyncStorage.setItem('userInfo', JSON.stringify(keys))
        } catch (e) {
          console.log(e)
        }
      }

     const getCredentials = async () => {
        try {
          let credentials = await AsyncStorage.getItem('userInfo')
          console.log("Get current token= ", JSON.parse(credentials))
          let cred = await getVerifiedKeys(userInfo)
          console.log("Get refreshed token= ", cred)
          if (credentials != null && cred != null) {
            return cred
          } else {
            return null
          }
        } catch (e) {
          console.log(e)
        }
      
        return null
      }



    return (
        <AuthContext.Provider value={{login, logout, isLoading, userToken, userInfo, editorData, shalom, shalomId, getCredentials}}>
            {children}
        </AuthContext.Provider>
    );
}
