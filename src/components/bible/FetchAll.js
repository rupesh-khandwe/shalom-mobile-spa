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
    .get('http://192.168.68.136:8090/bible/v1/bibleList')
    .then((res) => {
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
      <Text style={styles.itemStyle}  onPress={() => navigation.push('Bible', {bibleId: item.id})}>
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

        <View style={styles.header}>
          <Text style={styles.headerTitle}><Button title='Popular Bible' onPress={pressHandler} /></Text>
        </View>
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>

      
      <TouchableOpacity 
        style={styles.container}

        >
  
  
          <View style={styles.textContainer}>
            <Text style={styles.jobName} numberOfLines={1}>
             Hello 
            </Text>
            <Text style={styles.jobType}> <Button title='to review details screen' onPress={pressHandler} /></Text>
          </View>
      </TouchableOpacity>
    </SafeAreaView>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      padding: SIZES.medium,
      borderRadius: SIZES.small,
      backgroundColor: "#FFF",
      ...SHADOWS.medium,
      shadowColor: COLORS.white,
    },
    logoContainer: {
      width: 50,
      height: 50,
      backgroundColor: COLORS.white,
      borderRadius: SIZES.medium,
      justifyContent: "center",
      alignItems: "center",
    },
    logoImage: {
      width: "70%",
      height: "70%",
    },
    textContainer: {
      flex: 1,
      marginHorizontal: SIZES.medium,
    },
    jobName: {
        fontSize: SIZES.medium,
        color: COLORS.primary,
      },
      jobType: {
        fontSize: SIZES.small + 2,
        color: COLORS.gray,
        marginTop: 3,
        textTransform: "capitalize",
      },
  });


  export default FetchAll;