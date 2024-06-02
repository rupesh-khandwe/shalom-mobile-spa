import React, { useRef, useEffect,  } from "react";
import {
  Text,
  View,
} from "react-native";
import {
  useMeeting, 
  Constants,
} from "@videosdk.live/react-native-sdk";
import CustomTopNavButton from "../common/CustomTopNavButton";
import Button from "./Button";
import SpeakerView from "./SpeakerView";
import { useNavigation } from "@react-navigation/native";

function Container(){
    const navigation = useNavigation();
    const {join, changeWebcam, localParticipant, leave} = useMeeting({
      onError: error => {
        console.log(error.message);
      }
    });
  
    const mMeeting = useMeeting({
      onMeetingJoined: () => {
        // We will pin the local participant if he joins in CONFERENCE mode
        if (mMeetingRef.current.localParticipant.mode == "CONFERENCE") {
          mMeetingRef.current.localParticipant.pin();
        }
      }
    });
  
    // We will create a ref to meeting object so that when used inside the
    // Callback functions, meeting state is maintained
    const mMeetingRef = useRef(mMeeting);
    useEffect(() => {
      mMeetingRef.current = mMeeting;
    }, [mMeeting]);
  
    return (
      <View style={{ flex: 1 }}>
        <CustomTopNavButton 
          label={null} 
          onPress={ () => {
            console.log(navigation.getParent())
            navigation.navigate('Join-Room');
            //navigation.goBack();
          }} 
        />
        {localParticipant?.mode == Constants.modes.CONFERENCE ? (
          <SpeakerView />
        ) : localParticipant?.mode == Constants.modes.VIEWER ? (
          <ViewerView />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black",
            }}
          >
            <Text style={{ fontSize: 20, color: "white" }}>
              Press Join button to enter studio.
            </Text>
            <Button
              btnStyle={{
                marginTop: 8,
                paddingHorizontal: 22,
                padding: 12,
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 8,
              }}
              buttonText={"Join"}
              onPress={() => {
                join();
              }}
            />
          </View>
        )}
      </View>
    );
  }

export default Container;