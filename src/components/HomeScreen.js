import React, { useState, useEffect, useContext, useRef } from 'react';
import { ScrollView, SafeAreaView, Text, StyleSheet, View, FlatList,TouchableOpacity, RefreshControl, Dimensions, Animated, Image} from 'react-native';
//import { ScrollView } from 'react-native-virtualized-view'
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
import { shalomInside } from '../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import {Avatar} from 'react-native-paper';
import EventNotifications from './event/EventNotifications';

export default function HomeScreen({ navigation }) {
    const {userToken, userInfo, userId, userName}= useContext(AuthContext);
    const SEARCH_BY_KEY = "eventByUserId?key=";
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [filteredEventNotifyDataSource, setFilteredEventNotifyDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [likeFlag, setLikeFlag] = useState(true);
    const [localUserId, setLocalUserId]= useState('');
    const [localUserName, setLocalUserName]= useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [profilePic, setProfilePic] = useState('');
    var width = Dimensions.get("window");
    const scale = new Animated.Value(1);
    let api = useAxios();
    const [loader, setLoader] = useState(true);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
      AsyncStorage.getItem('userId').then((userId)=>{
          console.log("On refresh Home screen ",userId);
            axios
            .get(`${REACT_APP_BASE_URL_API}/shalom/shalomsWithLikeComment?userId=${userId}`, {
              headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
            })
            .then((res) => {
                //console.log(res.data)
                setFilteredDataSource(res.data);
            })
            .catch((err) => console.log(err));
            axios
                .get(`${REACT_APP_BASE_URL_API}/shalom/profilePic?userId=${userId}`, {
                  headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
                })
            .then((res) => {
                //console.log(res.data);
                setProfilePic(res.data)
            })
            .catch((err) => console.log(err));
      })
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
            AsyncStorage.getItem('userId').then((userId)=>{
              setLocalUserId(userId);
              axios
              .get(`${REACT_APP_BASE_URL_API}/shalom/shalomsWithLikeComment?userId=${userId}`, {
                headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
              })
              .then((res) => {
                  //console.log(res.data);
                  setLoader(false);
                  setFilteredDataSource(res.data);
              })
              .catch((err) => console.log(err));
  
              axios
                  .get(`${REACT_APP_BASE_URL_API}/shalom/profilePic?userId=${userId}`, {
                    headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
                  })
              .then((res) => {
                  //console.log(res.data);
                  setProfilePic(res.data)
              })
              .catch((err) => console.log(err));

              console.log("Loaded EventNotifications*************", userId);
              axios
              .get(`${REACT_APP_BASE_URL_API}/event/notification?id=${userId}`, {
                headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
              })
              .then((res) => {
                setFilteredEventNotifyDataSource(res.data);
              })
              .catch((err) => console.log(err));
            })

            AsyncStorage.getItem('userName').then((userName)=>{
              setLocalUserName(userName);
            });
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

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        // The screen is focused
        // Call any action
        console.log("Profile screen focused")
          width = Dimensions.get("window");
          getAsyncData();

            });
            // Return the function to unsubscribe from the event so it gets removed on unmount
            return unsubscribe;
    }, []);

    const ItemView = ({ item }) => {
        return (
        <Card style={{marginTop:10, borderColor:'purple', borderRadius:10, borderBottomWidth:3}}>
          <View style={{flexDirection:'row', flex:1}} key={item.shalomId}>
                {/*  Text */}
                <View style={{ marginTop:5, }}>
                     <TouchableOpacity onPress={() => {
                        navigation.push('Profile',{"extUserId": item.userId,
                                                   "extUserName": item.userName
                        })
                      }}>
                    <Avatar.Image
                      size={40}
                      style={styles.avatar}
                      source={{
                        uri:
                         item.profileImageUrl==""|| item.profileImageUrl==null
                            ? 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                            : item.profileImageUrl,
                      }}
                    />
                      </TouchableOpacity>
                </View>
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
                </View>
            }
            {item.imageUrl ?
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

  const EventView = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => 
        navigation.navigate('Events',{
                                            screen: 'Event-details',
                                            params: {"eventId": item.eventId, "route":"notify"}})
      }>
        <View style={styles.createStoryContainer}>
          <View style={styles.iconContainer}>
        
                  <Avatar.Image
                    size={40}
                    style={{height:40,width:40,}}
                    source={{
                      uri:
                       item.profileImageUrl==""|| item.profileImageUrl==null
                          ? 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                          : item.profileImageUrl,
                    }}
                  />
                  <Text style={styles.createdBy}>{item.createdBy}</Text>
          </View>
          <View style={{ marginLeft:2, }}>
                  <Text style={styles.categoryName}>{item.categoryName}</Text>
          </View>
          
        </View>
      </TouchableOpacity>
    ); 
};

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
                source={shalomInside}
                style={{ height: 35, width: 125, resizeMode: 'contain' }}
                flex={1}
                resizeMode="contain"
                resizeMethod="resize"
                
              />
            </View>
            <View  style={{textAlign: 'right', marginTop:20, marginLeft:135}}>
            <TouchableOpacity style={{}} onPress={() => navigation.navigate('Follow-user')}>
              <Ionicons name="search-circle-sharp" size={35} color="purple" />
            </TouchableOpacity>
            
            </View>
            <View  style={{textAlign: 'right', marginTop:20, marginRight:30}}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Avatar.Image
                  size={40}
                  style={styles.avatar}
                  source={{
                    uri:
                     profilePic==""|| profilePic==null
                        ? 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                        : profilePic,
                  }}
                />
              </TouchableOpacity>
            </View>
            
            
          </View>
          <View style={styles.container}>
            {/* <EventNotifications></EventNotifications> */}
            <ScrollView
              horizontal
              style={styles.storiesContainer}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.contentContainerStyle}>
                <FlatList
                  data={filteredEventNotifyDataSource}
                  horizontal
                  keyExtractor={(item, index) => {return index.toString()}}
                  renderItem={EventView}
                />
            </ScrollView> 
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

      borderRadius: SIZES.medium,
    },
    iconContainer: {
      flexDirection: "row",
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      top: '5%',
      backgroundColor: COLORS.purple,
      borderRadius: 50,
      
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
      spinnerStyle: {
          flex: 1,
          marginTop:200,
          justifyContent: 'center',
          alignItems:'center'
      },
      avatar: {
        borderRadius: 40,
        marginTop: 5,
        backgroundColor: 'white',
        height: 40,
        width: 40,
        padding: 1,
        borderColor: '#ccc',
        borderWidth: 0,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
      },
      contentContainerStyle: {
        paddingRight: 30,
      },
      storiesContainer: {
        backgroundColor: COLORS.white,
        marginTop: 8,
        padding: 2,
      },
      createStoryContainer: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 10,
        backgroundColor: COLORS.purple,
        alignItems: 'flex-start',
        position: 'relative',
        paddingBottom: 10,
        marginRight:10,
        height:140,
        width:100
      },
      categoryName: {
        flexShrink: 1,
        fontSize: 14,
        color: COLORS.white,
        marginTop: 40,
        textAlign: 'center',
        alignItems: 'center',
        alignContent: 'center'
      },
      createdBy: {
        flexShrink: 1,
        fontSize: 12,
        color: COLORS.white,
        textAlign: 'left',
        justifyContent: 'space-evenly',
        marginTop: 2,
        marginLeft: 3
      },
      contentContainerStyle: {
        paddingRight: 30,
      }
  });

