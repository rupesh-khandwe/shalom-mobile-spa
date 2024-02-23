import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

import CustomButton from '../common/CustomButton';
import InputField from '../common/InputField';
import { AuthContext } from '../../context/AuthContext';
import GoogleSVG from '../../assets/images/misc/GoogleSVG';
import FacebookSVG from '../../assets/images/misc/FacebookSVG';
import TwitterSVG from '../../assets/images/misc/TwitterSVG';
import { cover, icon } from '../../assets/images';
import { showMessage, hideMessage  } from "react-native-flash-message";
import { LoginManager, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { FontAwesome } from '@expo/vector-icons'; 

const LoginScreen = ({navigation, route}) => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const {login, userToken}= useContext(AuthContext);
  const register = route.params;
  const [errors, setErrors] = useState({});
  const [secureText, setSecureText] = useState(true);

  const validateForm = () =>{
    let errors = {}
    const requireFieldMsg = " Required field*"
    if(!userName) errors.userName = requireFieldMsg;
    if(!userPassword) errors.userPassword = requireFieldMsg;

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = () =>{
    if(validateForm()){
      console.log("Submitted", userName, userPassword);
      setUserName("");
      setUserPassword("");
      setErrors({});
      console.log(errors+"****"+userName+"***"+userPassword);
      login(userName, userPassword)
    }
  }

  const setHideFlag = () =>{
    setSecureText(!secureText)
  }

useEffect(()=>{
  GoogleSignin.configure()
}, []);


const googleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    setState({ userInfo });
    console.log("Google user info", userInfo);
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      console.log(error)
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
      console.log(error)
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
      console.log(error)
    } else {
      // some other error happened
      console.log("Default error ",error)
    }
  }
};

const fbLogin = (resCallback) => {
  LoginManager.logOut();
  return LoginManager.logInWithPermissions(['email', 'public_profile']).then(
    result => {
      console.log("fb results=="+result)
      if(result.declinedPermissions && result.declinedPermissions.includes("email")){
        resCallback({message: "Email is required"})
      }
      if(result.isCancelled){
        console.log("Error")
      } else {
        const infoRequest = new GraphRequest(
          '/me?fields=email,name,picture',
          null,
          resCallback
        );
        new GraphRequestManager().addRequest(infoRequest).start()
      }
    },
    function(error){
      console.log("Login fail with error:", error)
    }
  )
}

const onFbLogin = async() => {
  try {
    await fbLogin(_responseInfoCallBack)
  } catch (error) {
    console.log("FB login error",error)
  }
}

const _responseInfoCallBack = async(error, result) =>{
  if(error){
    console.log("error fb1", error)
    return;
  } else{
    const userData = result
    console.log("FB data===", userData)
  }
}

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center', paddingTop: 30}}>
          <Image
            source={icon}
            width={300}
            height={300}
            style={{transform: [{rotate: '-15deg'}]}}
          />
        </View>
        <Text>{register==="success"?showMessage({
            message: "Registration is successful, please login!",
            type: "info",
            hideOnPress: true,
            backgroundColor: "purple",
          }):""}</Text>
        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Login
        </Text>
        <Text>{userToken}</Text>

        <InputField
          label={'User name'}
          icon={
            <MaterialIcons
            name="alternate-email"
            size={20}
            color="#666"
            style={{marginRight: 5}}
          />
          }
          keyboardType="email-address"
          onChangeText={(text) => {setUserName(text)}}
          value={userName}
          error={errors.userName}
        />
        {/* {
          errors.userName ? (<Text style={styles.errorText}>{errors.userName}</Text>):null
        } */}

        <InputField
          label={'Password'}
          icon={
            <Ionicons
            name="ios-lock-closed-outline"
            size={20}
            color="#666"
            style={{marginRight: 5}}
          />
          }
          inputType="password"
          fieldButtonLabel={<FontAwesome name={secureText?"eye-slash":"eye"} size={22} color="purple"/>}
          fieldButtonFunction={setHideFlag}
          onChangeText={(text) => {setUserPassword(text)}}
          value={userPassword}
          error={errors.userPassword}
          secureTextFlag={secureText}
        />
       {/* {
          errors.userPassword ? (<Text style={styles.errorText}>{errors.userPassword}</Text>):null
        } */}
        
        <CustomButton 
          label={"Login"}
          disable={false}
          onPress={handleSubmit} 
        />

        <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
          Or, login with ...
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={googleLogin}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <GoogleSVG height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onFbLogin}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <FacebookSVG height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <TwitterSVG height={24} width={24} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Register</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>Unable to login?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Need Help?</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 20,
  }
});
