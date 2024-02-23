import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, Button, Image, ScrollView, TouchableOpacity, ImageBackground, RefreshControl} from 'react-native';
import Share from 'react-native-share';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import { SIZES, COLORS } from "../constants"; 
import { Card, Title } from 'react-native-paper'
import { FontAwesome, AntDesign } from '@expo/vector-icons'; 
import { Video, ResizeMode } from 'expo-av';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL_API } from '@env'

export default function HomeScreen({ navigation }) {
    const {userToken, userInfo}= useContext(AuthContext);
    const SEARCH_BY_KEY = "eventByUserId?key=";
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [likeFlag, setLikeFlag] = React.useState(true);
    const [userId, setUserId]= useState('');
    const [userName, setUserName]= useState('');
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        axios
        .get(`${BASE_URL_API}/shalomsWithLikeComment?userId=${userId}`, {
          headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            setFilteredDataSource(res.data);
            //setMasterDataSource(res.data);
        })
        .catch((err) => console.log(err));
        setRefreshing(false);
      }, 2000);
    }, []);


    const likeFlow = (shalomId, slikeFlag) => {
        axios
        .put(`${BASE_URL_API}/saveLike`, null, {
            params: { userId: userId, shalomId: shalomId, likeFlag: slikeFlag },
            headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            console.log(res.data);
            setFilteredDataSource(res.data);
            //setMasterDataSource(res.data);
        })
        .catch((err) => console.log(err)); 
    };

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
  
    useEffect(() => {   
        setUserId(userInfo.userId);
        setUserName(userInfo.userFirstName+" "+ userInfo.userLastName);
        console.log("Bearer "+ userToken);//+(filteredDataSource!=null)?"Bengaluru":filteredDataSource
        axios
        .get(`${BASE_URL_API}/shalomsWithLikeComment?userId=${userInfo.userId}`, {
          headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            setFilteredDataSource(res.data);
            //setMasterDataSource(res.data);
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
        // Flat List Item onPress={() => navigation.push('Chapters', {bookId: item.id, bibleId: item.bibleId})}
        <Card style={{marginTop:10, borderColor:'purple', borderRadius:10, borderBottomWidth:3}}>
            <View style={{flexDirection:'row', flex:1}}>
                {/*  Text */}
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <FontAwesome name="user-circle" size={30} color="gray"   />
                  </TouchableOpacity>
                <View style={{justifyContent:'space-around', marginLeft:5}}>
                  <Title>{item.userName}</Title>
                </View>
                {/*  Image */}
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
                        onPlayb ackStatusUpdate={status => setStatus(() => status)}
                    />
                    {/* <View style={styles.buttons}>
                        <Button title="Play" onPress={() => video.current.playFromPositionAsync(10)} />
                        {/* <Button title={status.isLooping ? "Set to not loop" : "Set to loop"} onPress={() => video.current.setIsLoopingAsync(!status.isLooping)} /> 
                    </View> */}
                </View>
            }
            {item.imageUrl &&
                <Image
                    style={{width: '100%', height: 200,resizeMode : 'stretch' }}
                    source={{uri: item.imageUrl}} 
                />        
            }
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
                    <Text style={{paddingLeft:45}} onPress={()=> navigation.navigate('Comment', {"userId": userId ,"userName": item.userName, "shalomId": item.shalomId, "shalom": item.shalom, "imageUrl": item.imageUrl, "likeCount": item.likeCount, "likeFlag": item.likeFlag} )}><FontAwesome name={item.commentCount>0 ? "comments-o": "comments"} size={24} color={item.commentCount>0 ?"purple":"gray"}   /></Text>
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


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{padding: 20}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 30,
            }}>
            <Text style={{fontSize: 18, fontFamily: 'Roboto-Medium'}}>
              Hello {userName}
            </Text>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <ImageBackground
                source={require('../assets/images/user-profile.jpg')}
                style={{width: 35, height: 35}}
                imageStyle={{borderRadius: 25}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
          <View
            style={{
              height: 5,
              width: '100%',
              backgroundColor: '#C8C8C8',
            }}
          />
            {/* <SearchBar
              round
              searchIcon={{ size: 24 }}
              onChangeText={(text) => searchFilterFunction(text)}
              onClear={(text) => searchFilterFunction('')}
              placeholder="Search shalom..."
              value={search}
            /> */}
    
            <FlatList
              data={filteredDataSource}
              keyExtractor={(e, index) => index.toString()}
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
    commentContainer: {
        marginTop: 6,
        backgroundColor: '#d3d3d3e0',
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        width: 300,
        //cursor: pointer,
        borderRadius: 5,
      }
  });

