import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  ImageBackground,
} from 'react-native';
import { Card, Title } from 'react-native-paper'
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { StatusBar } from "expo-status-bar";
import { FontAwesome, MaterialIcons, Entypo, SimpleLineIcons } from "@expo/vector-icons";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL_API } from '@env'


const Profile = ({navigation}) => {
  const {userInfo, userToken} = useContext(AuthContext);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [userId, setUserId]= useState('');
  const [userName, setUserName]= useState('');
  const [followersCount, setFollowersCount]= useState('');
  const [followingsCount, setFollowingsCount]= useState('');
  const [shalomCount, setShalomCount]= useState('');
  const [city, setCity]= useState('');
  const [state, setState]= useState('');
  const [country, setCountry]= useState('');
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [filteredFollowing, setFilteredFollowing] = useState([]);

  useEffect(() => {   
    console.log("Profile use effect hook")
    setUserId(userInfo.userId);
    setUserName(userInfo.userFirstName+" "+ userInfo.userLastName);
    console.log("Bearer "+ userToken);//+(filteredDataSource!=null)?"Bengaluru":filteredDataSource

    axios
    .get(`${BASE_URL_API}/profile?userId=${userInfo.userId}`, {
      headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
    })
    .then((res) => {
      console.log(res.data)
      setFollowersCount(res.data.followersCount)
      setFollowingsCount(res.data.followingsCount)
      setShalomCount(res.data.shalomCount)
      setCity(res.data.userCity)
      setState(res.data.userState)
      setCountry(res.data.userCountry)
    })
    .catch((err) => console.log(err));

    axios
    .get(`${BASE_URL_API}/followers?userId=${userInfo.userId}`, {
      headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
    })
    .then((res) => {
      console.log(res.data)
      setFilteredFollowers(res.data);
    })
    .catch((err) => console.log(err));

    axios
    .get(`${BASE_URL_API}/following?followId=${userInfo.userId}`, {
      headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
    })
    .then((res) => {
      console.log(res.data)
      setFilteredFollowing(res.data);
    })
    .catch((err) => console.log(err));


  }, []);


  const PhotosRoutes = () => (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredFollowers}
        numColumns={1}
        renderItem={({ item, index }) => (
        <Card style={{marginTop:10, borderColor:'purple', borderRadius:10, borderBottomWidth:3}}>
          <View style={{flexDirection:'row', flex:1, margin:10}}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <FontAwesome name="user-circle" size={30} color="gray"   />
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
            <View style={{marginLeft:'auto'}} >
              <Entypo name="remove-user" size={24} color="purple" style={{ right: 5 }}/>
            </View>
           
          </View>
        </Card>
        )}
      />
    </View>
  );
  
  const LikesRoutes = () => (
    <View style={{ flex: 1 }}>
    <FlatList
      data={filteredFollowing}
      numColumns={1}
      renderItem={({ item, index }) => (
      <Card style={{marginTop:10, borderColor:'purple', borderRadius:10, borderBottomWidth:3}}>
        <View style={{flexDirection:'row', flex:1, margin:10}}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name="user-circle" size={30} color="gray"   />
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
          <View style={{marginLeft:'auto'}}>
            <Entypo name="remove-user" size={24} color="purple" style={{ right: 5 }}/>
          </View>
        </View>
      </Card>
      )}
    />
  </View>
);

  
  const renderScene = SceneMap({
    first: PhotosRoutes,
    second: LikesRoutes,
  });
  


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
      <View style={{ width: "100%" }}>
        {/* <Image
          source={""}
          resizeMode="cover"
          style={{
            height: 228,
            width: "100%",
          }} 
        />*/}
      </View>

      <View style={{ flex: 1, alignItems: "center" }}>
        {/* <Image
          source={""}
          resizeMode="contain"
          style={{
            height: 155,
            width: 155,
            borderRadius: 999,
            borderColor: COLORS.primary,
            borderWidth: 2,
            marginTop: -90,
          }}
        /> */}
           <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <ImageBackground
                source={require('../../assets/images/user-profile.jpg')}
                style={{width: 155, height: 155,}}
                imageStyle={{borderRadius: 999,  borderWidth: 2,}}
              />
            </TouchableOpacity>

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

        <View style={{ flexDirection: "row" }}>
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
            onPress={()=> navigation.navigate('Follow-user')}
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
        </View>
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
