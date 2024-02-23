import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import CustomDrawer from '../components/common/CustomDrawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TabNavigator from './TabNavigator';
import Profile from '../components/user-signinup/Profile';
import BackHistory from '../components/common/BackHistory';
import Settings from '../components/Settings';
import EditProfile from '../components/user-signinup/EditProfile';
import FollowUser from '../components/user-signinup/FollowUser';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const AppStack = () => {

  const ProfileStack = () => {
    return (
      <Stack.Navigator>
       
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerLeft: (props) => (
              <BackHistory name="back"></BackHistory>
             ),

          }}
        />
        <Stack.Screen
          name="Edit-profile"
          component={EditProfile}
          options={{
            headerLeft: (props) => (
              <BackHistory name="back"></BackHistory>
             ),

          }}
        />
        <Stack.Screen
          name="Follow-user"
          component={FollowUser}
          options={{
            headerLeft: (props) => (
              <BackHistory name="back"></BackHistory>
             ),

          }}
        />
      </Stack.Navigator>
    );
  };

  const SettingsStack = () => {
    return (
      <Stack.Navigator>
         <Stack.Screen
          name=" "
          component={Settings}
          options={{
            headerLeft: (props) => (
              <BackHistory name="back"></BackHistory>
             ),

          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#aa18ea',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,
        },
      }}>
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppStack;
