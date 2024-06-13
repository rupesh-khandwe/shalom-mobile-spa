
import React, {useState, useRef} from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import {
  useMeeting,
  getAudioDeviceList,
  switchAudioDevice,
  Constants,
} from "@videosdk.live/react-native-sdk";
import Button from "./Button";
import MicOn from "../../assets/icons/MicOn";
import MicOff from "../../assets/icons/MicOff";
import VideoOn from "../../assets/icons/VideoOn";
import VideoOff from "../../assets/icons/VideoOff";
import ScreenShare from "../../assets/icons/ScreenShare";
import colors from "../../constants/colors";
import { ROBOTO_FONTS } from "../../constants/fonts";
import { convertRFValue } from "../../constants/spacing";
import MenuItem from "./MenuItem";
import IconContainer from "./IconContainer";
import Menu from "./Menu";


// Responsible for managing meeting controls such as toggle mic / webcam and leave
function Controls() {
    const { toggleWebcam, toggleMic, startHls, stopHls, hlsState, localMicOn, muteMic, toggleScreenShare, disableScreenShare, presenterId,
      localScreenShareOn, localWebcamOn } = useMeeting(
      {}
    );
    const [micOn, setMicon] = useState(true);
    const [videoOn, setVideoOn] = useState(true);
    const moreOptionsMenu = useRef();
    const audioDeviceMenuRef = useRef();
    const [audioDevice, setAudioDevice] = useState([]);
  
 /*    const _handleHLS = async () => {
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
    }; */
  
    const handleToggleMic = () => {
      // Toggling Mic
     /*  localMicOn=false
      muteMic(); */
      toggleMic(); 
    };
  
    const shareScreen = () => {
      // Toggling Mic
      toggleScreenShare(); 
    };

    async function updateAudioDeviceList() {
      const devices = await getAudioDeviceList();
      setAudioDevice(devices);
    }
  
  
    return (
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
            style={{
              flexDirection: "row",
              backgroundColor: "transparent",
              justifyContent: "space-evenly",
              position: "absolute",
              bottom: 10,
              right: 0,
              left: 0,
            }}
          >
            {/* <TouchableOpacity
              onPress={() => {
                setMicon(!micOn);
              }}
              style={{
                height: 50,
                aspectRatio: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                borderRadius: 100,
                backgroundColor: micOn ? colors.primary["100"] : "red",
              }}
            >
              {micOn ? (
                <MicOn width={25} height={25} fill={colors.black} />
              ) : (
                <MicOff
                  width={25}
                  height={25}
                  fill={colors.primary["100"]}
                />
              )}
            </TouchableOpacity> */}
      <Menu
        ref={audioDeviceMenuRef}
        menuBackgroundColor={colors.primary[700]}
        placement="left"
        left={70}
      >
        {audioDevice.map((device, index) => {
          return (
            <>
              <MenuItem
                title={
                  device == "SPEAKER_PHONE"
                    ? "Speaker"
                    : device == "EARPIECE"
                    ? "Earpiece"
                    : device == "BLUETOOTH"
                    ? "Bluetooth"
                    : "Wired Headset"
                }
                onPress={() => {
                  switchAudioDevice(device);
                  audioDeviceMenuRef.current.close();
                }}
              />

              {index != audioDevice.length - 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.primary["600"],
                  }}
                />
              )}
            </>
          );
        })}
      </Menu>
        <IconContainer
          style={{
            paddingLeft: 0,
            height: 52,
          }}
          isDropDown={true}
          onDropDownPress={async () => {
            await updateAudioDeviceList();
            audioDeviceMenuRef.current.show();
          }}
          backgroundColor={!localMicOn ? colors.primary[100] : "transparent"}
          onPress={() => {
            toggleMic();
          }}
          Icon={() => {
            return localMicOn ? (
              <MicOn height={24} width={24} fill="#FFF" />
            ) : (
              <MicOff height={28} width={28} fill="#1D2939" />
            );
          }}
        />
           {/*  <TouchableOpacity
              onPress={() => {
                setVideoOn(!videoOn);
              }}
              style={{
                height: 50,
                aspectRatio: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                borderRadius: 100,
                backgroundColor: videoOn ? colors.primary["100"] : "red",
              }}
            >
              {videoOn ? (
                <VideoOn width={25} height={25} fill={colors.black} />
              ) : (
                <VideoOff
                  width={35}
                  height={35}
                  fill={colors.primary["100"]}
                />
              )}
            </TouchableOpacity> */}

        <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: "#2B3034",
          }}
          backgroundColor={!localWebcamOn ? colors.primary[100] : "transparent"}
          onPress={() => {
            toggleWebcam();
          }}
          Icon={() => {
            return localWebcamOn ? (
              <VideoOn height={24} width={24} fill="#FFF" />
            ) : (
              <VideoOff height={36} width={36} fill="#1D2939" />
            );
          }}
        />

          {(presenterId == null || localScreenShareOn) && (
            <MenuItem
              title={`${localScreenShareOn ? "Stop" : "Start"} Screen Share`}
              icon={<ScreenShare width={22} height={22} />}
              onPress={() => {
                //moreOptionsMenu.current.close();
                if (presenterId == null || localScreenShareOn)
                  Platform.OS === "android"
                    ? toggleScreenShare()
                    : VideosdkRPK.startBroadcast();
              }}
            />
          )}
      </View>

      
        {/* <ScreenShare width={40} height={40} fill={"#FFF"} />
        <Text
          style={{
            fontFamily: ROBOTO_FONTS.Roboto,
            fontSize: convertRFValue(14),
            color: colors.primary[100],
            marginVertical: 12,
          }}
        >
          You are presenting to everyone
        </Text>
        <TouchableOpacity
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            alignItems: "center",
            backgroundColor: "#5568FE",
            borderRadius: 12,
            marginVertical: 12,
          }}
          onPress={() => {
            disableScreenShare();
          }}
        >
          <Text
            style={{
              color: colors.primary["100"],
              fontSize: 16,
              fontFamily: ROBOTO_FONTS.RobotoBold,
            }}
          >
            Stop Presenting
          </Text>
        </TouchableOpacity> */}
       
        
    
       
        <View
        style={{
          alignItems: "center",
        }}
      >
      {/*   {hlsState === "HLS_STARTED" ||
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
        )} */}
</View>
      </View>
    );
  }

export default Controls;