import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import LogoTitle from '../components/common/logo';

// Screens
import HomeScreen from '../components/HomeScreen';
import ShalomScreen from '../components/Shalom';
import EventsScreen from '../components/Events';
import GoLiveScreen from '../components/GoLive';
import ChurchScreen from '../components/Church';
import BibleScreen from '../components/bible/Bible';
import FetchAll from '../components//bible/FetchAll';
import ChaptersScreen from '../components/bible/Chapters';
import VerseScreen from '../components/bible/Verse';
import VerseCountScreen from '../components/bible/VerseCount'

//Screen names
const homeName = "Home";
const shalomName = "Shalom";
const eventsName = "Events";
const goLiveName = "GoLive";
const churchName = "Church";
const bibleName = "Bible";
const chaptersName = "Chapters";
const sectionsName = "Sections";
const verseName = "Verse";
const verseCountName = "VerseCount";

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function TabNavigator() {

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

            } else if (rn === goLiveName) {
              iconName = focused ? 'videocam' : 'videocam-outline';

            } else if (rn === churchName) {
              return <FontAwesome5 name="church" size={24} color={color} />;
            } else if(rn === bibleName){
              return <FontAwesome5 name="bible" size={24} color={color} />
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
        <BottomTab.Screen name={goLiveName} component={GoLiveScreen} options={{ headerTitle: (props) => <LogoTitle />, headerTitleAlign: 'left'}}/>
        <BottomTab.Screen name={churchName} component={ChurchScreen} options={{ headerTitle: (props) => <LogoTitle />, headerTitleAlign: 'left'}}/>
        <BottomTab.Screen name={bibleName} component={StackNavigator} options={{ headerTitle: (props) => <LogoTitle />, headerTitleAlign: 'left'}}/>
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}
 
function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Fetch All" >
        {(props) => <FetchAll {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Bible" component={BibleScreen}></Stack.Screen>
      <Stack.Screen name={chaptersName} component={ChaptersScreen}></Stack.Screen>
      <Stack.Screen name={verseCountName} component={VerseCountScreen}></Stack.Screen> 
      <Stack.Screen name={verseName} component={VerseScreen}></Stack.Screen>
    </Stack.Navigator>
  )
}

