import React from 'react'
import CustomTopNavButton from './CustomTopNavButton';
import { useNavigation } from '@react-navigation/native';

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