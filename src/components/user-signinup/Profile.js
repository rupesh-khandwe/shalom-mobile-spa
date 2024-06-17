import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { Card, Title } from 'react-native-paper'
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { StatusBar } from "expo-status-bar";
import { FontAwesome, MaterialIcons, Entypo, SimpleLineIcons } from "@expo/vector-icons";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { REACT_APP_BASE_URL_API } from '@env'
import { showMessage, hideMessage  } from "react-native-flash-message";
import ImagePicker from 'react-native-image-crop-picker';
import {Avatar} from 'react-native-paper';
import Back from 'react-native-vector-icons/Ionicons';

const Profile = ({route, navigation}) => {
  const {userInfo, userToken} = useContext(AuthContext);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [userId, setUserId]= useState('');
  const [followId, setFollowId] = useState('');
  const [followFlag, setFollowFlag] = useState(false);
  const [userName, setUserName]= useState('');
  const [followersCount, setFollowersCount]= useState('');
  const [followingsCount, setFollowingsCount]= useState('');
  const [shalomCount, setShalomCount]= useState('');
  const [showExternalFlag, setShowExternalFlag]= useState(false);
  const [city, setCity]= useState('');
  const [state, setState]= useState('');
  const [country, setCountry]= useState('');
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [filteredFollowing, setFilteredFollowing] = useState([]);
  const [profilePic, setProfilePic] = useState('');
  const followPayload = {
    userId: userId,
    followId: followId,
    followFlag: followFlag
  }
  let extUserId, extUserName, extRoute;
  const [image, setImage] = useState('');
  const profilePicObj = {
      'userId': userId,
      'profilePic': profilePic
  }

  useEffect(() => {
  console.log("Profile loaded")
      var extUserObj =  route.params
      for ( var key in extUserObj) {
         console.log(" key is : "   + key + "   and value for key is   " + extUserObj[key]);
         if(key==="extUserId")
          extUserId=extUserObj[key]
         if(key==="extUserName")
          extUserName=extUserObj[key]
         if(key==="route")
          extRoute=extUserObj[key]
         setShowExternalFlag(true);
      }
      console.log("route name=",extRoute);
       if(extRoute==="profile"){
            console.log("Profile Called from Church=",extUserObj);
            !extUserName?setUserName(userInfo.userName):setUserName(extUserName);
            const localExternalUser=!extUserId?userInfo.userId:extUserId;
            console.log("Bearer "+ userToken);//+(filteredDataSource!=null)?"Bengaluru":filteredDataSource
            setUserId(localExternalUser);
            axios
            .get(`${REACT_APP_BASE_URL_API}/shalom/profile?userId=${localExternalUser}`, {
              headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
            })
            .then((res) => {
              //console.log(res.data)
              setFollowersCount(res.data.followersCount)
              setFollowingsCount(res.data.followingsCount)
              setShalomCount(res.data.shalomCount)
              setCity(res.data.userCity)
              setState(res.data.userState)
              setCountry(res.data.userCountry)
              setImage(res.data.imageUrl);
            })
            .catch((err) => console.log(err));

            axios
            .get(`${REACT_APP_BASE_URL_API}/shalom/followers?followId=${localExternalUser}`, {
              headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
            })
            .then((res) => {
              //console.log("followers= ",res.data)
              setFilteredFollowers(res.data);
            })
            .catch((err) => console.log(err));

            axios
            .get(`${REACT_APP_BASE_URL_API}/shalom/following?userId=${localExternalUser}`, {
              headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
            })
            .then((res) => {
              //console.log("following=",res.data)
              setFilteredFollowing(res.data);
            })
            .catch((err) => console.log(err));
        }

      const unsubscribe = navigation.addListener('focus', () => {
        // The screen is focused
        // Call any action
        console.log("Profile screen inside listner")
          var extUserObj =  route.params
         // console.log("Profile screen items=",extUserObj);

            console.log(extUserId, " == ", extUserName)
            !extUserName?setUserName(userInfo.userName):setUserName(extUserName);
            const localExternalUser=!extUserId?userInfo.userId:extUserId;
            setUserId(localExternalUser);
            console.log("Bearer "+ userToken);//+(filteredDataSource!=null)?"Bengaluru":filteredDataSource

            axios
            .get(`${REACT_APP_BASE_URL_API}/shalom/profile?userId=${localExternalUser}`, {
              headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
            })
            .then((res) => {
             // console.log(res.data)
              setFollowersCount(res.data.followersCount)
              setFollowingsCount(res.data.followingsCount)
              setShalomCount(res.data.shalomCount)
              setCity(res.data.userCity)
              setState(res.data.userState)
              setCountry(res.data.userCountry)
              setImage(res.data.imageUrl);
            })
            .catch((err) => console.log(err));

            axios
            .get(`${REACT_APP_BASE_URL_API}/shalom/followers?followId=${localExternalUser}`, {
              headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
            })
            .then((res) => {
             // console.log("followers= ",res.data)
              setFilteredFollowers(res.data);
            })
            .catch((err) => console.log(err));

            axios
            .get(`${REACT_APP_BASE_URL_API}/shalom/following?userId=${localExternalUser}`, {
              headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
            })
            .then((res) => {
             // console.log("following=",res.data)
              setFilteredFollowing(res.data);
            })
            .catch((err) => console.log(err));
      });


    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const removeFollower = (followerId, rmUserId, followName)=>{
    followPayload.followId=followerId;
    followPayload.userId=rmUserId;
    //console.log(followPayload)
    axios
    .put(`${REACT_APP_BASE_URL_API}/shalom/updateFollower`, 
        followPayload,
      {headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
    })
    .then((res) => {
      setFilteredFollowers(res.data);
      setShalomCount(shalomCount-1);
        showMessage({
          message: "You are no longer following "+followName+".",
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

  const removeFollowing = (followerId, followName, rmUserId)=>{
    followPayload.followId=followerId;
    followPayload.userId=rmUserId;
    //console.log("removeFollowing= ",followPayload)
    axios
    .put(`${REACT_APP_BASE_URL_API}/shalom/updateFollowing`, 
        followPayload,
      {headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
    })
    .then((res) => {
     // console.log("Remove was success= ",res.data)
      setFilteredFollowing(res.data);
        showMessage({
          message: "You are no longer following "+followName+".",
          type: "info",
          hideOnPress: true,
          backgroundColor: "purple",
          style: styles.flashMessage
        })
    })
    .catch((err) => 
      console.log(`Login error ${err}`),
      showMessage({
        message: "Failed to save, please try-again.",
        type: "info",
        hideOnPress: true,
        backgroundColor: "purple",
        style: styles.flashMessage
      })
    ); 
  }

  const FollowerRoutes = () => (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredFollowers}
        numColumns={1}
        renderItem={({ item, index }) => (
        <Card style={{marginTop:10, borderColor:'purple', borderRadius:10, borderBottomWidth:3}}>
          <View style={{flexDirection:'row', flex:1, margin:10}}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <FontAwesome name="user-circle" size={30} color="gray" 
                onPress={()=>{
                  navigation.push('Profile',{
                    "extUserId": item.userId,
                    "extUserName": item.firstName+' '+ item.lastName
                  })
                }  } />
               {/* <Image
              key={index}
              source={item}
              style={{ width: "100%", height: "100%", borderRadius: 12 }}
            /> */}
            </TouchableOpacity>
            <View style={{justifyContent:'space-around', marginLeft:10}}>
              <Title>
                {item.firstName} {item.lastName}
              </Title>
            </View>
            {!showExternalFlag && <View style={{marginLeft:'auto'}} >
              <Entypo name="remove-user" size={24} color="purple" style={{ right: 5 }} onPress={()=>removeFollower(item.followId, item.userId, item.firstName)}/>
            </View>}
          </View>
        </Card>
        )}
      />
    </View>
  );
  
  const FollowingRoutes = () => (
    <View style={{ flex: 1 }}>
    <FlatList
      data={filteredFollowing}
      numColumns={1}
      renderItem={({ item, index }) => (
      <Card style={{marginTop:10, borderColor:'purple', borderRadius:10, borderBottomWidth:3}}>
        <View style={{flexDirection:'row', flex:1, margin:10}}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name="user-circle" size={30} color="gray" 
              onPress={()=>{
                navigation.push('Profile',{
                  "extUserId": item.followId,
                  "extUserName": item.firstName+' '+ item.lastName
                })
              } }  />
             {/* <Image  "externalUserName": item.firstName+' '+ item.lastName
            key={index} 
            source={item}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
          /> */}
          </TouchableOpacity>
          <View style={{justifyContent:'space-around', marginLeft:10}}>
            <Title>
              {item.firstName} {item.lastName}
            </Title>
          </View>
          {!showExternalFlag && <View style={{marginLeft:'auto'}}>
            <Entypo name="remove-user" size={24} color="purple" style={{ right: 5 }} onPress={()=>removeFollowing(item.followId, item.firstName+' '+ item.lastName, item.userId)}/>
          </View>}
        </View>
      </Card>
      )}
    />
  </View>
);

  
  const renderScene = SceneMap({
    first: FollowerRoutes,
    second: FollowingRoutes,
  });
  
  const selectPhoto = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: true,
      freeStyleCropEnabled: true,
    }).then(image => {
      //console.log(image);
      const data = `data:${image.mime};base64,${image.data}`;

      setProfilePic(data);
        console.log(`${REACT_APP_BASE_URL_API}/shalom/profilepic`);
        //console.log(profilePicObj);
      axios
      .put(`${REACT_APP_BASE_URL_API}/shalom/profilepic`,
          profilePicObj,
          {headers: { 'content-type': 'application/json', 'Authorization': "Bearer "+ userToken},
      })
      .then((res) => {
        //console.log(res);
            showMessage({
              message: "Profile pic is uploaded!",
              type: "info",
              hideOnPress: true,
              backgroundColor: "purple",
              style: styles.flashMessage
            })
      })
      .catch((err) => console.log(`Login error ${err}`)
      );

    });
  };

  const [routes] = useState([
    { key: "first", title: "Followers" },
    { key: "second", title: "Following" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary,
      }}
      style={{
        backgroundColor: COLORS.white,
        height: 44,
      }}
      renderLabel={({ focused, route }) => (
        <Text style={[{ color: focused ? COLORS.black : COLORS.gray }]}>
          {route.title}
        </Text>
      )}
    />
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      <StatusBar backgroundColor={COLORS.gray} />
      <View style={{ flex: 1, alignItems: "center" }}>

        <View style={styles.camDiv}>
          <View style={styles.camIconDiv}>
            <Back name="camera" size={22} style={styles.cameraIcon} />
          </View>
          <TouchableOpacity onPress={() => selectPhoto()}>
            <Avatar.Image
              size={140}
              style={styles.avatar}
              source={{
                uri:
                 image==""|| image==null
                    ? 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                    : image,
              }}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.primary,
            marginVertical: 8,
          }}
        >
          {userName}
        </Text>
        {/* <Text
          style={{
            color: COLORS.black,
            ...FONTS.body4,
          }}
        >
          Interior designer
        </Text> */}

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <MaterialIcons name="location-on" size={24} color="black" />
          <Text
            style={{
              ...FONTS.body4,
              marginLeft: 4,
            }}
          >
            {city}, {state}, {country}
          </Text>
        </View>

        <View
          style={{
            paddingVertical: 8,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: SIZES.padding,
            }}
          >
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.primary,
              }}
            >
              {followersCount}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.primary,
              }}
            >
              Followers
            </Text>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: SIZES.padding,
            }}
          >
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.primary,
              }}
            >
              {followingsCount}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.primary,
              }}
            >
              Followings
            </Text>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: SIZES.padding,
            }}
          >
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.primary,
              }}
            >
              {shalomCount}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.primary,
              }}
            >
              Shaloms
            </Text>
          </View>
        </View>

        {!showExternalFlag && <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              width: 124,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.purple,
              borderRadius: 10,
              marginHorizontal: SIZES.padding * 2,
            }}
            onPress={()=> navigation.replace('Edit-profile')}
          >
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.white,
              }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 124,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.purple,
              borderRadius: 10,
              marginHorizontal: SIZES.padding * 2,
            }}
            onPress={()=> navigation.push('Follow-user')}
          >
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.white,
              }}
            >
              Follow User
            </Text>
          </TouchableOpacity>
        </View>}
      </View>

      <View style={{ flex: 1, marginHorizontal: 22, marginTop: 20 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          
          
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: SIZES.xSmall,
    gap: SIZES.xSmall,
    borderRadius: SIZES.medium,
  },
  flashMessage: {
    borderRadius: 12,
    opacity: 0.8,
    borderWidth: 2,
    borderColor: '#222',
    margin: 18
  },
  avatar: {
      borderRadius: 80,
      marginTop: 2,
      backgroundColor: 'white',
      height: 160,
      width: 160,
      padding: 8,
      borderColor: '#ccc',
      borderWidth: 1,
      elevation: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    camDiv: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    camIconDiv: {
      position: 'absolute',
      right: 21,
      zIndex: 1,
      bottom: 5,
      height: 36,
      width: 36,
      backgroundColor: '#0163D2',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 18,
    },
    cameraIcon: {
      color: 'white',
    },
});
