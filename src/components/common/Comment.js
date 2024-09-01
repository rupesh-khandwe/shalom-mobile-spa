import React, {useRef, useState, createContext, useContext, useEffect} from 'react'
import { View, Text, Platform, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import ImgToBase64 from 'react-native-image-base64';
import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesome, AntDesign } from '@expo/vector-icons'; 
import { Card, Title } from 'react-native-paper'
export const EditorContext = createContext();
import axios from 'axios';
import { REACT_APP_BASE_URL_API } from '@env'
import HTMLView from 'react-native-htmlview';
import {Avatar} from 'react-native-paper';
import { FONTS } from "../../constants/theme";
import moment from "moment";
import Share from 'react-native-share';

const handleHead = ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>
const Comment = ({route, navigation}) => {

  const {userToken, userInfo}= useContext(AuthContext);
	const richText = useRef();
  const {editorData} = useContext(AuthContext);
  const [likeFlag, setLikeFlag] = React.useState(true);
  const [item, setItem] = useState({});
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const register = route.params;
  const [shareImage, setShareImage] = useState('');
  useEffect(()=>{
    setItem(route.params);
    //Comments API call
    console.log("comment ***",register.shalomId);
    axios
    .get(`${REACT_APP_BASE_URL_API}/shalom/comment?id=${register.shalomId}`, {
      headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
    })
    .then((res) => {
        setFilteredDataSource(res.data);
    })
    .catch((err) => console.log(err));
  }, []);

  const likeFlow = (shalomId, slikeFlag) => {
      axios
      .put(`${REACT_APP_BASE_URL_API}/shalom/saveLike`, null, {
          params: { userId: userId, shalomId: shalomId, likeFlag: slikeFlag },
          headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
      })
      .then((res) => {
          setFilteredDataSource(res.data);
          //setMasterDataSource(res.data);
      })
      .catch((err) => console.log(err)); 
  };


  const onShare = async (message, imageUrl) => {
    try {
      imageUrl?getBase64(imageUrl):"";
      const result = await Share.open({
        message: message,
        url: shareImage
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log("shared with activityr", result);
        } else {
          // shared
          console.log("shared ",result);
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("dismissed ",result.action);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  
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


    const pickImage =()=> {
        ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
        }).then((image) => {
            console.log("Imagemime", image); 
            getBase64(image)
        });
      }

      function insertVideo() {
        // you can easily add videos from your gallery
        ImagePicker.openCamera({
          mediaType: 'video',
        }).then(image => {
          console.log(image);
          //getBase64(image)
        });
      }

      const getBase64 = (image)=> {
        ImgToBase64.getBase64String(image)
        .then(base64String => {
            const mime='image/jpeg'
            const imageData = `data:${mime};base64,${base64String}`
            setShareImage(imageData)
        })
        .catch(err => console.log(err));
      };
   
    const ItemView = ({ item }) => {
      return (
      <Card style={{margin:10, borderColor:'purple', borderRadius:10, borderBottomWidth:2}}>
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
                                 item.imageUrl==""|| item.imageUrl==null
                                    ? 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                                    : item.imageUrl,
                              }}
                            />
                    </TouchableOpacity>
                </View>
                <View style={{ marginLeft:5, }}>
                  <Title>{item.userName}</Title>
                  <Text style={{...FONTS.body5}}>Posted on {moment(item.createdOn).format("MMMM D")}</Text>
                </View>

              {/*  Image */}
          </View>
          <View style={{margin:10}}>
            <HTMLView value={item.shalomComment}></HTMLView>
              {/* <Text>Shalom posted on : {item.createdOn}</Text> */}
          </View>
      </Card>
      ); 
  };


	return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
<View>
<Card style={{marginTop:10, borderColor:'black', borderRadius:5, borderBottomWidth:1}}>
            <View style={{flexDirection:'row', flex:1}}>
               
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
                <View style={{justifyContent:'space-around', marginLeft:5}}>
                  <Title>{item.userName}</Title>
                  <Text style={{...FONTS.body5}}>Posted on {moment(item.shalomCreatedOn).format("MMMM D")}</Text>
                </View>
         
            </View>
            <View style={{margin:10}}>
              <Text>{item.shalom}</Text>
    
            </View>
            {item.videoUrl && 
                <View style={styles.container}>
                    <Video
                        ref={video}
                        style={styles.video}
                        source={{
                        uri: item.videoUrl,
                        }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                        onPlayb ackStatusUpdate={status => setStatus(() => status)}
                    />
                </View>
            }
            {item.imageUrl &&
                <Image
                    style={{width: '100%', height: 200,resizeMode : 'stretch' }}
                    source={{uri: item.imageUrl}} 
                />        
            }
            <View style={{flexDirection:'row', margin:10}}>
                    <Text style={{paddingLeft:5}} 
                        onPress={()=> {
                            item.likeFlag=(item.likeFlag===null || !item.likeFlag)?true:false;
                            setLikeFlag(item.likeFlag)
                            alert(item.likeFlag)
                            likeFlow(item.shalomId, item.likeFlag)
                          }
                        } 
                    >
                      <AntDesign 
                        name={item.likeFlag===null || !item.likeFlag ? "like1": "like2"} 
                        size={24} 
                        color={item.likeFlag===null || !item.likeFlag ?"purple":"gray"}  
                      />
                    </Text>
                    {/* <Text style={{paddingLeft:45}} onPress={()=> navigation.navigate('Comment', {"userId": userId ,"userName": item.userName, "shalomId": item.shalomId, "shalom": item.shalom, "imageUrl": item.imageUrl, "likeCount": item.likeCount, "likeFlag": item.likeFlag} )}><FontAwesome name={item.commentCount>0 ? "comments-o": "comments"} size={24} color={item.commentCount>0 ?"purple":"gray"}   /></Text> */}
                    <Text style={{paddingLeft:30}} onPress={()=>onShare(item.shalom,item.imageUrl)}><FontAwesome name="share-square" size={24} color="gray"   /></Text>
                    {/* item.likeFlag=item.likeFlag===null?true:item.likeFlag===true?false:true; setLikeFlag(item.likeFlag); */}
            </View>
            <View style={{flexDirection:'row', margin:10}}>

                    <Text style={{paddingLeft:5}} >{item.likeCount} Like</Text>
                    {/* <Text style={{paddingLeft:45}} >{register.commentCount} Comment</Text> */}
            </View> 
            
        </Card>
</View>
<View>
<Text style={{margin:5  }} >Top comments:</Text>
<FlatList
              data={filteredDataSource}
              keyExtractor={(e, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={ItemView}
            />
</View>
<View>





        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}	style={styles.rich}>
          <RichEditor
              placeholder={"Post a comment here..."}
              ref={richText}
              style={styles.rich}
              onChange={ (descriptionText) => {
                editorData(descriptionText, register.shalomId);
              }}
          />
        </KeyboardAvoidingView></View>
      </ScrollView>

    <View style={{position: 'absolute', bottom: 1}}>
      <RichToolbar
        editor={richText}
        iconTint={"gray"}
        selectedIconTint={"purple"}
        iconSize={20}
        actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1 ]}
        // onPressAddImage={()=>{
        //     pickImage();
        // }}
        // insertVideo={insertVideo}
        iconMap={{ [actions.heading1]: handleHead
        }}
      />
    </View>
    </SafeAreaView>
  );
};
export default Comment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "#F5FCFF",
  },
  editor: {
    backgroundColor: "black",
    borderColor: "black",
    borderWidth: 1,
  },
  rich: {
    minHeight: 100,
    flex: 1,
  },
  richBar: {
    height: 50,
    backgroundColor: "#F5FCFF",
  },
  commentContainer: {
    marginTop: 6,
    backgroundColor: '#d3d3d3e0',
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    width: 300,
    //cursor: pointer,
    borderRadius: 5,
  },
  avatar: {
    borderRadius: 40,
    marginTop: 5,
    marginLeft: 10,
    backgroundColor: 'white',
    height: 40,
    width: 40,
    borderColor: '#ccc',
    borderWidth: 0,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
},
});