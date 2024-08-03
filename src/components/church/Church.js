import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view'
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import { SIZES, COLORS } from "../../constants"; 
import { FONTS } from "../../constants/theme";
import { Card, Title, Paragraph } from 'react-native-paper'
import { AuthContext } from '../../context/AuthContext';
import { FontAwesome, MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons'; 
import {REACT_APP_BASE_URL_API} from '@env'
import { showMessage, hideMessage  } from "react-native-flash-message";
import moment from "moment";
import useAxios from '../common/useAxios';
import { ActivityIndicator } from 'react-native-paper';
import {Avatar} from 'react-native-paper';
import {Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider} from 'react-native-popup-menu';
import AntDesign from "@expo/vector-icons/AntDesign";
import {Dropdown} from "react-native-element-dropdown";

export default function Church({ navigation, route }) {

    const {userToken, userInfo}= useContext(AuthContext);
    const SEARCH_BY_KEY = "searchByKey?key=";
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [languageId, setLanguageId] = useState(null);
    const [languageName, setLanguageName] = useState(null);
    const [languageData, setLanguageData] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [errors, setErrors] = useState({});

    const register = route.params;
    let api = useAxios()
    const [loader, setLoader] = useState(true);
    const Divider = () => <View style={styles.divider} />;

    useEffect(() => {
        console.log(REACT_APP_BASE_URL_API,"Church rendered");//+(filteredDataSource!=null)?"Bengaluru":filteredDataSource

        axios
            .get(`${REACT_APP_BASE_URL_API}/church/language`, {
                headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
            })
            .then((res) => {
                var count = Object.keys(res.data).length;
                let languageArray = [];
                languageArray.push({ label : 'All', value: null});
                for (var i = 0; i < count; i++) {
                    languageArray.push({
                        value: res.data[i].languageId,
                        label: res.data[i].languageName,
                    });
                }
                setLanguageData(languageArray);
            })
            .catch((err) => console.log(err));

        axios
        .get(`${REACT_APP_BASE_URL_API}/church/searchByKey?key=Bengaluru`, {
          headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            //console.log(res.data)
            setLoader(false);
            setFilteredDataSource(res.data);
            setMasterDataSource(res.data);
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

      const searchWithLanguageFunction = (languageName) => {
          if (languageName != null && languageName !== 'All') {
              const newData = masterDataSource.filter(function (item) {
                  return item.languageName === languageName;
              });
              setFilteredDataSource(newData);
          } else {
              setFilteredDataSource(masterDataSource);
          }
          setSearch('');
      }

      const searchFilterFunction = (text) => {
        // Check if searched text is not blank

          if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterDataSource.filter(function (item) {
                const itemData = item.createdBy+","+item.addressline1+","+item.userRegionName+","+item.userCityName+","+item.churchName;
                const textData = text;
                if (languageName == null || languageName === 'All') {
                    return itemData.indexOf(textData) > -1;
                }
                return item.languageName === languageName && itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
          } else if (languageName != null && languageName !== 'All') {
            searchWithLanguageFunction(languageName);
          }  else {
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
                <View style={{ marginTop:5, }}>
                    <TouchableOpacity onPress={() => {
                                                      navigation.navigate('HomeStack',{
                                                      screen: 'Profile',
                                                      params: { "extUserId": item.userId,"extUserName": item.createdBy, "route": "profile"} })
                                                    }}>
                          <Avatar.Image
                            size={40}
                            style={styles.avatar}
                            source={{
                              uri:
                               item.profileImageUrl==""|| item.profileImageUrl==null
                                  ? 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                                  : item.profileImageUrl,
                            }}
                          />
                    </TouchableOpacity>

                 </View>
                <View style={{ marginLeft:5, }}>
                  <Title>{item.createdBy}</Title>
                  <Text style={{...FONTS.body5}}>Posted on {moment(item.createdOn).format("MMMM D")}</Text>
                </View>
                {item.userId === userInfo.userId &&  <View style={{flex: 1, alignItems: 'flex-end'}}>
                 
                    <MenuProvider style={styles.menu_container}>
                      <Menu>
                        <MenuTrigger style={{borderColor:'purple'}}  customStyles={{
                                  triggerWrapper: {
                                    top: -28,
                      },}}><Entypo name="dots-three-vertical" size={20} color="gray" /></MenuTrigger>
                        <MenuOptions customStyles={{
                                          optionsContainer: {
                                            borderRadius: 10,
                                            width: 50,
                                            height: 90,
                                            alignItems: 'center',
                                            marginVertical: 15
                                          },
                          }}>
                          <MenuOption onSelect={()=> navigation.replace('Register-church', 
                {"churchId": item.churchId ,"userId": item.userId ,"churchName": item.churchName, "addressline1": item.addressLine1, "addressline2": item.addressLine2, 
                "phone1": item.phone1, "phone2": item.phone2, "countryId": item.countryId, "countryName": item.userCountryName, "regionId": item.regionId, 
                "regionName": item.userRegionName, "stateId": item.stateId, "stateName": item.userStateName, "cityId": item.cityId, "cityName": item.userCityName, 
                "churchWebsiteUrl": item.churchWebsiteUrl, "createdOn": item.createdOn, "languageId": item.languageId, "languageName": item.languageName,
                "churchImageUrl": item.churchImageUrl, "aboutChurch":item.aboutChurch} )}  ><FontAwesome name="edit" size={20} color="gray" /></MenuOption>
                          <Divider></Divider>
                          <MenuOption onSelect={()=>{deleteDialog(item.churchId)}}  ><MaterialIcons name="delete-forever" size={20} color="gray" /></MenuOption>
                        </MenuOptions>
                      </Menu>
                    </MenuProvider>
                  
                </View>}
            </View>
            <TouchableOpacity onPress={() => {navigation.navigate('Church-details', 
                    {"userId": item.userId ,"churchName": item.churchName, "churchWebsiteUrl": item.churchWebsiteUrl, "createdOn": item.createdOn, "createdBy" :item.createdBy,
                     "phone1": item.phone1, "phone2": item.phone2, "addressLine1": item.addressLine1, "addressLine2": item.addressLine2,  
                     "countryName": item.userCountryName, "regionName": item.userRegionName, "stateName": item.userStateName, "cityName": item.userCityName,  
                     "churchImageUrl": item.churchImageUrl, "profileImageUrl": item.profileImageUrl, "languageName": item.languageName, "aboutChurch":item.aboutChurch}
            )}}>
            <View style={{flexDirection:'row',}}>
                {/*  Text */}
                <View style={{justifyContent:'space-around', flex:2/3, margin:10}}>
                  <Title> {item.churchName}</Title>
                </View>
            </View>
            <View style={{margin:10}}>
              <Text><Entypo name="language" size={24} color="purple" />  {item.languageName}</Text>
              <Paragraph> <MaterialCommunityIcons name="details" size={20} color="purple" style={{marginRight: 5}}/>  {item.aboutChurch}</Paragraph>
               
                <Paragraph><FontAwesome name="address-card" size={21} color="purple" /> {item.addressLine1}, {item.addressLine2}, {item.userRegionName}, {item.userCityName}, {item.userStateName}, {item.userCountryName}</Paragraph>
{/*                 <Text><Ionicons name="time-sharp" size={24} color="purple" /> {item.churchTime}</Text> */}
                <Text><FontAwesome name="phone-square" size={24} color="purple" /> {item.phone1}, {item.phone2}</Text>
            </View>
            </TouchableOpacity>
            {/* {item.userId === userInfo.userId && <View style={{flexDirection:'row', margin:10}}>
            <Text style={{paddingLeft:5}} onPress={()=> navigation.replace('Register-church', 
                {"churchId": item.churchId ,"userId": item.userId ,"churchName": item.churchName, "addressline1": item.addressLine1, "addressline2": item.addressLine2, 
                "phone1": item.phone1, "phone2": item.phone2, "countryId": item.countryId, "countryName": item.userCountryName, "regionId": item.regionId, 
                "regionName": item.userRegionName, "stateId": item.stateId, "stateName": item.userStateName, "cityId": item.cityId, "cityName": item.userCityName, 
                "churchWebsiteUrl": item.churchWebsiteUrl, "createdOn": item.createdOn, "languageId": item.languageId, "languageName": item.languageName,
                "churchImageUrl": item.churchImageUrl, "aboutChurch":item.aboutChurch} )}><FontAwesome name="edit" size={24} color="gray" /></Text>
            <Text style={{paddingLeft:35}} onPress={()=>{deleteDialog(item.churchId)}}><MaterialIcons name="delete-forever" size={24} color="gray" /></Text>
            </View>} */}
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
          {/* refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            padding: 10
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
          <Dropdown
              style={[styles.dropdownRegion, isFocus && {borderColor: 'black'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={languageData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Filter by church language' : '...'}
              searchPlaceholder="Search..."
              value={languageId}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                  setLanguageId(item.value);
                  setLanguageName(item.label);
                  setIsFocus(false);
                  searchWithLanguageFunction(item.label);
              }}
              renderLeftIcon={() => (
                  <AntDesign
                      style={styles.icon}
                      color={isFocus ? '#AD40AF' : 'black'}
                      name="Safety"
                      size={20}
                  />
              )}
              error={errors.languageId}
          />
        <SearchBar
                lightTheme
                round
                inputStyle={{backgroundColor: 'white'}}
                containerStyle={{backgroundColor: 'white'}}
                inputContainerStyle={{backgroundColor: 'white'}}
                searchIcon={{ size: 20 }}
                onChangeText={query=> searchFilterFunction(query)}
                onClear={(text) => searchFilterFunction('')}
                placeholder="Search by Church, address and user..."
                value={search}
              />
      <ScrollView style={{padding: 10}}>
        <View style={styles.container}>
          <FlatList
            data={filteredDataSource}
            keyExtractor={(item) => item.churchId}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
            extraData={filteredDataSource}
          />
           {loader && <ActivityIndicator animating={loader} color='purple' size='large' style={styles.spinnerStyle}/>}
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
    menu_container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      padding: 25,
      flexDirection: "column",
      flexWrap: 'wrap',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: "#7F8487",
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
    spinnerStyle: {
        flex: 1,
        marginTop:200,
        justifyContent: 'center',
        alignItems:'center'
    },
    avatar: {
        borderRadius: 40,
        marginTop: 5,
        backgroundColor: 'white',
        height: 40,
        width: 40,
        padding: 1,
        borderColor: '#ccc',
        borderWidth: 0,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
  });
