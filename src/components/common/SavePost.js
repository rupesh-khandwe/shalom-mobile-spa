import React, {useContext, useEffect, useState} from 'react'
import CustomTopNavButton from './CustomTopNavButton';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL_API} from '@env'
import { useNavigation } from '@react-navigation/native';

const SavePost = ({ }) => {
    const navigation = useNavigation();
    const {shalom, userToken, userInfo} = useContext(AuthContext);
    //const BASE_URL_API = "http://192.168.68.131:5000/api/shalom/v1";
    const [userId, setUserId]= useState('');
    const [userName, setUserName]= useState('');
    const data = {
        'userId': userId,
        'shalom': shalom,
        'userName': userName
    }

    useEffect(() =>{
        setUserId(userInfo.userId);
        setUserName(userInfo.userFirstName+" "+userInfo.userLastName);
        console.log(userId+"****"+userName+ "***"+ BASE_URL_API);
    });

    const saveAction = () => {
        axios
        .post(`${BASE_URL_API}/save`, 
            data,
            {headers: { 'content-type': 'application/json', 'Authorization': "Bearer "+ userToken},
        })
        .then((res) => {
            navigation.goBack();
        })
        .catch((err) => console.log(`Login error ${err}`)); 
    }

  return (
    <CustomTopNavButton 
    label={"Save"} 
    onPress={ () => {
        saveAction();
    }} 
/>
  )
}

export default SavePost