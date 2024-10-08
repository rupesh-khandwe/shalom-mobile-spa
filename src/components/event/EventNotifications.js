import {ScrollView, StyleSheet, FlatList, View, Image, Text, TouchableOpacity} from 'react-native';
import React, { useEffect, useContext, useState } from 'react';
import { COLORS } from '../../constants'; 
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import {REACT_APP_BASE_URL_API} from '@env'
import {Avatar} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const EventNotifications = () => {
  const navigation = useNavigation();
  const {userToken, userInfo}= useContext(AuthContext);
  const [filteredEventNotifyDataSource, setFilteredEventNotifyDataSource] = useState([]);
  useEffect(() => {
    //console.log("Loaded EventNotifications*************", userInfo.userId);
      axios
      .get(`${REACT_APP_BASE_URL_API}/event/notification?id=${userInfo.userId}`, {
        headers: { 'Authorization': "Bearer "+userToken, 'content-type': 'application/json'},
      })
      .then((res) => {
        setFilteredEventNotifyDataSource(res.data);
      })
      .catch((err) => console.log(err));
        
  }, []);

  const EventView = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => 
        navigation.navigate('Events',{
                                            screen: 'Event-details',
                                            params: {"eventId": item.eventId, "route":"notify"}})
      }><View style={styles.createStoryContainer}>
      
        <View style={styles.iconContainer}>
        
                  <Avatar.Image
                    size={100}
                    style={{height:140,width:100,}}
                    source={{
                      uri:
                       item.profileImageUrl==""|| item.profileImageUrl==null
                          ? 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                          : item.profileImageUrl,
                    }}
                  />
                    
        </View>
        <Text style={styles.createStory}>{item.categoryName}</Text>
    </View></TouchableOpacity>
    ); 
};

  return (
    <ScrollView
      horizontal
      style={styles.storiesContainer}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}>
        <FlatList
          data={filteredEventNotifyDataSource}
          horizontal
          keyExtractor={(item, index) => {return index.toString()}}
          renderItem={EventView}
        />
    </ScrollView> 
  );
};

const styles = StyleSheet.create({
  profileImg: {
    height: 110,
    width: 110,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  createStoryContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
    backgroundColor: COLORS.purple,
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 10,
    marginRight:10,
    height:140,
    width:100
  },
  iconContainer: {
    position: 'absolute',
    top: '55%',
    backgroundColor: COLORS.white,
    borderRadius: 50,
  },
  createStory: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 10,
    width: '80%',
  },
  storiesContainer: {
    backgroundColor: COLORS.white,
    marginTop: 8,
    padding: 15,
  },
  contentContainerStyle: {
    paddingRight: 30,
  },
  friendStoryContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
    marginLeft: 5,
    position: 'relative',
  },
  profileImgContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 50,
    height: 42,
    width: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendNameContainer: {
    position: 'absolute',
    left: 8,
    bottom: 8,
  },
  friendName: {
    color: COLORS.white,
    fontSize: 14,
  },
});

export default EventNotifications;