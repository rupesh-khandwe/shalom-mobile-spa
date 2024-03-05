import React, {useContext, useEffect, useState} from 'react'
import CustomTopNavButton from './CustomTopNavButton';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL_API} from '@env'
import { useNavigation } from '@react-navigation/native';
import { showMessage, hideMessage  } from "react-native-flash-message";

const BackHistory = (props) => {
    const navigation = useNavigation();
    const backAction = () => {
        //navigation.navigate(props.name);
        props.name==="Back"?navigation.goBack():navigation.replace(props.name);
    }

  return (
    <CustomTopNavButton 
    label={null} 
    onPress={ () => {
        backAction();
    }} 
/>
  )
}

export default BackHistory