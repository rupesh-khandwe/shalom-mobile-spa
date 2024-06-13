import React from "react";
import {
    View,
    Text
} from "react-native";
import {
    useParticipant,
    MediaStream,
    RTCView,
  } from "@videosdk.live/react-native-sdk";

// Responsible for managing participant video stream
function ParticipantView({ participantId }) {
    const { webcamStream, webcamOn } = useParticipant(participantId);
    return webcamOn && webcamStream ? (
      <RTCView
        streamURL={new MediaStream([webcamStream.track]).toURL()}
        objectFit={"cover"}
        style={{
          height: 300,
          marginVertical: 8,
          marginHorizontal: 8,
        }}
      />
    ) : (
      <View
        style={{
          backgroundColor: "grey",
          height: 300,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 8,
          marginHorizontal: 8,
        }}
      >
        <Text style={{ fontSize: 16 }}>NO MEDIA</Text>
      </View>
    );
  }
  export default ParticipantView;