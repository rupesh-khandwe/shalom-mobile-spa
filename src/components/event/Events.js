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
import { StackActions } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import {Avatar} from 'react-native-paper';

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
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        console.log("Events launched");//+(filteredDataSource!=null)?"Bengaluru":filteredDataSource
        axios
        .get(`${REACT_APP_BASE_URL_API}/event/user?id=${userInfo.userId}`, {
          headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            setLoader(false);
            setFilteredDataSource(res.data);
            setMasterDataSource(res.data);
        })
        .catch((err) => console.log(err));
      }, []);

      const searchFilterFunction = (text) => {
        // Check if searched text is not blank
       setTimeout(function () {
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource
          // Update FilteredDataSource
          const newData = masterDataSource.filter(function (item) {
            const itemData = item.title+","+item.userRegionName+","+item.userCityName+","+item.createdBy;
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
       }, 3000)
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

//render the empty list component in case the data array for the FlatList is empty
const renderListEmptyComponent = () => (
    <View style={styles.emptyListContainer}>
        <Text style={styles.noShalomsFound}>
            No Availabe Event's for you Yet!
        </Text>
      <Text style={styles.noShalomsFound}>
          Press the search icon <Ionicons name="search-circle-sharp" size={35} color="purple" /> above to follow the one you know or click on the icon <MaterialIcons name="post-add" size={35} color="purple" /> above to add a new event.
      </Text>
    </View>
);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{padding: 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
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
             <View  style={{textAlign: 'right',  marginLeft:175}}>
                  <TouchableOpacity style={{}} onPress={() => navigation.navigate('Follow-user')}>
                    <Ionicons name="search-circle-sharp" size={35} color="purple" />
                  </TouchableOpacity>
             </View>
            <View  style={{textAlign: 'right',  marginRight:0}}>
                <TouchableOpacity onPress={() => navigation.replace('Add-event')}>
                <MaterialIcons name="post-add" size={35} color="purple" />
              {/* <ImageBackground
                source={require('../assets/images/user-profile.jpg')}
                style={{width: 35, height: 35}}
                imageStyle={{borderRadius: 25}}
              /> */}
                </TouchableOpacity>
             </View>
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

          <FlatList
            data={filteredDataSource}
            keyExtractor={(item, index) => item.eventId}
            ListEmptyComponent={renderListEmptyComponent}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
            ListHeaderComponent={
              <SearchBar
                lightTheme
                round
                inputStyle={{backgroundColor: 'white'}}
                containerStyle={{backgroundColor: 'white'}}
                inputContainerStyle={{backgroundColor: 'white'}}
                searchIcon={{ size: 20 }}
                onChangeText={searchFilterFunction}
                onClear={(text) => searchFilterFunction('')}
                placeholder="Search events by location, user..."
                value={search}
              />
            }
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
      emptyListContainer: {
          alignItems: 'center',
          justifyContent: 'center',
      },
      noShalomsFound: {
          fontSize: 16,
          paddingVertical: 8,
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
