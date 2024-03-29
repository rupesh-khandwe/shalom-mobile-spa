import React, { useState, useMemo, useRef, useEffect, useContext } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  FlatList,
  Clipboard,
} from "react-native";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  MediaStream,
  RTCView,
  Constants,
} from "@videosdk.live/react-native-sdk";
import { createMeeting, authToken } from "../api/api";
import Video from "react-native-video";
import Share from 'react-native-share';
import { AuthContext } from '../context/AuthContext';

// Responsible for either schedule new meeting or to join existing meeting as a host or as a viewer.
function JoinScreen({ getMeetingAndToken, setMode }) {
  const [meetingVal, setMeetingVal] = useState("");

  const JoinButton = ({ value, onPress }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#1178F8",
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

const onShare = async (meetingId) => {
  try {
    const result = await Share.open({
      message:
        'Please join shalom conference now: '+meetingId 
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    console.log(error.message);
  }
}

// Responsible for managing meeting controls such as toggle mic / webcam and leave
function Controls() {
  const { toggleWebcam, toggleMic, startHls, stopHls, hlsState, unmuteMic, muteMic, toggleScreenShare  } = useMeeting(
    {}
  );

  const _handleHLS = async () => {
    if (!hlsState || hlsState === "HLS_STOPPED") {
      startHls({
        layout: {
          type: "SPOTLIGHT",
          priority: "PIN",
          gridSize: 4,
        },
        theme: "DARK",
        orientation: "portrait",
      });
    } else if (hlsState === "HLS_STARTED" || hlsState === "HLS_PLAYABLE") {
      stopHls();
    }
  };

  const handleToggleMic = () => {
    // Toggling Mic
    localMicOn=false
    muteMic();
    toggleMic(); 
  };

  const shareScreen = () => {
    // Toggling Mic
    toggleScreenShare(); 
  };


  return (
    <View
      style={{
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Button
        onPress={() => {
          toggleWebcam();
        }}
        buttonText={"Toggle Webcam"}
        backgroundColor={"#1178F8"}
      />
      <Button
        onPress={() => {
          handleToggleMic();
        }}
        buttonText={"Toggle Mic"}
        backgroundColor={"#1178F8"}
      />
       <Button
        onPress={() => {
          shareScreen();
        }}
        buttonText={"Share"}
        backgroundColor={"#1178F8"}
      />
      
      {hlsState === "HLS_STARTED" ||
      hlsState === "HLS_STOPPING" ||
      hlsState === "HLS_STARTING" ||
      hlsState === "HLS_PLAYABLE" ? (
        <Button
          onPress={() => {
            _handleHLS();
          }}
          buttonText={
            hlsState === "HLS_STARTED"
              ? `Live Starting`
              : hlsState === "HLS_STOPPING"
              ? `Live Stopping`
              : hlsState === "HLS_PLAYABLE"
              ? `Stop Live`
              : `Loading...`
          }
          backgroundColor={"#FF5D5D"}
        />
      ) : (
        <Button
          onPress={() => {
            _handleHLS();
          }}
          buttonText={`Go Live`}
          backgroundColor={"#1178F8"}
        />
      )}
    </View>
  );
}

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

function HeaderView() {
  const { meetingId, leave, localMicOn,unmuteMic, muteMic} = useMeeting();

  const handleUnmuteMic = () => {
    // Unmuting Mic
    unmuteMic();
  };

  const handleMuteMic = () => {
    // Muting Mic
    muteMic();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        padding: 16,
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      {/* <Text style={{ fontSize: 24, color: "white" }}>{meetingId}</Text> */}
      <Button
        btnStyle={{
          borderWidth: 1,
          borderColor: "white",
        }}
        onPress={() => {
          Clipboard.setString(meetingId);
          onShare(meetingId);
          //alert("MeetingId copied successfully");
        }}
        buttonText={"Share MeetingId"}
        backgroundColor={"transparent"}
      />
      <Text style={{ color: "white", fontSize: 12 }}>Mic : {localMicOn}</Text>
      {/* <Button
        onPress={() => {
          handleMuteMic();
        }}
        buttonText={"Mute Mic"}
        backgroundColor={"#1178F8"}
      /> */}
      <Button
        onPress={() => {
          handleUnmuteMic();
        }}
        buttonText={"Unmute Mic"}
        backgroundColor={"#1178F8"}
      />
      <Button
        onPress={() => {
          leave();
        }}
        buttonText={"Leave"}
        backgroundColor={"#FF0000"}
      />
    </View>
  );
}

function Container(){

  const {join, changeWebcam, localParticipant} = useMeeting({
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

// Responsible for Viewer side view, which contains video player for streaming HLS and managing HLS state (HLS_STARTED, HLS_STOPPING, HLS_STARTING, etc.)
function ViewerView({}) {
  const { hlsState, hlsUrls } = useMeeting();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      {hlsState == "HLS_PLAYABLE" ? (
        <>
          {/* Render Header for copy meetingId and leave meeting*/}
          <HeaderView />

          {/* Render VideoPlayer that will play `downstreamUrl`*/}
          <Video
            controls={true}
            source={{
              uri: hlsUrls.downstreamUrl,
            }}
            resizeMode={"stretch"}
            style={{
              flex: 1,
              backgroundColor: "black",
            }}
            onError={(e) => console.log("error", e)}
          />
        </>
      ) : (
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, color: "white" }}>
            HLS is not started yet or is stopped
          </Text>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}

// Common Component which will also be used in Controls Component
const Button = ({ onPress, buttonText, backgroundColor, btnStyle }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...btnStyle,
        backgroundColor: backgroundColor,
        padding: 10,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: "white", fontSize: 12 }}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

function GoLive() {
  const [meetingId, setMeetingId] = useState(null);
  const {userInfo}= useContext(AuthContext);
  //State to handle the mode of the participant i.e. CONFERNCE or VIEWER
  const [mode, setMode] = useState("CONFERENCE");

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