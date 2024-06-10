import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view'
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import { SIZES, COLORS } from "../../constants"; 
import { FONTS } from "../../constants/theme";
import { Card, Title, Paragraph } from 'react-native-paper'
import { AuthContext } from '../../context/AuthContext';
import { FontAwesome, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import {REACT_APP_BASE_URL_API} from '@env'
import { showMessage, hideMessage  } from "react-native-flash-message";
import moment from "moment";
import useAxios from '../common/useAxios';

export default function Church({ navigation, route }) {

    const {userToken, getCredentials, userInfo}= useContext(AuthContext);
    const SEARCH_BY_KEY = "searchByKey?key=";
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const register = route.params;
    let api = useAxios()

    useEffect(() => {
        console.log(REACT_APP_BASE_URL_API,"Church rendered");//+(filteredDataSource!=null)?"Bengaluru":filteredDataSource
        getCredentials();
        //console.log("Church new cred=== ",JSON.parse(getCredentials()))
        //getFilteredDataSource();

       /*  let response = async()=>{
          console.log("Inside ===");
          await api.get('/church/searchByKey?key=Bengaluru')
        if(response.status === 200){
          setFilteredDataSource(response.data);
        }
      } */
        axios
        .get(`${REACT_APP_BASE_URL_API}/church/searchByKey?key=Bengaluru`, {
          headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            //console.log(res.data)
            setFilteredDataSource(res.data);
        })
        .catch((err) => console.log(err));
      }, []);

      const getFilteredDataSource = async() => {
        console.log("Inside ===");
        let response = await api.get('/church/searchByKey?key=Bengaluru')
        if(response.status === 200){
          setFilteredDataSource(response.data);
        }
      }

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

      const deleteDialog = (churchId) =>{
        Alert.alert('Delete church?', 'Please confirm if you wish to proceed.', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => deleteChurch(churchId)},
        ],
        {
          cancelable: true,
        },
        );
      };

      const deleteChurch = (churchId) => {
        axios
        .delete(`${REACT_APP_BASE_URL_API}/church/delete`, {
            params: { id: churchId},
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
                        "extUserName": item.createdBy,
                        "route": "profile"
                      })
                     }}   />
                  </TouchableOpacity></View>
                <View style={{ marginLeft:5, }}>
                  <Title>{item.createdBy}</Title>
                  <Text style={{...FONTS.body5}}>Posted on {moment(item.createdOn).format("MMMM D")}</Text>
                </View>
            </View>
            <View style={{flexDirection:'row',}}>
                {/*  Text */}
                <View style={{justifyContent:'space-around', flex:2/3, margin:10}}>
                  <Title> {item.churchName}</Title>
                </View>
            </View>
            <View style={{margin:10}}>
                <Paragraph><FontAwesome name="address-card" size={21} color="purple" /> {item.addressLine1}, {item.addressLine2}, {item.userRegionName}, {item.userCityName}, {item.userStateName}, {item.userCountryName}</Paragraph>
{/*                 <Text><Ionicons name="time-sharp" size={24} color="purple" /> {item.churchTime}</Text> */}
                <Text><FontAwesome name="phone-square" size={24} color="purple" /> {item.phone1}, {item.phone2}</Text>
            </View>
            {item.userId === userInfo.userId && <View style={{flexDirection:'row', margin:10}}>
            <Text style={{paddingLeft:5}} onPress={()=> navigation.replace('Register-church', {"churchId": item.churchId ,"userId": item.userId ,"churchName": item.churchName, "addressline1": item.addressLine1, "addressline2": item.addressLine2, "phone1": item.phone1, "phone2": item.phone2, "countryId": item.countryId, "countryName": item.userCountryName, "regionId": item.regionId, "regionName": item.userRegionName, "stateId": item.stateId, "stateName": item.userStateName, "cityId": item.cityId, "cityName": item.userCityName, "churchWebsiteUrl": item.churchWebsiteUrl, "createdOn": item.createdOn} )}><FontAwesome name="edit" size={24} color="gray" /></Text>
            <Text style={{paddingLeft:35}} onPress={()=>{deleteDialog(item.churchId)}}><MaterialIcons name="delete-forever" size={24} color="gray" /></Text>
            </View>}
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
      <ScrollView style={{padding: 20}}
        
      >
        {/* refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 18, fontFamily: 'Roboto-Medium', fontWeight: 'bold'}}>
            Church
          </Text>
          <Text>{register==="success"?showMessage({
            message: "Church has been registered successfully!",
            type: "info",
            hideOnPress: true,
            backgroundColor: "purple",
          }):""}</Text>
          <TouchableOpacity onPress={() => navigation.replace('Register-church')}>
            <MaterialIcons name="post-add" size={35} color="purple" />
          </TouchableOpacity>
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
            placeholder="Search by Church name and address..."
            value={search}
          />
  
          <FlatList
            data={filteredDataSource}
            keyExtractor={(item, index) => item.churchId}
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
      marginTop: SIZES.small,
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
      color: COLORS.purplePrimary,
    },
  });
