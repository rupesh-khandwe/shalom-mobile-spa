import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import OnboardingScreen from '../components/OnboardingScreen';
import LoginScreen from '../components/user-signinup/LoginScreen';
import RegisterName from '../components/user-signinup/Registration/Name';
import RegisterEmail from '../components/user-signinup/Registration/Email'
import RegisterMobile from '../components/user-signinup/Registration/Mobile'
import RegisterPassword from '../components/user-signinup/Registration/Password'
import BackHistory from '../components/common/BackHistory';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register-Name" component={RegisterName} />
      <Stack.Screen
        name="Register-Email"
        component={RegisterEmail}
        options={{
          
        }}
      />
      <Stack.Screen
        name="Register-Mobile"
        component={RegisterMobile}
        options={{
         
        }}
      />
      <Stack.Screen
        name="Register-Password"
        component={RegisterPassword}
        options={{
         
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
