import React, { useMemo } from "react";
import {
    SafeAreaView,
    FlatList
} from "react-native";
import {
  useMeeting, 
  Constants,
} from "@videosdk.live/react-native-sdk";
import Controls from "./Controls";
import HeaderView from "./HeaderView";
import ParticipantView from "./ParticipantView";

// Responsible for Speaker side view, which contains Meeting Controls(toggle mic/webcam & leave) and Participant list
function SpeakerView() {
    // Get the Participant Map and meetingId
    const { meetingId, participants } = useMeeting({});
  
    // For getting speaker participant, we will filter out `CONFERENCE` mode participant
    const speakers = useMemo(() => {
      const speakerParticipants = [...participants.values()].filter(
        (participant) => {
          return participant.mode == Constants.modes.CONFERENCE;
        }
      );
      return speakerParticipants;
    }, [participants]);
  
    return (
      <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
        {/* Render Header for copy meetingId and leave meeting*/}
        <HeaderView />
  
        {/* Render Participant List */}
        {speakers.length > 0 ? (
          <FlatList
            data={speakers}
            renderItem={({ item }) => {
              return <ParticipantView participantId={item.id} />;
            }}
          />
        ) : null}
  
        {/* Render Controls */}
        <Controls />
      </SafeAreaView>
    );
  }

export default SpeakerView;