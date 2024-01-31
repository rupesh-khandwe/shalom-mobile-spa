import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, ScrollView, TouchableHighlight, TextInput, Easing } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import axios from 'axios';
import { SIZES, COLORS } from "../../constants"; 
import { Card, Title, Paragraph } from 'react-native-paper'
import { AuthContext } from '../../context/AuthContext';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons'; 
import {BASE_URL_EVENT_API} from '@env'

export default function Events({ navigation }) {
    const {userToken, userInfo}= useContext(AuthContext);
    const SEARCH_BY_KEY = "eventByUserId?key=";
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const animation = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
      return {
        width: animation.value==1?withTiming(300, {duration: 500}):withTiming(0, {duration:500})
      }
    });

    useEffect(() => {
        console.log("Events launched");//+(filteredDataSource!=null)?"Bengaluru":filteredDataSource
        axios
        .get(`${BASE_URL_EVENT_API}/eventByUserId?id=${userInfo.userId}`, {
          headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
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
            const itemData = item.addressline1+","+item.addressline2+","+item.churchName;
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
        <Card style={{marginTop:10, borderColor:'black', borderRadius:5, borderBottomWidth:1}}
            onPress={() => navigation.push('Chapters', {bookId: item.id, bibleId: item.bibleId})}
        >
            <View style={{flexDirection:'row',}}>
                {/*  Text */}
                <View style={{justifyContent:'space-around', flex:2/3, margin:10}}>
                    <Title>{item.title}</Title>
                </View>
                {/*  Image */}
            </View>
            <View style={{margin:10}}>
                <Paragraph>{item.description}</Paragraph>
            </View>
            <View style={{margin:10}}>
                <Paragraph>{item.addressline1}, {item.addressline2}, {item.phone1}</Paragraph>
                <Text>Event date/time: {item.eventDate} / {item.eventTime}</Text>
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
              marginTop: 30,
            }}>
            <Text style={{fontSize: 18, fontFamily: 'Roboto-Medium', fontWeight: 'bold'}}>
              Event's
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Add-event')}>
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
            placeholderTextColor={'#g5g5g5'}
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
