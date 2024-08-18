import axios from 'axios'
import jwt_decode from "jwt-decode";
import dayjs from 'dayjs'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import {REACT_APP_BASE_URL_API, REACT_APP_USER_PROFILE} from '@env'

const useAxios = () => {
    const {userToken , setUser, setAuthTokens, logout} = useContext(AuthContext)

    const axiosInstance = axios.create({
        REACT_APP_BASE_URL_API,
        headers:{Authorization: `Bearer ${userToken}`, 'content-type': 'application/json'}
    });

    axios.interceptors.request.use((config) => {
        if (config && config.headers && config.headers.Authorization) {
            const token = config.headers.Authorization;
            const user = jwt_decode(token);
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
            if (isExpired) {
                let credentials = AsyncStorage.getItem('userInfo')
                console.log("credentials === ", credentials);
                let ref = credentials.refreshToken;
                console.log("ref === ", ref);
                if (ref) {
                    let ref = credentials.refreshToken;
                    console.log("ref === ", ref);
                    const response = axios.post(`${REACT_APP_USER_PROFILE}/refreshToken`, {
                        ref
                    });

                    localStorage.setItem('authTokens', JSON.stringify(response.data))

                    setAuthTokens(response.data)
                    setUser(jwt_decode(response.data.access))

                    req.headers.Authorization = `Bearer ${response.data.access}`
                } else {
                    logout();
                }
            }
        }
        return config;
    });

    axiosInstance.interceptors.request.use(async req => {
        console.log("Inside axiosInstance interceptors for req === ", req);
        console.log("autoken === ", userToken);
        const user = jwt_decode(userToken)
        console.log("decoded user === ", user);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
        console.log("is token xpired === ", isExpired);
        if(!isExpired) return req
    
        let credentials = await AsyncStorage.getItem('userInfo')
        console.log("credentials === ", credentials);
        let ref = credentials.refreshToken;
        console.log("ref === ", ref);
        const response = await axios.post(`${REACT_APP_USER_PROFILE}/refreshToken`, {
            ref
          });
    
        localStorage.setItem('authTokens', JSON.stringify(response.data))
        
        setAuthTokens(response.data)
        setUser(jwt_decode(response.data.access))
        
        req.headers.Authorization = `Bearer ${response.data.access}`
        return req
    })
    
    return axiosInstance
}

export default useAxios;