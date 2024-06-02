import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard
} from 'react-native';

import InputField from '../../common/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import GoogleSVG from '../../../assets/images/misc/GoogleSVG';
import FacebookSVG from '../../../assets/images/misc/FacebookSVG';
import TwitterSVG from '../../../assets/images/misc/TwitterSVG';
import CustomButton from '../../common/CustomButton';
import { icon } from '../../../assets/images';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import {REACT_APP_LOCATION_API, REACT_APP_USER_PROFILE} from '@env'
import PhoneInput from "react-native-phone-number-input";
import { FontAwesome, AntDesign } from '@expo/vector-icons'; 
import { LoginManager, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import GetLocation from 'react-native-get-location'

export default function RegisterScreen({navigation}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [formFields, setFormFields] = useState({
    email: '',
    firstName: ''
  });
  const [errors, setErrors] = useState({});
  const [secureText, setSecureText] = useState(true);
  const [confirmSecureText, setConfirmSecureText] = useState(true);

  useEffect(() => {

    console.log("Registration launched"+REACT_APP_LOCATION_API);

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
    .then(location => {
          console.log(location);
    })
    .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
    })
  }, []);

  const validateForm = () =>{
      Keyboard.dismiss();
      let errors = {};
      const requireFieldMsg = " Required field*";
      const regexPhone = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
      let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if(!firstName) errors.firstName = requireFieldMsg;
      if(!lastName) errors.lastName = requireFieldMsg;
  
      setErrors(errors);
      return Object.keys(errors).length === 0;
  }

  const handleSubmit = () =>{
    if(validateForm()){
      console.log("Submitted", firstName, lastName);
      setFirstName("");
      setLastName("");
      setErrors({});
      console.log(errors+"****");
      navigation.push("Register-Email", {
        "firstName": firstName,
        "lastName": lastName
      })
    }
  }


  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center', marginTop: 40, marginBottom: 40}}>
          <Image
            source={icon}
            width={100}
            height={100}
            style={{transform: [{rotate: '-2deg'}]}}
          />
        </View>

       {/*  <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          What's your name?
        </Text> */}

        <InputField
          label={'First Name*'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          //onChangeText={(text) => {handleOnChange(text, 'firstName')}}
          onChangeText={(text) => {setFirstName(text)}}
          value={firstName}
          error={errors.firstName}
        />
       
        <InputField
          label={'Last Name*'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setLastName(text)}}
          value={lastName}
          error={errors.lastName}
        />
  
       {/*  <CustomButton label={'Register'} onPress={handleSubmit} /> */}
{/*         <CustomButton label={'Next'} onPress={() => navigation.push("Register-Email", {
                    "firstName": firstName,
                    "lastName": lastName
                  })} /> */}
            <CustomButton label={'Next'} onPress={handleSubmit} /> 
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.9,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  dropdownRegion: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 25,
  },
  phoneInput: {
    width:'100%',
    height: 55,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc', 
    marginBottom: 20, 
    paddingHorizontal: 10, 
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray'
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  }
});
