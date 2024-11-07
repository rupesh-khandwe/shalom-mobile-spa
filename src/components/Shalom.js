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
import {Avatar} from 'react-native-paper';

export default function Shalom({ navigation }) {
    const {userToken, userInfo, userId}= useContext(AuthContext);
    
    const SEARCH_BY_KEY = "eventByUserId?key=";
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    var width = Dimensions.get("window");
    //const scale = new Animated.Value(1);
    const [viewState, setViewState] = React.useState(true);
    const scale = React.useRef(new Animated.Value(1)).current;
    const [init, setInit] = React.useState(true);
    const [loader, setLoader] = useState(true);
    const [profilePic, setProfilePic] = useState('');

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

        axios
        .get(`${REACT_APP_BASE_URL_API}/shalom/profilePic?userId=${userInfo.userId}`, {
          headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            //console.log(res.data);
            setProfilePic(res.data)
        })
        .catch((err) => console.log(err));

        if (init) {
          setInit(false);
        } else {
          if (viewState) {
            Animated.timing(scale, {
              toValue: 2,
              duration: 1000,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.timing(scale, {
              toValue: 0.5,
              duration: 700,
              useNativeDriver: true,
            }).start();
          }
        }

      }, [viewState]);

      const scaleOut = () => {
        console.log("Scaleout==")
        setViewState(!viewState);
      };

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
        <Card style={{marginTop:15, borderColor:'purple', borderRadius:15, borderBottomWidth:3}}
        >
          <View style={{flexDirection:'row', flex:1}} key={item.shalomId}>
                {/*  Text */}
                
              
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
            {
            item.imageUrl ? item.imageUrl.split('|').map((img) => {
                return(  
                  <PinchGestureHandler
                    onGestureEvent={onZoomEventFunction}
                    onHandlerStateChange={onZoomStateChangeFunction}
                    key={item.shalomId}
                  >
                    <Image
                      style={{
                        width: '100%',
                        borderRadius: 0,
                        height: 350,
                        paddingBottom: 60
                      }}
                      source={{uri:img}}
                    />
                  </PinchGestureHandler>
                )
              })
              : null}
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
          <ScrollView style={{padding: 15}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 25,
              }}>
              <Text style={{fontSize: 18, fontFamily: 'Roboto-Medium', fontWeight: 'bold', color: 'purple'}}>
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
  });
