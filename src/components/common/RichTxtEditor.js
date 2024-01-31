import React, {useRef, useState, createContext, useContext} from 'react'
import { View, Text, Platform, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import ImgToBase64 from 'react-native-image-base64';
import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../../context/AuthContext';
export const EditorContext = createContext();

const handleHead = ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>
const RichTxtEditor = ({}) => {
	const richText = useRef();
  const {editorData} = useContext(AuthContext);

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
   

	return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}	style={styles.rich}>
          <RichEditor
              ref={richText}
              style={styles.rich}
              onChange={ (descriptionText) => {
                editorData(descriptionText);
              }}
          />
        </KeyboardAvoidingView>
      </ScrollView>

    <View style={{position: 'absolute', bottom: 1}}>
      <RichToolbar
        editor={richText}
        iconTint={"gray"}
        selectedIconTint={"purple"}
        iconSize={30}
        actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1, actions.insertImage, actions.insertVideo ]}
        onPressAddImage={()=>{
            pickImage();
        }}
        insertVideo={insertVideo}
        iconMap={{ [actions.heading1]: handleHead
        }}
      />
    </View>
    </SafeAreaView>
  );
};
export default RichTxtEditor;

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
    minHeight: 300,
    flex: 1,
  },
  richBar: {
    height: 50,
    backgroundColor: "#F5FCFF",
  }
});