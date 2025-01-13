import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper'
import { FONTS } from "../../constants/theme";
import { MaterialIcons, FontAwesome, Entypo, MaterialCommunityIcons  } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from "moment";
import Carousel from 'react-native-reanimated-carousel';
import {Avatar} from 'react-native-paper';

export default function ChurchDetails({route, navigation}) {
  const [churchName, setChurchName] = useState('');
  const [churchWebsiteUrl, setChurchWebsiteUrl] = useState('');
  const [aboutChurch, setAboutChurch] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [addressline1, setAddressline1] = useState('');
  const [addressline2, setAddressline2] = useState('');
  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [regionName, setRegionName] = useState('');
  const [userId, setUserId] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [languageName, setLanguageName] = useState('');
  const [createdOn, setCreatedOn] = useState(null);
  const [images, setImages] = useState([]);
  const width = Dimensions.get('window').width;
  const ratio = width/341; //341 is actual image width

  useEffect(() => {
    var params = route.params
    !params && setCreatedOn(moment.utc().toISOString());
    console.log("Church details launched");

    if(params && params.userId){
      setUserId(params.userId)
      setChurchName(params.churchName)
      setChurchWebsiteUrl(params.churchWebsiteUrl)
      setAboutChurch(params.aboutChurch)
      setPhone1(params.phone1)
      setPhone2(params.phone2)
      setAddressline1(params.addressLine1)
      setAddressline2(params.addressLine2)
      setStateName(params.stateName);
      setCityName(params.cityName)
      setRegionName(params.regionName)
      setCreatedOn(params.createdOn)
      setCreatedBy(params.createdBy)
      setProfileImageUrl(params.profileImageUrl)
      setLanguageName(params.languageName)
      let churchImg = [];
      params.churchImageUrl?.split('|').map((img) => {
        console.log("img==", img);
        churchImg.push(img)
      });
      setImages(churchImg);
    }
  }, []);

  const _renderItem = ({item, index}) =>{
    console.log("Image == ", item);
    return (
        <View key={index}>
            <Image
                style={{
                  width: width,
                  height: 362 * ratio,
                }}
                resizeMode="contain" 
                source={{uri: item}
                }
              />
        </View>
    )
  }

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center', marginTop: 30, marginBottom: 20}}>
            <MaterialIcons name="event" size={50} color="purple" />
        </View>

        <Card style={{marginTop:10, borderColor:'purple', borderRadius:10, borderBottomWidth:3, flexGrow: 1}}
        >
             <View style={{flexDirection:'row', flex:1}}>
                {/*  Text */}
                <View style={{ marginTop:5, }}>
                    <TouchableOpacity onPress={() => {
                                            navigation.navigate('HomeStack',{
                                            screen: 'Profile',
                                            params: { "extUserId": userId,"extUserName": createdBy, "route": "profile"} })
                                          }}>
                            <Avatar.Image
                              size={40}
                              style={styles.avatar}
                              source={{
                                uri:
                                 profileImageUrl==""|| profileImageUrl==null
                                    ? 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                                    : profileImageUrl,
                              }}
                            />
                    </TouchableOpacity>
                </View>
                <View style={{ marginLeft:5, }}>
                  <Title>{createdBy}</Title>
                  <Text style={{...FONTS.body5}}>Posted on {moment(createdOn).format("MMMM D")}</Text>
                </View>
            </View>
            {images != null && images.length > 0 && images[0] !=null &&  
            <View style={{ flex: 1, marginTop: 5 }}>
              <Carousel
                  loop
                  width={width}
                  height={362 * ratio}
                  autoPlay={true}
                  data={images}
                  mode="advanced-parallax"
                  parallaxScrollingScale={0.9}
                  parallaxScrollingOffset={50}
                  scrollAnimationDuration={1000}
                  renderItem={_renderItem}
              />
            </View>}
        <View style={{flexDirection:'row',}}>
                {/*  Text */}
                <View style={{justifyContent:'space-around', flex:2/3, margin:10}}>
                  <Title> {churchName}</Title>
                </View>
            </View>
            <View style={{margin:10}}>
                <Text><Entypo name="language" size={24} color="purple" />  {languageName}</Text>
                <Paragraph> <MaterialCommunityIcons name="details" size={20} color="purple" style={{marginRight: 5}}/>  {aboutChurch}</Paragraph>
                <Text><MaterialIcons name="language" size={24} color="purple" />  {churchWebsiteUrl}</Text>
                <Paragraph><FontAwesome name="address-card" size={21} color="purple" /> {addressline1}, {addressline2}, {cityName}, {stateName}</Paragraph>
{/*                 <Text><Ionicons name="time-sharp" size={24} color="purple" /> {churchTime}</Text> */}
                <Text><FontAwesome name="phone-square" size={24} color="purple" /> {phone1}, {phone2}</Text>
            </View>

        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
