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
import { BASE_URL_API } from '@env'

const handleHead = ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>
const Comment = ({route, navigation}) => {

  const {userToken, userInfo}= useContext(AuthContext);
	const richText = useRef();
  const {editorData} = useContext(AuthContext);
  const [likeFlag, setLikeFlag] = React.useState(true);
  const [item, setItem] = useState({});
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const register = route.params;
  useEffect(()=>{
    setItem(route.params);
    //Comments API call
    console.log("comment ***",register.shalomId);
    axios
    .get(`${BASE_URL_API}/comment?id=${register.shalomId}`, {
      headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
    })
    .then((res) => {
        setFilteredDataSource(res.data);
    })
    .catch((err) => console.log(err));
  }, []);

  const likeFlow = (shalomId, slikeFlag) => {
      axios
      .put(`${BASE_URL_API}/saveLike`, null, {
          params: { userId: userId, shalomId: shalomId, likeFlag: slikeFlag },
          headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
      })
      .then((res) => {
          setFilteredDataSource(res.data);
          //setMasterDataSource(res.data);
      })
      .catch((err) => console.log(err)); 
  };


  const onShare = async () => {
    try {
      const result = await Share.open({
        message:
          'Share your favorite shaloms to the world',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
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
        ImgToBase64.getBase64String(image.path)
        .then(base64String => {
            const imageData = `data:${image.mime};base64,${base64String}`
            if("image/jpeg"===image.mime){
              richText.current?.insertImage(
                imageData
              );
            } else {
              richText.current?.insertVideo(
                imageData
              );
            }
        })
        .catch(err => console.log(err));
    };
   
    const ItemView = ({ item }) => {
      return (
      <Card style={{margin:10, borderColor:'purple', borderRadius:10, borderBottomWidth:2}}>
          <View style={{flexDirection:'row', flex:1}}>
              {/*  Text */}
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <FontAwesome name="user-circle" size={30} color="gray"   />
                </TouchableOpacity>
              <View style={{justifyContent:'space-around', marginLeft:5}}>
                <Title>{item.userName}</Title>
              </View>
              {/*  Image */}
          </View>
          <View style={{margin:10}}>
            <Text>{item.shalomComment}</Text>
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
               
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <FontAwesome name="user-circle" size={30} color="gray"   />
                  </TouchableOpacity>
                <View style={{justifyContent:'space-around', marginLeft:5}}>
                  <Title>{item.userName}</Title>
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
                    <Text style={{paddingLeft:45}} onPress={()=> navigation.navigate('Comment', {"userId": userId ,"userName": item.userName, "shalomId": item.shalomId, "shalom": item.shalom, "imageUrl": item.imageUrl, "likeCount": item.likeCount, "likeFlag": item.likeFlag} )}><FontAwesome name={item.commentCount>0 ? "comments-o": "comments"} size={24} color={item.commentCount>0 ?"purple":"gray"}   /></Text>
                    <Text style={{paddingLeft:45}} onPress={onShare}><FontAwesome name="share-square" size={24} color="gray"   /></Text>
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
  }
});