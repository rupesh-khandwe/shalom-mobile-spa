// Searching using Search Bar Filter in React Native List View
// https://aboutreact.com/react-native-search-bar-filter-on-listview/
import React, { useState, useEffect } from 'react';

// import all the components we are going to use
import { SafeAreaView, Text, StyleSheet, View, FlatList, Button } from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import { SIZES, COLORS } from "../../constants";



const Bible = ({route, navigation}) => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const FETCH_ALL_BOOK_URL = "https://api.scripture.api.bible/v1/bibles/";
  const API_KEY = "14336e15a3f06e3daa59286d6a38e9e3";

  useEffect(() => {

    axios
    .get(FETCH_ALL_BOOK_URL+route.params.bibleId+"/books", { headers: { 'api-key': API_KEY, 'content-type': 'application/json'}}) 
    .then((res) => {
        console.log(
          res.data.data);
        setFilteredDataSource(res.data.data);
        setMasterDataSource(res.data.data);
    })
       .catch((err) => console.log("error1 "+err));
  }, []);


  const ItemView = ({ item }) => {
    return (
      // Flat List Item

      <Text style={styles.itemStyle}  onPress={() => navigation.push('Chapters', {bookId: item.id, bibleId: item.bibleId})}>  
        {item.nameLong}
      </Text>
    ); 
  };

  const getItem = (item) => {
    //Function for click on an item


    alert('Id : ' + item.id + ' Title : ' + item.bibleName);
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

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.nameLong;
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


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction('')}
          placeholder="Type Here..."
          value={search}
        />

        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
    </SafeAreaView>
  );
};

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

export default Bible;