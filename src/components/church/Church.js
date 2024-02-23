import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList,ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import { SIZES, COLORS } from "../../constants"; 
import { Card, Title, Paragraph } from 'react-native-paper'
import { AuthContext } from '../../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons'; 
import {BASE_URL_CHURCH_API} from '@env'
import { showMessage, hideMessage  } from "react-native-flash-message";

export default function Church({ navigation, route }) {

    const {userToken}= useContext(AuthContext);
    const SEARCH_BY_KEY = "searchByKey?key=";
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const register = route.params;

    useEffect(() => {
        console.log(BASE_URL_CHURCH_API,"Church rendered");//+(filteredDataSource!=null)?"Bengaluru":filteredDataSource
        axios
        .get(`${BASE_URL_CHURCH_API}/searchByKey?key=Bengaluru`, {
          headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            setFilteredDataSource(res.data);
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
        <Card style={{marginTop:10, borderColor:'purple', borderRadius:10, borderBottomWidth:3}}
            onPress={() => navigation.push('Chapters', {bookId: item.id, bibleId: item.bibleId})}
        >
            <View style={{flexDirection:'row',}}>
                {/*  Text */}
                <View style={{justifyContent:'space-around', flex:2/3, margin:10}}>
                    <Title>{item.churchName}</Title>
                </View>
                {/*  Image */}
            </View>
            <View style={{margin:10}}>
                <Paragraph>{item.addressline1}, {item.addressline2}, {item.phone1}</Paragraph>
                <Text>Church time: {item.churchTime}</Text>
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
      <ScrollView style={{padding: 20}}
        
      >
        {/* refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 30,
          }}>
          <Text style={{fontSize: 18, fontFamily: 'Roboto-Medium', fontWeight: 'bold'}}>
            Church List
          </Text>
          <Text>{register==="success"?showMessage({
            message: "Church has been registered successfully!",
            type: "info",
            hideOnPress: true,
            backgroundColor: "purple",
          }):""}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register-church')}>
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
            placeholderTextColor={'#g5g5g5'}
            searchIcon={{ size: 20 }}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction('')}
            placeholder="Search by Church name and address..."
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
  });
