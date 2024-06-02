import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, Alert } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view'
import { Icon, SearchBar } from 'react-native-elements';
import axios from 'axios';
import { SIZES, COLORS } from "../../constants"; 
import { FONTS } from "../../constants/theme";
import { Card, Title, Paragraph } from 'react-native-paper'
import { AuthContext } from '../../context/AuthContext';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons, FontAwesome, Ionicons, Fontisto  } from '@expo/vector-icons'; 
import {REACT_APP_BASE_URL_API} from '@env'
import { showMessage, hideMessage  } from "react-native-flash-message";
import moment from "moment";

export default function Events({ navigation, route }) {
    const {userToken, userInfo}= useContext(AuthContext);
    const SEARCH_BY_KEY = "eventByUserId?key=";
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const animation = useSharedValue(0);
    const register = route.params;
    const animatedStyle = useAnimatedStyle(() => {
      return {
        width: animation.value==1?withTiming(300, {duration: 500}):withTiming(0, {duration:500})
      }
    });

    useEffect(() => {
        console.log("Events launched");//+(filteredDataSource!=null)?"Bengaluru":filteredDataSource
        axios
        .get(`${REACT_APP_BASE_URL_API}/event/user?id=${userInfo.userId}`, {
          headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
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
            const itemData = item.title+","+item.addressLine1+","+item.addressLine2+","+item.churchName;
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
    
      const deleteDialog = (eventId) =>{
        Alert.alert('Delete event?', 'Please confirm if you wish to proceed.', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => deleteEvent(eventId)},
        ],
        {
          cancelable: true,
        },
        );
      };

      const deleteEvent = (eventId) => {
        axios
        .delete(`${REACT_APP_BASE_URL_API}/event/delete`, {
            params: { id: eventId, userId: userInfo.userId  },
            headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            setFilteredDataSource(res.data);
        })
        .catch((err) => console.log(err)); 
      }

    const ItemView = ({ item }) => {
        return (
        // Flat List Item
        <Card style={{marginTop:10, borderColor:'purple', borderRadius:10, borderBottomWidth:3}}
        >
             <View style={{flexDirection:'row', flex:1}}>
                {/*  Text */}
                <View style={{ marginTop:5, }}><TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <FontAwesome name="user-circle" size={40} color="gray"  onPress={()=>{
                  navigation.push('Profile',{
                    "extUserId": item.userId,
                    "extUserName": item.createdBy
                  })
                }  }   />
                  </TouchableOpacity></View>
                <View style={{ marginLeft:5, }}>
                  <Title>{item.createdBy}</Title>
                  <Text style={{...FONTS.body5}}>Posted on {moment(item.createdOn).format("MMMM D")}</Text>
                </View>
            </View>
            <View style={{flexDirection:'row',}}>
                {/*  Text */}
                <View style={{justifyContent:'space-around', flex:2/3, margin:5}}>
                    <Title>{item.title}</Title>
                </View>
            </View>
            <View style={{margin:8}}>
                <Paragraph>{item.description}</Paragraph>
            </View>
            <View style={{margin:8}}>
                <Paragraph><FontAwesome name="address-card" size={21} color="purple" /> {item.addressLine1}, {item.addressLine2}, {item.userRegionName}, {item.userCityName}</Paragraph>
                <Text><FontAwesome name="phone-square" size={24} color="purple" />  {item.phone1}, {item.phone2} </Text>
                <Text><Fontisto name="date" size={24} color="purple" />  {item.eventDate}  <Ionicons name="time-sharp" size={24} color="purple" /> {item.eventTime}</Text>
            </View>
            {item.userId === userInfo.userId && 
              <View style={{flexDirection:'row', margin:10}}>
                <Text style={{paddingLeft:5}} onPress={()=> navigation.replace('Add-event', {"eventId": item.eventId ,"userId": item.userId ,"categoryId": item.categoryId, "title": item.title, "description": item.description, "eventDate": item.eventDate, "eventTime": item.eventTime, "addressLine1": item.addressLine1, "addressLine2": item.addressLine2, "phone1": item.phone1, "phone2": item.phone2, "countryId": item.countryId, "countryName": item.userCountryName, "regionId": item.regionId, "regionName": item.userRegionName, "stateId": item.stateId, "stateName": item.userStateName, "cityId": item.cityId, "cityName": item.userCityName, "churchWebsiteUrl": item.churchWebsiteUrl, "createdOn": item.createdOn} )}><FontAwesome name="edit" size={24} color="gray" /></Text>
                <Text style={{paddingLeft:35}} onPress={()=>{deleteDialog(item.eventId)}}><MaterialIcons name="delete-forever" size={24} color="gray" /></Text>
              </View>
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
  

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{padding: 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 30,
            }}>
            <Text style={{fontSize: 18, fontFamily: 'Roboto-Medium', fontWeight: 'bold'}}>
              Event's
            </Text>
            <Text>{register==="success"?showMessage({
                message: "Event has been added successfully!",
                type: "info",
                hideOnPress: true,
                backgroundColor: "purple",
              }):""}</Text>
            <TouchableOpacity onPress={() => navigation.replace('Add-event')}>
            <MaterialIcons name="post-add" size={35} color="purple" />
              {/* <ImageBackground
                source={require('../assets/images/user-profile.jpg')}
                style={{width: 35, height: 35}}
                imageStyle={{borderRadius: 25}}
              /> */}
            </TouchableOpacity>
            {/* <TouchableHighlight
              activeOpacity={1}
              underlayColor={"#ccd0d5"}
              onPress={this._onFocus}
              style={styles.search_icon_box}
            >
              <Icon name="search" size={22} color={"#000000"}></Icon>
            </TouchableHighlight> */}
            {/* <Animated.View
              style={[
                {
                  width: 300,
                  height: 50,
                  backgroundColor: '#ccd0d5',
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center'

                },
                animatedStyle
              ]}
            >
              <TextInput style={{width:'80%'}} placeholder='Search..'> </TextInput>
              <TouchableHighlight onPress={()=>{
                if(animation.value==1){
                  animation.value=0;
                } else {
                  animation.value=1;
                }
              }}>
                <Icon name="search" size={22} color={"#000000"}></Icon>
              </TouchableHighlight>
            </Animated.View> */}
          
          </View>
        <View style={styles.container}>
          <SearchBar
            lightTheme
            round
            inputStyle={{backgroundColor: 'white'}}
            containerStyle={{backgroundColor: 'white'}}
            inputContainerStyle={{backgroundColor: 'white'}}
            searchIcon={{ size: 20 }}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction('')}
            placeholder="Search events by location..."
            value={search}
          />
  
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
    search_icon_box: {
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: "#e4e6eb",
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
  });
