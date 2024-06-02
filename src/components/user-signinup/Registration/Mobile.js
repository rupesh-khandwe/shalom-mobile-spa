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

import CustomButton from '../../common/CustomButton';
import { icon } from '../../../assets/images';
import axios from 'axios';
import {REACT_APP_LOCATION_API, REACT_APP_USER_PROFILE} from '@env'
import PhoneInput from "react-native-phone-number-input";
import GetLocation from 'react-native-get-location'

export default function Mobile({route, navigation}) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone1, setPhone1] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [errors, setErrors] = useState({});
  const [secureText, setSecureText] = useState(true);
  const [confirmSecureText, setConfirmSecureText] = useState(true);

  useEffect(() => {

    console.log("Registration launched"+REACT_APP_LOCATION_API);

    var extUserObj =  route.params
    for ( var key in extUserObj) {
       console.log(" key is : "   + key + "   and value for key is   " + extUserObj[key]);
       if(key==="firstName")
        setFirstName(extUserObj[key])
       if(key==="lastName")
        setLastName(extUserObj[key])
       if(key==="email")
        setEmail(extUserObj[key])
    }
       console.log("firstName ", firstName);
       console.log("firstName ", lastName);
       console.log("email ", email);

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
      if(!phone1){
        errors.phone1 = "Please enter phone";
      } else if(!regexPhone.test(phone1)){
        errors.phone1 = "Invalid phone";
      }
      setErrors(errors);
      return Object.keys(errors).length === 0;
  }

  const handleSubmit = () =>{
    if(validateForm()){
      setPhone1("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setErrors({});
      navigation.push("Register-Password", {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "phone1": phone1
      })
    }
  }

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center', marginTop: 40, marginBottom:40}}>
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
          What's your phone number?
        </Text> */}

      

       

      <PhoneInput
            defaultValue={phone1}
            textInputProps={{maxLength: 10}}
            onChangeText={(text) => {
              setPhone1(text);
            }}
            onChangeFormattedText={(text) => {
              setPhone1(text);
            }}
            containerStyle={styles.phoneInput}
            placeholder="Phone*"
            error={errors.phone1}
          />
        {
          errors.phone1 ? (<Text style={styles.errorText}>{errors.phone1}</Text>):null
        }
      
        <CustomButton label={'Next'} onPress={handleSubmit} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>Already registered?</Text>
          <TouchableOpacity onPress={() =>navigation.navigate('Login')}>
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
