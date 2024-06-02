import React, {useState, useEffect, useContext} from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomButton from '../../common/CustomButton';
import { icon } from '../../../assets/images';
import axios from 'axios';
import {REACT_APP_LOCATION_API, REACT_APP_USER_PROFILE} from '@env'
import { FontAwesome } from '@expo/vector-icons'; 
import GetLocation from 'react-native-get-location'
import { AuthContext } from '../../../context/AuthContext';

export default function RegisterScreen({route, navigation}) {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone1, setPhone1] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [secureText, setSecureText] = useState(true);
  const [confirmSecureText, setConfirmSecureText] = useState(true);
  const {login}= useContext(AuthContext);

  useEffect(() => {

    console.log("Registration launched"+REACT_APP_LOCATION_API);

    var extUserObj =  route.params
    for ( var key in extUserObj) {
       console.log(" key is : "   + key + "   and value for key is   " + extUserObj[key]);
       if(key==="firstName")
        setFirstName(extUserObj[key])
       if(key==="lastName"){
        setLastName(extUserObj[key])
      }
       if(key==="email"){
        setEmail(extUserObj[key])
        setUserName(extUserObj[key])
       }
       if(key==="phone1")
        setPhone1(extUserObj[key])
    }
       console.log("firstName ", firstName);
       console.log("lastName ", lastName);
       console.log("email ", email);
       console.log("phone1 ", phone1);
      
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
      if(!password) errors.password = requireFieldMsg;
      if(!confirmPassword) errors.confirmPassword = requireFieldMsg;
      if(password !== confirmPassword) errors.confirmedPassword = "Confirm passward must match with Password fields";
      setErrors(errors);
      return Object.keys(errors).length === 0;
  }

  const handleSubmit = () =>{
    if(validateForm()){
      setEmail("");
      setFirstName("");
      setLastName("");
      setPhone1("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
      handleRegister();
    }
  }

  const setHideFlag = () =>{
    setSecureText(!secureText)
  }

  const setConfirmHideFlag = () =>{
    setConfirmSecureText(!confirmSecureText)
  }

  const handleRegister = () => {
    console.log(handleRegister);
    console.log(firstName);
    console.log(lastName);
    
    axios
    .post(`${REACT_APP_USER_PROFILE}/register`, {
        email,
        firstName,
        lastName,
        phone1,
        userName, 
        password
    })
    .then((res) => {
        //navigation.goBack();
        /* navigation.navigate('Login', 
          "success"
        ); */
        login(userName, password)
    })
    .catch((err) => console.log(`Login error ${err}`)); 
  };

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

        <InputField
          label={'Password*'}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          inputType="password"
          onChangeText={(text) => {setPassword(text)}}
          value={password}
          fieldButtonLabel={<FontAwesome name={secureText?"eye-slash":"eye"} size={22} color="purple"/>}
          fieldButtonFunction={setHideFlag}
          error={errors.password}
          secureTextFlag={secureText}
        />

        <InputField
          label={'Confirm Password*'}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          inputType="password"
          onChangeText={(text) => {setConfirmPassword(text)}}
          value={confirmPassword}
          fieldButtonLabel={<FontAwesome name={confirmSecureText?"eye-slash":"eye"} size={22} color="purple"/>}
          fieldButtonFunction={setConfirmHideFlag}
          error={errors.confirmPassword}
          secureTextFlag={confirmSecureText}
        />
          {
            errors.confirmedPassword ? (<Text style={styles.errorText}>{errors.confirmedPassword}</Text>):null
          }

        <CustomButton label={'Register'} onPress={handleSubmit} />
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
