import React from "react";
import {
  Text,
  View,
  Clipboard,
  TouchableOpacity
} from "react-native";
import {
  useMeeting,
} from "@videosdk.live/react-native-sdk";
import Button from "./Button";
import Share from 'react-native-share';
import CameraSwitch from "../../assets/icons/CameraSwitch";
import colors from "../../constants/colors";

function HeaderView() {
    const { meetingId, leave, localMicOn,unmuteMic, muteMic, startHls, stopHls, hlsState, changeWebcam} = useMeeting();
  
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

    const handleUnmuteMic = () => {
      // Unmuting Mic
      unmuteMic();
    };
  
    const handleMuteMic = () => {
      // Muting Mic
      muteMic();
    };

    const onShare = async (meetingId) => {
        try {
          const result = await Share.open({
              message: 'Please join shalom conference now:', 
              url: `https://shalomgolive/golive/${meetingId}&hl=en`
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
        
        <Button
          onPress={() => {
            leave();
          }}
          buttonText={"Leave"}
          backgroundColor={"#FF0000"}
        />
        <View>
          <TouchableOpacity
            onPress={() => {
              changeWebcam();
            }}
          >
            <CameraSwitch height={26} width={26} fill={colors.primary[100]} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

export default HeaderView;