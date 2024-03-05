// Searching using Search Bar Filter in React Native List View
// https://aboutreact.com/react-native-search-bar-filter-on-listview/
import React, { useState, useEffect } from 'react';

// import all the components we are going to use
import { SafeAreaView, Text, StyleSheet, View, FlatList, Button, TouchableOpacity, Alert } from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import { SIZES, COLORS } from "../../constants";
import HTMLView from 'react-native-htmlview';
import { Table, Row, Rows } from 'react-native-table-component';

const Chapters = ({route, navigation}) => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [tableHead, setTableHead] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const FETCH_ALL_BOOK_URL = "https://api.scripture.api.bible/v1/bibles";
  const API_KEY = "14336e15a3f06e3daa59286d6a38e9e3";


  useEffect(() => {
    axios
    .get(FETCH_ALL_BOOK_URL+"/"+route.params.bibleId+"/books/"+route.params.bookId+"/chapters", { headers: { 'api-key': API_KEY, 'content-type': 'application/json'}}) 
    .then((res) => {
        console.log(
          res.data.data);
          var data = res.data.data;
          let loopData = [];
          var counter = 1;
          var loopCycle= (res.data.data.length-1) /6;
          let dataTableArray = [];
          let test = [];

          const elementButton = (value, id) => (
            <TouchableOpacity onPress={() => navigation.push('VerseCount', {chapterId: id, bibleId: route.params.bibleId})} >
              <View >
                <Text style={styles.btnText}>{value}</Text>
              </View>
            </TouchableOpacity>
          );

          for(i=0; i <= Math.round(loopCycle); i++){
            for(j=1; j <=6; j++){
              //console.log(data[counter].number);
              if(res.data.data.length-1 === counter)
                break;
              //loopData.push(`<View style={{ flex: 1}}><Text>${data[counter].number}</Text></View>`);
              loopData.push(elementButton(data[counter].number, data[counter].id));
              counter++;
            }
            // dataTableArray.push({
            //   `<View style={{ flexDirection: 'row'}}>${loopData}</View>`
            // });
            //test.push(`<View style={{ flexDirection: 'row'}}>${loopData}</View>`);
            test.push(loopData);
            loopData =[];
          }
        setFilteredDataSource(test);
        setMasterDataSource(res.data.data);
        setTableHead: ['Name', 'Age', 'Gender'];
    })
    .catch((err) => console.log("error1 "+err));
  }, []);


  const ItemView = ({ item }) => {
    return (

      <Text style={styles.itemStyle} onPress={() => navigation.push('Verse', {chapterId: item.id, bibleId: item.bibleId})}>

        {item.number}
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

 const alertIndex = (cellData) =>{
    console.log("This is row" + cellData.id);
  };

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.reference;
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

        <Table borderStyle={{borderWidth: 4, borderColor: '#C1C0B9', borderCurve: 'circular'}} style={styles.row} >
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={filteredDataSource} textStyle={styles.text} style={styles.rowSection}/>
        </Table>

         {/* <HTMLView value={filteredDataSource}></HTMLView> */}
       </View>
     </SafeAreaView>
    // <DataTable
    //   onRowSelect={(row) => {console.log('ROW => ',row)}}
    //   data={filteredDataSource}
    // />

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
  row: {
    gap: 0,
    marginVertical: 20,
  },
  text: {
    flexDirection: "row",
    fontSize: 25,
    textAlign: 'center',
  },
  rowSection: { height: 50, backgroundColor: '#E7E6E1' },
});

export default Chapters;