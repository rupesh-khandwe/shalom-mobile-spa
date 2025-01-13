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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import CustomButton from '../../common/CustomButton';
import { icon } from '../../../assets/images';
import axios from 'axios';
import {REACT_APP_USER_PROFILE} from '@env'
import { FontAwesome } from '@expo/vector-icons'; 
import GetLocation from 'react-native-get-location'
import { AuthContext } from '../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { showMessage  } from "react-native-flash-message";
import EncryptedStorage from 'react-native-encrypted-storage';
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';

export default function RegisterScreen({route}) {
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
  const {login, googleLogin}= useContext(AuthContext);
  const [registerName, setRegisterName] = useState();
  const navigation = useNavigation();
  const [registrationD, setRegistrationD] = useState({});
  const registrationData = {};

  useEffect(() => {

    console.log("Password launched ");
    retrieveUserSession();
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
    .then(location => {
          console.log("Location = ",location);
    })
    .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
    })
    GoogleSignin.configure({
      webClientId:
          '494269236356-iopl5mdss5hjcv94deq89egm2c18ifb6.apps.googleusercontent.com',
      offlineAccess: true,
      //forceCodeForRefreshToken: true,
  });
  }, [email,userName,firstName,lastName,email,phone1]);

  const retrieveUserSession = async()=> {
    try {   
        const registerName = await EncryptedStorage.getItem("register_name");
        const registerEmail = await EncryptedStorage.getItem("register_email");
        const resiterMobile = await EncryptedStorage.getItem("register_mobile");

        const firstNm = JSON.parse(registerName).firstName;
        const lastNm = JSON.parse(registerName).lastName;
        const eml = JSON.parse(registerEmail).email;
        const phn = JSON.parse(resiterMobile).phone1;
        setFirstName(firstNm);
        setLastName(lastNm);
        setEmail(eml);
        setUserName(eml);
        setPhone1(phn);
       
        if (registerName !== undefined && registerEmail !== undefined && resiterMobile != undefined) {
            // Congrats! You've just retrieved your first value!
        }
    } catch (error) {
        // There was an error on the native side
    }
  }

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

  const signIn = async () => {
    try {
        console.log("Google signIn call start== ");  
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        console.log("Google signIn == ",JSON.stringify(userInfo));
        googleLogin(userInfo);
    } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('User cancelled the login flow');
        } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('Signing in');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('Play services not available');
        } else {
            console.log('Some other error happened');
            console.log(error.message);
            console.log(error.code);
        }
    }
  }

  async function clearStorage() {
    try {
        await EncryptedStorage.clear();
        // Congrats! You've just cleared the device storage!
    } catch (error) {
        // There was an error on the native side
    }
}

  const handleRegister = () => {
    console.log("handleRegister");
    
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
        console.log("response = ",res)
        setRegisterName("false");
        clearStorage();
        login(userName, password)
    })
    .catch((err) => {
      console.log(`Password error ${err}`);
      if(err.response.status===409) {
        console.log("err.response.status =",err.response.status);
        showMessage({
          message: "Email is already exist, please enter new email or use Gmail login button to proceed.",
          type: "info",
          hideOnPress: true,
          backgroundColor: "red",
        })
      }
      navigation.pop(2);
    }
    ); 
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
          <MaterialIcons name="password" size={20} color="gray" />}
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
          <MaterialIcons name="password" size={20} color="gray" />}
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
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
      }}>
         <Text>Or</Text>
      </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 30,
      }}>
          <GoogleSigninButton
              style={{width: 192, height: 48, marginTop: 30}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={signIn}
          />
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
