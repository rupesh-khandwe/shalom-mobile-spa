import React, {useEffect} from 'react';
import {Linking} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Screens
import HomeScreen from '../components/HomeScreen';
import ShalomScreen from '../components/Shalom';
import EventsScreen from '../components/event/Events';
import GoLive from '../components/live/GoLive';
import JoinScreen from '../components/live/JoinScreen';
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
import EventDetails from '../components/event/EventDetails';
import BackHistory from '../components/common/BackHistory';
import FollowUser from '../components/user-signinup/FollowUser';
import ChurchDetails from '../components/church/ChurchDetails';
import DonateScreen from '../components/DonateScreen';

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
          headerLeft: (props) => (
                       <BackHistory name="Home"></BackHistory>
                      ),
        }}
      />
      <Stack.Screen
        name="Join-Room"
        component={JoinScreen}
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

const DonationStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Donate"
        component={DonateScreen}
        options={{headerShown: false}}
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
      <Stack.Screen
        name="Event-details"
        component={EventDetails}
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
      <Stack.Screen
        name="Church-details"
        component={ChurchDetails}
        options={{
          headerLeft: (props) => (
            <BackHistory name="Church"></BackHistory>
           ),
        }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = ({}) => {
  const navigation = useNavigation();
  useEffect(() => {
    const handleDeepLink = ({ url }) => {
        const route = url.replace(/.*?:\/\//g, '');
        const routeName = route.split('/')[0];
        if (routeName === 'golive') {
          const id = route.split('/')[1];    
          navigation.navigate('GoLive', { id });
        }
    }
    Linking.addEventListener('url', handleDeepLink);
    return () => {
      console.log("removeAllListeners...");
      Linking.removeAllListeners(handleDeepLink)
    };
  }, []);

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
          //tabBarBadge: 3,
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
      {/* <Tab.Screen
        name="GoLive"
        component={GoLive}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="donate" size={24} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Donation"
        component={DonationStack}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="donate" size={24} color={color} />
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
