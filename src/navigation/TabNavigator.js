import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Screens
import HomeScreen from '../components/HomeScreen';
import ShalomScreen from '../components/Shalom';
import EventsScreen from '../components/Events';
import GoLiveScreen from '../components/GoLive';
import ChurchScreen from '../components/Church';

//import Ionicons from 'react-native-vector-icons/Ionicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import Feather from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GameDetails"
        component={GameDetailsScreen}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {backgroundColor: '#AD40AF'},
        tabBarInactiveTintColor: '#fff',
        tabBarActiveTintColor: 'yellow',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({route}) => ({
          tabBarStyle: {
            display: 'flex',
            backgroundColor: '#AD40AF',
          },
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        })}
      />
      <Tab.Screen
        name="Shalom"
        component={ShalomScreen}
        options={{
          tabBarBadge: 3,
          tabBarBadgeStyle: {backgroundColor: 'yellow'},
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home-group-plus" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="today-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="GoLive"
        component={GoLiveScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="videocam-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Church"
        component={ChurchScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="church" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const getTabBarVisibility = route => {
   console.log(route);
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
   console.log(routeName);

 
  return 'flex';
};

export default TabNavigator;
