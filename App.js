import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import LogoTitle from './logo';
import HeaderButtonComponent from './src/components/common/HeaderButtonComponent'
import {
  Item,
  HeaderButtons,
} from "react-navigation-header-buttons";

// Screens
import HomeScreen from './src/components/HomeScreen';
import ShalomScreen from './src/components/Shalom';
import EventsScreen from './src/components/Events';
import ChurchScreen from './src/components/Church';

//Screen names
const homeName = "Home";
const shalomName = "Shalom";
const eventsName = "Events";
const churchName = "Church";

const BottomTab = createBottomTabNavigator();

export default function App() {
  return (
    
    <NavigationContainer>
      <BottomTab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';

            } else if (rn === shalomName) {
             return <MaterialCommunityIcons name="home-group-plus" size={24} color={color} />;

            }else if (rn === eventsName) {
              iconName = focused ? 'today' : 'today-outline';

            } else if (rn === churchName) {
              return <FontAwesome5 name="church" size={24} color={color} />;
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'grey',
          tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
          tabBarStyle: [
            {
              "display": "flex"
            },
            null
          ],
        }}>

        <BottomTab.Screen name={homeName} component={HomeScreen} options={{ headerTitle: (props) => <LogoTitle />, headerTitleAlign: 'left'}}/>
        <BottomTab.Screen name={shalomName} component={ShalomScreen} options={{ headerTitle: (props) => <LogoTitle />, headerTitleAlign: 'left'}}/>
        <BottomTab.Screen name={eventsName} component={EventsScreen} options={{ headerTitle: (props) => <LogoTitle />, headerTitleAlign: 'left'}}/>
        <BottomTab.Screen name={churchName} component={ChurchScreen} options={{ headerTitle: (props) => <LogoTitle />, headerTitleAlign: 'left'}}/>

      </BottomTab.Navigator>
    </NavigationContainer>
  );
}
 

