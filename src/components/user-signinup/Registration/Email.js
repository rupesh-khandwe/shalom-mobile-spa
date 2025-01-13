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
import { useFocusEffect } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { AuthContext } from '../../../context/AuthContext';

export default function Email({route, navigation}) {

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const {googleLogin}= useContext(AuthContext);

  useEffect(() => {

    console.log("Email launched");
    GoogleSignin.configure({
      webClientId:
          '494269236356-iopl5mdss5hjcv94deq89egm2c18ifb6.apps.googleusercontent.com',
      offlineAccess: true,
      //forceCodeForRefreshToken: true,
  });

  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // This will be called when the screen comes into focus, 
      // including when navigating back to it
     // console.log('Screen focused', formData);
     GoogleSignin.configure({
      webClientId:
          '494269236356-iopl5mdss5hjcv94deq89egm2c18ifb6.apps.googleusercontent.com',
      offlineAccess: true,
      //forceCodeForRefreshToken: true,
  });
     retrieveUserSession();

      return () => {
        // This will be called when the screen goes out of focus
        console.log('Screen blurred');
      };
    }, [])
  );

  async function retrieveUserSession() {
    try {   
        const registerEmail = await EncryptedStorage.getItem("register_email");
        console.log("  registerEmail value for key is   " + registerEmail?JSON.parse(registerEmail).email:"");
        setEmail(registerEmail?JSON.parse(registerEmail).email:"");
        if (registerEmail !== undefined) {

        }
    } catch (error) {
        // There was an error on the native side
    }
}

  async function storeUserSession(formValues) {
    try {
        await EncryptedStorage.setItem(
            "register_email",
            JSON.stringify(formValues)
        );
        console.log("Congrats! You've just stored your Email value!");
        // Congrats! You've just stored your first value!
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
      if(!email){
        errors.email = requireFieldMsg
      } else if(!regexEmail.test(email)){
        errors.email = "Email is invalid"
      }
      setErrors(errors);
      return Object.keys(errors).length === 0;
  }

  const handleSubmit = () =>{
    if(validateForm()){
      setEmail("");
      setErrors({});
      const formValues = {
        "email": email
      }
      storeUserSession(formValues);
      //setFormData(formValues);
      navigation.push("Register-Mobile")
    }
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

        {/* <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          What's your email address?
        </Text> */}

        <InputField
          label={'Email ID*'}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          keyboardType="email-address"
          // onChangeText={(text) => {setEmail(text);handleOnChange(text, 'email')}}
          // // (text) => {setEmail(text)}
          // onFocus={()=> {
          //   handleError(null, 'email')
          // }}
          onChangeText={(text) => {setEmail(text)}}
          value={email}
          error={errors.email}
        />
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
