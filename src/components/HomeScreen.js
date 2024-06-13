import React, { useState, useEffect, useContext, useRef } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList,TouchableOpacity, ImageBackground, RefreshControl, Dimensions, Animated, Image} from 'react-native';
import { ScrollView } from 'react-native-virtualized-view'
import Share from 'react-native-share';
import axios from 'axios';
import { SIZES, COLORS } from "../constants"; 
import { FONTS } from "../constants/theme";
import { Card, Title } from 'react-native-paper'
import { FontAwesome, AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { AuthContext } from '../context/AuthContext';
import { REACT_APP_BASE_URL_API } from '@env'
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import useAxios from './common/useAxios';
import moment from "moment";
import { shalom } from '../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
    const {userToken, userInfo, userId, userName}= useContext(AuthContext);
    const SEARCH_BY_KEY = "eventByUserId?key=";
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [likeFlag, setLikeFlag] = React.useState(true);
    const [localUserId, setLocalUserId]= useState('');
    const [localUserName, setLocalUserName]= useState('');
    const [refreshing, setRefreshing] = React.useState(false);
    var width = Dimensions.get("window");
    const scale = new Animated.Value(1);
    let api = useAxios()

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        axios
        .get(`${REACT_APP_BASE_URL_API}/shalom/shalomsWithLikeComment?userId=${localUserId}`, {
          headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            //console.log(res.data)
            setFilteredDataSource(res.data);
        })
        .catch((err) => console.log(err));
        setRefreshing(false);
      }, 2000);
    }, []);


    const likeFlow = (shalomId, slikeFlag) => {
        axios
        .put(`${REACT_APP_BASE_URL_API}/shalom/saveLike`, null, {
            params: { userId: localUserId, shalomId: shalomId, likeFlag: slikeFlag },
            headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            //console.log(res.data);
            setFilteredDataSource(res.data);
        })
        .catch((err) => console.log(err)); 
    };

   const getAsyncData = async()=>{
        try {
            console.log("Home screen getAsyncData***")
            const userId = await AsyncStorage.getItem('userId');
            const userName = await AsyncStorage.getItem('userName');
            setLocalUserId(userId);
            setLocalUserName(userName);
            axios
            .get(`${REACT_APP_BASE_URL_API}/shalom/shalomsWithLikeComment?userId=${userId}`, {
              headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
            })
            .then((res) => {
                //console.log(res.data);
                setFilteredDataSource(res.data);
            })
            .catch((err) => console.log(err));
            console.log("Home screen getAsyncData user Id***",userId)
            console.log("Home screen getAsyncData user Name***",userName)
        } catch (error) {
            console.log(`isLogged in error ${error}`);
        }
     }

const onShare = async () => {
    try {
      const result = await Share.open({
        message:
          'Share your favorite shaloms to the world',
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
      alert(error.message);
    }
  }

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

  let getData = async(userInfo) =>{
    let response = await api.get(`/shalom/shalomsWithLikeComment?userId=${localUserId}`)

    if(response.status === 200){
      console.log("Home Screen getData=",response.data)
        setNotes(response.data)
    }
    
}
  
    useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    // The screen is focused
    // Call any action
    console.log("Profile screen focused")
      width = Dimensions.get("window");
      console.log("Home Screen userToken=",userToken)
      console.log("Home Screen userId=",userId)
      console.log("Home Screen userName=",userName)

      //userInfo && getData(userInfo);
       // getCredentials();
       getAsyncData();

        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      }, [navigation]);

    const ItemView = ({ item }) => {
        return (
        <Card style={{marginTop:10, borderColor:'purple', borderRadius:10, borderBottomWidth:3}}>
          <View style={{flexDirection:'row', flex:1}}>
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
            </View>
            <View style={{margin:10}}>
              <Text>{item.shalom}</Text>
                {/* <Text>Shalom posted on : {item.createdOn}</Text> */}
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
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                    {/* <View style={styles.buttons}>
                        <Button title="Play" onPress={() => video.current.playFromPositionAsync(10)} />
                        {/* <Button title={status.isLooping ? "Set to not loop" : "Set to loop"} onPress={() => video.current.setIsLoopingAsync(!status.isLooping)} /> 
                    </View> */}
                </View>
            }
            {item.imageUrl ?
              item.imageUrl.split('|').map((img) => {
                return(  
                  <PinchGestureHandler
                    onGestureEvent={onZoomEventFunction}
                    onHandlerStateChange={onZoomStateChangeFunction}
                  >
                    <Animated.Image
                      style={{width: {width}, height: 200,resizeMode : 'stretch', transform: [{scale: scale}] }}
                      source={{uri:img}} 
                      resizeMode={'contain'}
                    /> 
                </PinchGestureHandler>
                )
              })
            : null}
            <View style={{flexDirection:'row', margin:10}}>

                    <Text style={{paddingLeft:5}} >{item.likeCount} Like</Text>
                    <Text style={{paddingLeft:45}} >{item.commentCount} Comment</Text>
            </View>
            <View style={{flexDirection:'row', margin:10}}>
                    <Text style={{paddingLeft:5}} 
                        onPress={()=> {
                            item.likeFlag=(item.likeFlag===null || !item.likeFlag)?true:false;
                            setLikeFlag(item.likeFlag)
                            likeFlow(item.shalomId, item.likeFlag)
                          }
                        } 
                    >
                      <AntDesign 
                        name={item.likeFlag===null || !item.likeFlag ? "like2": "like1"} 
                        size={24} 
                        color={item.likeFlag===null || !item.likeFlag ?"gray": "purple"}  
                      />
                    </Text>
                    <Text style={{paddingLeft:45}} onPress={()=> navigation.replace('Comment', {"userId": userId ,"userName": item.userName, "shalomId": item.shalomId, "shalom": item.shalom, "imageUrl": item.imageUrl, "likeCount": item.likeCount, "likeFlag": item.likeFlag} )}><FontAwesome name={item.commentCount>0 ? "comments-o": "comments"} size={24} color={item.commentCount>0 ?"purple":"gray"}   /></Text>
                    <Text style={{paddingLeft:45}} onPress={onShare}><FontAwesome name="share-square" size={24} color="gray"   /></Text>
                    {/* item.likeFlag=item.likeFlag===null?true:item.likeFlag===true?false:true; setLikeFlag(item.likeFlag); */}
            </View>
        </Card>
        ); 
    };

    // onPress={async () => {
    //   await onShareSingle({
    //     title: "Share to Instagram",
    //     message: "Check out my pic.",
    //     social: Share.Social.FACEBOOK, 
    //   });
    // }} title="Share to Instagram">


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
              No Availabe Shalom's for you Yet!
          </Text>
        <Text style={styles.noShalomsFound}>
            Press the search icon <Ionicons name="search-circle-sharp" size={35} color="purple" /> above to follow the one you know or click on the icon <MaterialCommunityIcons name="home-group-plus" size={35} color="purple"   /> below to post a new shalom.
        </Text>
      </View>
  );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{padding: 10}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View style={{marginTop: 0}}>
              <Image
                source={shalom}
                style={{ height: 50, width: 150, resizeMode: 'contain' }}
                flex={1}
                resizeMode="contain"
                resizeMethod="resize"
                
              />
            </View>
            <View  style={{textAlign: 'right', marginTop:10, marginLeft:120}}>
            <TouchableOpacity style={{}} onPress={() => navigation.navigate('Follow-user')}>
              <Ionicons name="search-circle-sharp" size={35} color="purple" />
            </TouchableOpacity>
            
            </View>
            <View  style={{textAlign: 'right', marginTop:10, marginRight:15}}>
            {/* <Text style={{fontSize: 18, fontFamily: 'Roboto-Medium', paddingRight:130, paddingTop:5}}>
              Hello {userName}
            </Text> */}
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <ImageBackground
                  source={require('../assets/images/user-profile.jpg')}
                  style={{width: 35, height: 35}}
                  imageStyle={{borderRadius: 25}}
                />
              </TouchableOpacity>
            </View>
            
            
          </View>
          <View style={styles.container}>
          <View
            style={{
              height: 2,
              width: '100%',
              backgroundColor: 'purple',
            }}
          />
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

      borderRadius: SIZES.medium,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    comment: {
        flexDirection: 'row',
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
    commentContainer: {
        marginTop: 6,
        backgroundColor: '#d3d3d3e0',
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        width: 300,
        //cursor: pointer,
        borderRadius: 5,
      },
      emptyListContainer: {
          alignItems: 'center',
          justifyContent: 'center',
      },
      noShalomsFound: {
          fontSize: 16,
          paddingVertical: 8,
      },
  });

