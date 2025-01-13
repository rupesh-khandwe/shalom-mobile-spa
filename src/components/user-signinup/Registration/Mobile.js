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

import CustomButton from '../../common/CustomButton';
import { AuthContext } from '../../../context/AuthContext';
import { icon } from '../../../assets/images';
import PhoneInput from "react-native-phone-number-input";
import EncryptedStorage from 'react-native-encrypted-storage';
import { useFocusEffect } from '@react-navigation/native';
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';

export default function Mobile({route, navigation}) {

  const [phone1, setPhone1] = useState('');
  const [errors, setErrors] = useState({});
  const {googleLogin}= useContext(AuthContext);

  useEffect(() => {

    console.log("Mobile launched");
    retrieveUserSession();
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
     retrieveUserSession();
     GoogleSignin.configure({
      webClientId:
          '494269236356-iopl5mdss5hjcv94deq89egm2c18ifb6.apps.googleusercontent.com',
      offlineAccess: true,
      //forceCodeForRefreshToken: true,
  });
      return () => {
        // This will be called when the screen goes out of focus
        console.log('Screen blurred');
      };
    }, [])
  );

  async function retrieveUserSession() {
    try {   
        const registerMobile = await EncryptedStorage.getItem("register_mobile");
        console.log("  registerMobile value for key is   " + registerMobile?JSON.parse(registerMobile).phone1:"");
        setPhone1(registerMobile?JSON.parse(registerMobile).phone1:"");
        if (registerMobile !== undefined) {

        }
    } catch (error) {
        // There was an error on the native side
    }
}

  async function storeUserSession(formValues) {
    try {
        await EncryptedStorage.setItem(
            "register_mobile",
            JSON.stringify(formValues)
        );
    } catch (error) {
        // There was an error on the native side
    }
}

  const validateForm = () =>{
      Keyboard.dismiss();
      let errors = {};
      const regexPhone = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
      console.log("phone= ", phone1)
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
      setErrors({});
      const formValues = {
        "phone1": phone1
      }
      storeUserSession(formValues);
      //setFormData(formValues);
      navigation.push("Register-Password")
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

      <PhoneInput
            defaultValue={phone1}
            defaultCode="IN"
            textInputProps={{maxLength: 10}}
            onChangeText={(text) => {
              setPhone1(text);
            }}
            onChangeFormattedText={(text) => {
              setPhone1(text);
            }}
            containerStyle={styles.phoneInput}
            placeholder="Phone*"
            autoFocus={true}
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
