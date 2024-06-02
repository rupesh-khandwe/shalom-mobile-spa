import React, { useState} from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { createMeeting, authToken } from "../../api/api";

// Responsible for either schedule new meeting or to join existing meeting as a host or as a viewer.
function JoinScreen({ getMeetingAndToken, setMode }) {
    const [meetingVal, setMeetingVal] = useState("");
    const [meetingId, setMeetingId] = useState(null);
  
    const JoinButton = ({ value, onPress }) => {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: "purple",
            padding: 12,
            marginVertical: 8,
            borderRadius: 6,
          }}
          onPress={onPress}
        >
          <Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>
            {value}
          </Text>
        </TouchableOpacity>
      );
    };

    //Getting MeetingId from the API we created earlier
    const getMeeting = async (id) => {
      const meetingId =
        id == null ? await createMeeting({ token: authToken }) : id;
        setMeetingId(meetingId);
    };
    
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          paddingHorizontal: 6 * 10,
        }}
      >
        <TextInput
          value={meetingVal}
          onChangeText={setMeetingVal}
          placeholder={"XXXX-XXXX-XXXX"}
          placeholderTextColor={"grey"}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 6,
            color: "white",
            marginBottom: 16,
          }}
        />
        <JoinButton
          onPress={() => {
            getMeetingAndToken(meetingVal);
          }}
          value={"Join as Host"}
        />
        <JoinButton
          onPress={() => {
            setMode("VIEWER");
            getMeetingAndToken(meetingVal);
          }}
          value={"Join as Viewer"}
        />
        <Text
          style={{
            alignSelf: "center",
            fontSize: 22,
            marginVertical: 16,
            fontStyle: "italic",
            color: "grey",
          }}
        >
          ---------- OR ----------
        </Text>
  
        <JoinButton
          onPress={() => {
            getMeetingAndToken();
          }}
          value={"Create Studio Room"}
        />
      </SafeAreaView>
    );
  }

  export default JoinScreen;