import React, { useState, useContext, useEffect } from "react";
import {
  Linking
} from "react-native";
import {
  MeetingProvider,
} from "@videosdk.live/react-native-sdk";
import { createMeeting, authToken } from "../../api/api";
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect,useIsFocused, useNavigation } from "@react-navigation/native";
import Container from "./Container";
import JoinScreen from "./JoinScreen";

function GoLive({route}) {
  const [meetingId, setMeetingId] = useState(null);
  const {userInfo}= useContext(AuthContext);
  //const navigation = useNavigation();
  //State to handle the mode of the participant i.e. CONFERNCE or VIEWER
  const [mode, setMode] = useState("CONFERENCE");
  const isFocused = useIsFocused();
  /* const unsubscribe = navigation.addListener('didFocus', () => {
    console.log('focussed');
}); */

  useFocusEffect(
    React.useCallback(() => {
      /* alert("route params", route.params)
      if(route.params && route.params.id){
        alert(route.params.id)
        setMeetingId(route.params.id);
      } else { */
        const handleDeepLink = ({ url }) => {
          console.log("GoLive url: ",url)
            const route = url.replace(/.*?:\/\//g, '');
          
            console.log("route: ",route)
    
            const routeName = route.split('/')[0];
            console.log("routeName: ",routeName)
    
            if (routeName === 'golive') {
              const id = route.split('/')[1];
              console.log("id: ",id)
              setMeetingId(id);
            }
        }
        Linking.addEventListener('url', handleDeepLink);
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions.
        Linking.removeAllListeners(handleDeepLink)
      }
    }, [])
  );

  useEffect(()=>{
    if(route.params && route.params.id){
      setMeetingId(route.params.id);
    }
  }, []);

    //Getting MeetingId from the API we created earlier
    const getMeetingAndToken = async (id) => {
      const meetingId =
        id == null ? await createMeeting({ token: authToken }) : id;
      setMeetingId(meetingId);
    };
  

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: userInfo.userName,
        //These will be the mode of the participant CONFERENCE or VIEWER
        mode: mode,
      }}
      token={authToken}
    >
      <Container />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} setMode={setMode} />
  );
}

export default GoLive;