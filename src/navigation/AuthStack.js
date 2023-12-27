import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import OnboardingScreen from '../components/OnboardingScreen';
import LoginScreen from '../components/user-signinup/LoginScreen';
import RegisterScreen from '../components/user-signinup/RegisterScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
