import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Screens
import HomeScreen from '../components/HomeScreen';
import ShalomScreen from '../components/Shalom';
import EventsScreen from '../components/event/Events';
import GoLiveScreen from '../components/GoLive';
import ChurchScreen from '../components/church/Church';

//import Ionicons from 'react-native-vector-icons/Ionicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 
import RichTxtEditor from '../components/common/RichTxtEditor';
import Comment from '../components/common/Comment';
import SavePost from '../components/common/SavePost';
import RegisterChurch from '../components/church/RegisterChurch';
import AddEvent from '../components/event/AddEvent';
import Profile from '../components/user-signinup/Profile';
import BackHistory from '../components/common/BackHistory';
import FollowUser from '../components/user-signinup/FollowUser';

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
        name="Comment"
        component={Comment}
        options={{
          headerLeft: (props) => (
            <BackHistory name="Home"></BackHistory>
           ),
          headerRight: (props) => (
           <SavePost name="comment"></SavePost>
          ),
        }}
      />
       <Stack.Screen
          name="Follow-user"
          component={FollowUser}
          options={{
            headerLeft: (props) => (
              <BackHistory name="Home"></BackHistory>
             ),

          }}
        />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
         
        }}
      />
    </Stack.Navigator>
  );
};

const ShalomStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Shalom"
        component={ShalomScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Post"
        component={RichTxtEditor}
        options={{
          headerRight: (props) => (
           <SavePost name="shalom"></SavePost>
          ),
          headerLeft: (props) => (
            <BackHistory name="Shalom"></BackHistory>
           ),
        }}
      />
    </Stack.Navigator>
  );
};

const EventsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Event"
        component={EventsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Add-event"
        component={AddEvent}
        options={{
          headerLeft: (props) => (
            <BackHistory name="Event"></BackHistory>
           ),
        }}
      />
    </Stack.Navigator>
  );
};

const ChurchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Church"
        component={ChurchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register-church"
        component={RegisterChurch}
        options={{
          headerLeft: (props) => (
            <BackHistory name="Church"></BackHistory>
           ),
        }}
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
        name="HomeStack"
        component={HomeStack}
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
        name="Shaloms"
        component={ShalomStack}
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
        component={EventsStack}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="event" color={color} size={size} />
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
        name="ChurchList"
        component={ChurchStack}
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
