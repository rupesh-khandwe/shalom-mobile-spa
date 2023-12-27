import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, Button, Image, ScrollView, TouchableOpacity, ImageBackground, } from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import { SIZES, COLORS } from "../constants"; 
import { Card, Title, Paragraph } from 'react-native-paper'
import { FontAwesome, AntDesign } from '@expo/vector-icons'; 
import { Video, ResizeMode } from 'expo-av';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
    const {userToken}= useContext(AuthContext);
    const BASE_URL_API = "http://192.168.68.133:8090/api/shalom/v1";
    const SEARCH_BY_KEY = "eventByUserId?key=";
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [likeFlag, setLikeFlag] = React.useState(false);
    const userId= 1;

    const likeFlow = () => {
        setLikeFlag(!likeFlag);
        axios
        .get(`${BASE_URL_API}/updateLike`, {
            params: { userId: userId, shalomId: userId, likeFlag: likeFlag },
            headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            console.log(res.data);
            setFilteredDataSource(res.data);
            setMasterDataSource(res.data);
        })
        .catch((err) => console.log(err)); 
    };

    useEffect(() => {   
        console.log("Bearer "+ userToken);//+(filteredDataSource!=null)?"Bengaluru":filteredDataSource
        axios
        .get(`${BASE_URL_API}/shalomsWithLikeComment`, {
          headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            console.log(res.data);
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
        // Flat List Item onPress={() => navigation.push('Chapters', {bookId: item.id, bibleId: item.bibleId})}
        <Card style={{marginTop:10, borderColor:'black', borderRadius:5, borderBottomWidth:1}}>
            <View style={{flexDirection:'row',}}>
                {/*  Text */}
                <View style={{justifyContent:'space-around', flex:2/3, margin:10}}>
                    <Title>{item.shalom}</Title>
                </View>
                {/*  Image */}
            </View>
            <View style={{margin:10}}>
                <Text>Shalom posted on : {item.createdOn}</Text>
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
                    <Text style={{paddingLeft:5}} onPress={()=> likeFlow()} ><AntDesign name={likeFlag ? "like1": "like2"} size={24} color={likeFlag ?"#3282F6":"black"}  /></Text>
                    <Text style={{paddingLeft:45}} onPress={()=> alert('Like')}><FontAwesome name="comments-o" size={24} color="black"  /></Text>
                    <Text style={{paddingLeft:45}}><FontAwesome name="share-square" size={24} color="black"   /></Text>
            </View>
        </Card>
        ); 
    };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{padding: 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <Text style={{fontSize: 18, fontFamily: 'Roboto-Medium'}}>
              Hello Rupesh
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
  });

