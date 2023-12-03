import { View, Text, SafeAreaView, TouchableOpacity, FlatList, StyleSheet, Button } from "react-native";
import React, { useState, useEffect } from 'react';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import { SIZES, COLORS, SHADOWS } from "../../constants";

const FetchAll = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  useEffect(() => {
    axios
    .get('http://192.168.68.129:8090/bible/v1/bibleList')
    .then((res) => {
        console.log(res.data);
        setFilteredDataSource(res.data);
        setMasterDataSource(res.data);
    })
    .catch((err) => console.log(err));
  }, []);

  const pressHandler = (item) => {
    //navigation.navigate('ReviewDetails');
    navigation.push('Bible', {item});
  }

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.bibleName;
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

      <Text style={styles.itemStyle}  onPress={() => navigation.push('Bible', {bibleId: item.bibleId})}>
        {item.id}
        {'.'}
        {item.bibleName}
      </Text>
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

  const getItem = (item) => {
    //Function for click on an item
    navigation.navigate('FetchAll', {item});
    

    alert('Id : ' + item.id + ' Title : ' + item.bibleName);
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
    )
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


  export default FetchAll;