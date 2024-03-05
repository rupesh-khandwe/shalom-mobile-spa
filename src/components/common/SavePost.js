import React, {useContext, useEffect, useState} from 'react'
import CustomTopNavButton from './CustomTopNavButton';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL_API} from '@env'
import { useNavigation } from '@react-navigation/native';
import { showMessage, hideMessage  } from "react-native-flash-message";

const SavePost = (props) => {
    const navigation = useNavigation();
    const {shalom, userToken, userInfo, shalomId} = useContext(AuthContext);
    const [userId, setUserId]= useState('');
    const [userName, setUserName]= useState('');
    const shalomData = {
        'userId': userId,
        'shalom': shalom,
        'userName': userName
    }

    const commentData = {
        'userId': userId,
        'userName': userName,
        'shalomId': shalomId,
        'shalomComment': shalom,
    }

    useEffect(() =>{
        setUserId(userInfo.userId);
        setUserName(userInfo.userName);
    });

    const saveAction = () => {

        if(props.name === "comment"){
            if(shalom){
                axios
                .post(`${BASE_URL_API}/save/comment`, 
                    commentData,
                    {headers: { 'content-type': 'application/json', 'Authorization': "Bearer "+ userToken},
                })
                .then((res) => {
                    navigation.replace("Home");
                })
                .catch((err) => console.log(`Login error ${err}`)); 
            } else {
                showMessage({
                    message: "Empty comments cant be saved.",
                    type: "Danger",
                    hideOnPress: true,
                    backgroundColor: "red",
                })
            }
        }
       
        if(props.name === "shalom"){
            if(shalom){
                axios
                .post(`${BASE_URL_API}/save`, 
                    shalomData,
                    {headers: { 'content-type': 'application/json', 'Authorization': "Bearer "+ userToken},
                })
                .then((res) => {
                    navigation.replace("Shalom");
                })
                .catch((err) => console.log(`Login error ${err}`)); 
            } else {
                showMessage({
                    message: "Empty posts cant be saved.",
                    type: "Danger",
                    hideOnPress: true,
                    backgroundColor: "red",
                })
            }
        }
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