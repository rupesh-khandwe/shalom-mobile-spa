import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import { SIZES, COLORS } from "../../constants"; 
import { Card, Title, Paragraph } from 'react-native-paper'
import { AuthContext } from '../../context/AuthContext';
import { FontAwesome, Entypo } from "@expo/vector-icons";
import {REACT_APP_BASE_URL_API} from '@env'
import { showMessage, hideMessage  } from "react-native-flash-message";
import {Avatar} from 'react-native-paper';

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
        const unsubscribe = navigation.addListener('focus', () => {
        axios
        .get(`${REACT_APP_BASE_URL_API}/shalom/users?userId=${userInfo.userId}`, {
          headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
        })
        .then((res) => {
            setFilteredDataSource(res.data);
            setMasterDataSource(res.data);
        })
        .catch((err) => console.log(err));
      });
      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }, [navigation]);

      const searchFilterFunction = (text) => {
        if (text) {
          const newData = masterDataSource.filter(function (item) {
            const itemData = item.userName.toString().toLowerCase();
            const textData = text.toString().toLowerCase();
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
      //  console.log(followPayload);
        axios
        .put(`${REACT_APP_BASE_URL_API}/shalom/saveFollow`,
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
          <TouchableOpacity onPress={() => {
                                navigation.push('Profile',{
                                  "extUserId": item.userId,
                                  "extUserName": item.userName
                                })
                   }}>
                <Avatar.Image
                  size={40}
                  style={styles.avatarFollow}
                  source={{
                    uri:
                      item.profilePic==""|| item.profilePic==null
                        ? 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                        : item.profilePic,
                  }}
                />
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
      <ScrollView style={{padding: 3}}>
        <View style={styles.container}>
         
          <FlatList
            data={filteredDataSource}
            keyExtractor={(item, index) => item.userId}
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
    },
    avatarFollow: {
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
