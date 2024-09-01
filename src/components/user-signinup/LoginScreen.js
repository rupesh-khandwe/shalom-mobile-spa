import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import CustomButton from '../common/CustomButton';
import InputField from '../common/InputField';
import { AuthContext } from '../../context/AuthContext';
import GoogleSVG from '../../assets/images/misc/GoogleSVG';
import FacebookSVG from '../../assets/images/misc/FacebookSVG';
import TwitterSVG from '../../assets/images/misc/TwitterSVG';
import { cover, icon } from '../../assets/images';
import { showMessage, hideMessage  } from "react-native-flash-message";
import { LoginManager, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import * as Google from 'expo-auth-session/providers/google'
import { FontAwesome } from '@expo/vector-icons'; 

const LoginScreen = ({navigation, route}) => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const {login, userToken, googleLogin}= useContext(AuthContext);
  const register = route.params;
  const [errors, setErrors] = useState({});
  const [secureText, setSecureText] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [userGoogleInfo, setUserGoogleInfo] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState("");
/*  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "11084367898-ksku5j6u19pbkpbhk7bg5tk8lot9jbug.apps.googleusercontent.com",
    iosClientId: "11084367898-dqa37c1dkj9m41slg6l69b9gejo97k3h.apps.googleusercontent.com"
  })*/
    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '722628552321-t1hluouucdv63re40q76ja4eknp92ipj.apps.googleusercontent.com',
            androidClientId:
                '722628552321-t1hluouucdv63re40q76ja4eknp92ipj.apps.googleusercontent.com',
            offlineAccess: true,
            forceCodeForRefreshToken: true,
        });
    });
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
    console.log(secureText)
    setSecureText(!secureText)
  }

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            console.log("Google signIn == ",userInfo);
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

    const signOut = async () => {
        GoogleSignin.signOut();
        console.log("User signed out");
    }

//androidClientId: '11084367898-ksku5j6u19pbkpbhk7bg5tk8lot9jbug.apps.googleusercontent.com',
// iOS 11084367898-dqa37c1dkj9m41slg6l69b9gejo97k3h.apps.googleusercontent.com
// android 11084367898-ksku5j6u19pbkpbhk7bg5tk8lot9jbug.apps.googleusercontent.com

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center', paddingTop: 45}}>
          <Image
            source={icon}
            width={270}
            height={270}
            style={{transform: [{rotate: '-2deg'}]}}
          />
        </View>
        {!userName? <Text>{register==="success"?showMessage({
            message: "Registration is successful, please login!",
            type: "info",
            hideOnPress: true,
            backgroundColor: "purple",
          }):""}</Text>:""}

        <InputField
          label={' User email'}
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
          label={' Password'}
           icon={
          <MaterialIcons name="password" size={20} color="gray" />}
          inputType="password"
          fieldButtonLabel={<FontAwesome name={secureText?"eye-slash":"eye"} size={22} color="purple"/>}
          fieldButtonFunction={setHideFlag}
          onChangeText={(text) => {setUserPassword(text)}}
          value={userPassword}
          error={errors.userPassword}
          secureTextFlag={secureText}
          secureTextEntry={secureText}
        />


       {/* {
          errors.userPassword ? (<Text style={styles.errorText}>{errors.userPassword}</Text>):null
        } */}
        
        <CustomButton 
          label={"Login"}
          disable={false}
          onPress={handleSubmit} 
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register-Name')}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Register</Text>
          </TouchableOpacity>
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

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>Unable to login?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Need-Help')}>
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
