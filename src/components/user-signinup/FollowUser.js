import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import { SIZES, COLORS } from "../../constants"; 
import { Card, Title, Paragraph } from 'react-native-paper'
import { AuthContext } from '../../context/AuthContext';
import { FontAwesome, Entypo } from "@expo/vector-icons";
import {BASE_URL_API} from '@env'
import { showMessage, hideMessage  } from "react-native-flash-message";

export default function FollowUser({ navigation, route }) {

    const {userToken, userInfo}= useContext(AuthContext);
    const SEARCH_BY_KEY = "searchByKey?key=";
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const register = route.params;
    const [userId, setUserId] = useState('');
    const [followId, setFollowId] = useState('');
    const [followFlag, setFollowFlag] = useState(true);
    const followPayload = {
      userId: userId,
      followId: followId,
      followFlag: followFlag
    }

    useEffect(() => {
        setUserId(userInfo.userId);
        axios
        .get(`${BASE_URL_API}/users?userId=${userInfo.userId}`, {
          headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            setFilteredDataSource(res.data);
            setMasterDataSource(res.data);
        })
        .catch((err) => console.log(err));
      }, []);

      const searchFilterFunction = (text) => {
        if (text) {
          const newData = masterDataSource.filter(function (item) {
            const itemData = item.userName;
            const textData = text;
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          setFilteredDataSource(masterDataSource);
          setSearch(text);
        }
      };
    
      const followUser = (followerId, followName)=>{
        followPayload.followId=followerId;
        console.log(followPayload);
        axios
        .put(`${BASE_URL_API}/saveFollow`, 
            followPayload,
          {headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
          setFilteredDataSource(res.data);
          setMasterDataSource(res.data);
            showMessage({
              message: "You are following "+followName+"!",
              type: "info",
              hideOnPress: true,
              backgroundColor: "purple",
              style: styles.flashMessage
            })
        })
        .catch((err) => 
          //console.log(`Login error ${err}`)
          showMessage({
            message: "Failed to save, please try-again.",
            type: "info",
            hideOnPress: true,
            backgroundColor: "purple",
            style: styles.flashMessage
          })
        ); 
      }


    const ItemView = ({ item }) => {
        return (
        // Flat List Item
        <Card style={{marginTop:10, borderColor:'purple', borderRadius:10, borderBottomWidth:3}}
        >
          <View style={{flexDirection:'row', flex:1, margin:10}}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <FontAwesome name="user-circle" size={30} color="gray"   />
                {/* <Image
                key={index}
                source={item}
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
              /> */}
            </TouchableOpacity>
            <View style={{justifyContent:'space-around', marginLeft:10}}>
                <Title>{item.userName}</Title>
            </View>

            <View style={{marginLeft:'auto'}} >
              <Entypo name="add-user" size={24} color="purple" style={{ right: 10 }} onPress={()=> followUser(item.userId, item.userName)}/>
            </View>
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


    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{padding: 3}}>
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
            placeholder="Search by User name ..."
            value={search}
          />
          <FlatList
            data={filteredDataSource}
            keyExtractor={(e, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
            extraData={filteredDataSource}
          />
        </View>
        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      gap: SIZES.xSmall,
      borderRadius: SIZES.medium,
    },
    flashMessage: {
      borderRadius: 12,
      opacity: 0.8,
      borderWidth: 2,
      borderColor: '#222',
      margin: 12
    }
  });
