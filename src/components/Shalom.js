import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, Image, Button, TouchableOpacity, Dimensions, Animated, Alert  } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import axios from 'axios';
import { SIZES, COLORS } from "../constants"; 
import { FONTS } from "../constants/theme";
import { Card, Title } from 'react-native-paper'
import { MaterialCommunityIcons, FontAwesome, MaterialIcons } from '@expo/vector-icons'; 
import { Video, ResizeMode } from 'expo-av';
import { AuthContext } from '../context/AuthContext';
import {REACT_APP_BASE_URL_API} from '@env'
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import moment from "moment";
import { ActivityIndicator } from 'react-native-paper';

export default function Shalom({ navigation }) {
    const {userToken, userInfo}= useContext(AuthContext);
    
    const SEARCH_BY_KEY = "eventByUserId?key=";
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    var width = Dimensions.get("window");
    const scale = new Animated.Value(1);
    const [loader, setLoader] = useState(true);

    const onZoomEventFunction = Animated.event(
      [{
        nativeEvent: {scale : scale}
      }],
      {
        useNativeDriver: true
      }
    )
    const onZoomStateChangeFunction=(event) =>{
      if(event.nativeEvent.oldState == State.ACTIVE){
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true
        }).start()
      }
    }


    useEffect(() => {
        axios
        .get(`${REACT_APP_BASE_URL_API}/shalom/user?id=${userInfo.userId}`, {
          headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
          //console.log(res.data)
            setLoader(false);
            setFilteredDataSource(res.data);
            setMasterDataSource(res.data);
        })
        .catch((err) => console.log(err));
      }, []);

      const searchFilterFunction = (text) => {
        // Check if searched text is not blank 
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource
          // Update FilteredDataSource
          const newData = masterDataSource.filter(function (item) {
            const itemData = item.shalom;
            const textData = text;
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setFilteredDataSource(masterDataSource);
          setSearch(text);
        }
      };
    

    const ItemView = ({ item }) => {
        return (
        // Flat List Item
        <Card style={{margin:6, borderColor:'purple', borderRadius:10, borderBottomWidth:3}}
        >
          <View style={{flexDirection:'row', flex:1}} key={item.shalomId}>
                {/*  Text */}
                <View style={{ marginTop:5, }}><TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <FontAwesome name="user-circle" size={40} color="gray"  onPress={()=>{
                  navigation.push('Profile',{
                    "extUserId": item.userId,
                    "extUserName": item.userName
                  })
                }  }   />
                  </TouchableOpacity></View>
                <View style={{ marginLeft:5, }}>
                  <Title>{item.userName}</Title>
                  <Text style={{...FONTS.body5}}>Posted on {moment(item.createdOn).format("MMMM D")}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{textAlign: 'right'}} onPress={()=>{deleteDialog(item.shalomId)}}><MaterialIcons name="delete-forever" size={24} color="gray" /></Text>
                </View>
            </View>
            <View style={{flexDirection:'row',}}>
                {/*  Text */}
                <View style={{justifyContent:'space-around', flex:2/3, margin:10}}>
                    <Title>{item.shalom}</Title>
                </View>
            </View>
            {item.videoUrl && 
                <View style={styles.container}>
                    <Video
                        ref={video}
                        style={styles.video}
                        source={{
                        uri: item.videoUrl,
                        }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                        onPlayb ackStatusUpdate={status => setStatus(() => status)}
                    />
                    <View style={styles.buttons}>
                        <Button title="Play" onPress={() => video.current.playFromPositionAsync(10)} />
                        {/* <Button title={status.isLooping ? "Set to not loop" : "Set to loop"} onPress={() => video.current.setIsLoopingAsync(!status.isLooping)} /> */}
                    </View>
                </View>
            }
            {item.imageUrl &&
              item.imageUrl.split('|').map((img) => {
                return(  
                  <PinchGestureHandler
                    onGestureEvent={onZoomEventFunction}
                    onHandlerStateChange={onZoomStateChangeFunction}
                    key={item.shalomId}
                  >
                    <Animated.Image
                      style={{width: {width}, height: 200,resizeMode : 'stretch', transform: [{scale: scale}] }}
                      source={{uri:img}} 
                      resizeMode={'contain'}
                    /> 
                </PinchGestureHandler>
                )
              })
            }
        </Card>
        ); 
    };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  //render the empty list component in case the data array for the FlatList is empty
 const renderListEmptyComponent = () => (
      <View style={styles.emptyListContainer}>
          <Text style={styles.noShalomsFound}>
              No Availabe Shalom's Yet!
          </Text>
        <Text style={styles.noShalomsFound}>
            Please click on add shalom icon <MaterialCommunityIcons name="home-group-plus" size={35} color="purple"   /> above to post a new shalom.
        </Text>
      </View>
  );

  const deleteDialog = (shalomId) =>{
    Alert.alert('Delete shalom?', 'Please confirm if you wish to proceed.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteEvent(shalomId)},
    ],
    {
      cancelable: true,
    },
    );
  };

  const deleteEvent = (shalomId) => {
    axios
    .delete(`${REACT_APP_BASE_URL_API}/shalom/delete`, {
        params: { id: shalomId, userId: userInfo.userId  },
        headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
    })
    .then((res) => {
        setFilteredDataSource(res.data);
    })
    .catch((err) => console.log(err)); 
  }


    return (
        <SafeAreaView style={{  flex: 1, backgroundColor: '#fff'  }}>
          <ScrollView style={{padding: 20}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Text style={{fontSize: 18, fontFamily: 'Roboto-Medium', fontWeight: 'bold'}}>
                Shalom's
              </Text>
              <TouchableOpacity onPress={() => navigation.replace('Post')}>
              <MaterialCommunityIcons name="home-group-plus" size={35} color="purple"   />
              {/* <ImageBackground
                source={require('../assets/images/user-profile.jpg')}
                style={{width: 35, height: 35}}
                imageStyle={{borderRadius: 25}}
              /> */}
            </TouchableOpacity>
            </View>
            <View style={styles.container}>
             {loader && <ActivityIndicator animating={loader} color='purple' size='large' style={styles.spinnerStyle}/>}
              <FlatList
                data={filteredDataSource}
                keyExtractor={(item, index) => item.shalomId}
                ListEmptyComponent={renderListEmptyComponent}
                ItemSeparatorComponent={ItemSeparatorView}
                renderItem={ItemView}
              />

            </View>
        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      marginTop: SIZES.medium,
      gap: SIZES.small,
      borderRadius: SIZES.medium,

    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: SIZES.large,
      color: COLORS.primary,
    },
    itemStyle: {
      padding: 10,
      fontSize: SIZES.large,
      color: COLORS.primary,
    },
    comment: {
        flexDirection: 'row',
    },
    icon1: {
        flexDirection: 'row',
        alignItems: 'left'
    },
    icon2: {
        flexDirection: 'row',
        alignContent: 'center'
    },
    icon3: {
        flexDirection: 'row',
        textAlign: 'right',
        justifyContent: 'right',
    },
    video: {
        flex: 1,
        alignSelf: 'center',
        width: 320,
        height: 200,
      },
      buttons: {

        margin: 16
      },
    searchBar: {
      flexDirection: 'row',
      borderColor: '#C6C6C6',
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginRight: 5
    },
    emptyListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    noShalomsFound: {
        fontSize: 16,
        paddingVertical: 8,
    },
    spinnerStyle: {
      flex: 1,
      marginTop:200,
      justifyContent: 'center',
      alignItems:'center'
    }
  });
