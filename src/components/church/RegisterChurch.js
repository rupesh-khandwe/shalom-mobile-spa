import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Keyboard, 
  Text,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import InputField from '../common/InputField';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../common/CustomButton';
import { FontAwesome5, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'; 
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import {REACT_APP_BASE_URL_API, REACT_APP_LOCATION_API} from '@env'
import { showMessage  } from "react-native-flash-message";
import moment from "moment";
import ImagePicker from 'react-native-image-crop-picker';
import { imageUpload } from '../../assets/images';
import Carousel from 'react-native-reanimated-carousel';
import ImgToBase64 from 'react-native-image-base64';
import {getCountryList, getStateList} from "../common/Utils";

export default function RegisterChurch({route,navigation}) {
  const defaultCountryId = 78; //India
  const {userToken, userInfo}= useContext(AuthContext);
  const [churchWebsiteUrl, setChurchWebsiteUrl] = useState('');
  const [churchName, setChurchName] = useState('');
  const [aboutChurch, setAboutChurch] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [addressline1, setAddressline1] = useState('');
  const [addressline2, setAddressline2] = useState('');
  const [countryId, setCountryId] = useState(defaultCountryId);
  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [regionId, setRegionId] = useState('');
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [countryName, setCountryName] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [regionName, setRegionName] = useState('');
  const [cityEdit, setCityEdit] = useState(true);
  const [stateEdit, setStateEdit] = useState(true);
  const [regionEdit, setRegionEdit] = useState(true);
  const [userId, setUserId] = useState([]);
  const [churchId, setChurchId] = useState(null);
  const [createdBy, setCreatedBy] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [errors, setErrors] = useState({});
  const [createdOn, setCreatedOn] = useState(null);
  const [updatedOn, setUpdatedOn] = useState(null);
  const [imageUrl, setImageUrl] = useState([]);
  const [images, setImages] = useState([]);
  const [languageEdit, setLanguageEdit] = useState(true);
  const [languageId, setLanguageId] = useState(null);
  const [languageName, setLanguageName] = useState(null);
  const [languageData, setLanguageData] = useState([]);
  const width = Dimensions.get('window').width;
  let imageList = [];
  let imageDataList = [];
  const church_model = {
    'churchId': churchId,
    'userId': userId,
    'churchName': churchName,
    'churchWebsiteUrl': churchWebsiteUrl,
    'aboutChurch': aboutChurch,
    'phone1': phone1,
    'phone2': phone2,
    'addressline1': addressline1,
    'addressline2': addressline2,
    'countryId': countryId,
    'stateId': stateId,
    'cityId': cityId,
    'regionId': regionId,
    'createdBy': createdBy,
    'createdOn': createdOn,
    'updatedOn': updatedOn,
    'imageUrl': imageUrl,
    'languageId': languageId
  }


  useEffect(() => {
    //const updateChurch = route.params;
    var params = route.params
    console.log("route.params",params);
    setUserId(userInfo.userId);
    //setCreatedBy(userInfo.userName);
    setCreatedBy(!userInfo.firstName && !userInfo.lastName?userInfo.userName:userInfo.firstName+ " "+userInfo.lastName)
    !params && setCreatedOn(moment.utc().toISOString());
    //console.log("updating church for existing",params.churchId,params.userId ,params.churchName,  params.addressline1,  params.addressline2, params.phone1,  params.phone2,  params.countryId,  params.regionId, params.stateId,  params.cityId, params.churchWebsiteUrl);
    console.log("Current date ", moment(new Date()).format("YYYY-MM-DD'T'HH:mm:ss.SSS"));
    console.log("Current date1 ", moment.utc().toISOString())
    console.log("Registration launched"+REACT_APP_LOCATION_API);

    axios
    .get(`${REACT_APP_BASE_URL_API}/church/language`, {
        headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
    })
    .then((res) => {
      var count = Object.keys(res.data).length;
      let languageArray = [];
      for (var i = 0; i < count; i++) {
        languageArray.push({
          value: res.data[i].languageId,
          label: res.data[i].languageName,
        });
      }
      setLanguageData(languageArray);
    })
    .catch((err) => console.log(err));


    handleState(defaultCountryId);
    getCountryList(function(list) {
      setCountryData(list);
    });

    if(params && params.churchId){
      setStateEdit(false);
      setCityEdit(false);
      setRegionEdit(false);
      setChurchId(params.churchId)
      setChurchWebsiteUrl(params.churchWebsiteUrl);
      setAboutChurch(params.aboutChurch)
      setChurchName(params.churchName);
      setPhone1(params.phone1);
      setPhone2(params.phone2);
      setAddressline1(params.addressline1);
      setAddressline2(params.addressline2);
      setUpdatedOn(moment.utc().toISOString());
      setCountryId(params.countryId);
      setStateId(params.stateId);
      setStateName(params.stateName);
      setCityId(params.cityId);
      setCityName(params.cityName)
      setRegionId(params.regionId);
      setRegionName(params.regionName)
      setCreatedOn(params.createdOn)
      setLanguageId(params.languageId)
      setLanguageName(params.languageName)
      setLanguageEdit(false)
      let churchImg = [];
      params.churchImageUrl?.split('|').map((img) => {
        churchImg.push(img)
      });
      console.log("images", churchImg);
      setImages(churchImg);
      //Load state
      getStateList(params.countryId, (stateArray) => {
        setStateData(stateArray);
      });
    }


  }, []);

  const validateForm = () =>{
    Keyboard.dismiss();
    let errors = {};
    const requireFieldMsg = " Required field*";
    const regexPhone = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
    if(!churchName) errors.churchName = requireFieldMsg;

    if(!phone1){
      errors.phone1 = requireFieldMsg;
    } else if(!regexPhone.test(phone1)){
      errors.phone1 = "Invalid phone1";
    }
    if(phone2){
      if(!regexPhone.test(phone2)) errors.phone2 = "Invalid phone2";
    }
    if(!addressline1) errors.addressline1 = requireFieldMsg;
    if(!countryId) errors.countryId = "Please select country";
    if(!stateId) errors.stateId = "Please select state";
    if(!cityId) errors.cityId = "Please select city";
    if(!regionId) errors.regionId = "Please select region";
    setErrors(errors);
    return Object.keys(errors).length === 0;
}

const handleSubmit = () =>{
  if(validateForm()){
    setChurchName("");
    setPhone1("");
    setAddressline1("");
    setCountryId("");
    setStateId("");
    setCityId("");
    setRegionId("");
    setErrors({});
    handleRegister();
  }
}

  const handleState = countryCode => {
    var config = {
      method: 'get',
      url: `${REACT_APP_LOCATION_API}/StateList?countryId=${countryCode}`,
      headers: {
        'content-type': 'application/json',
      },
    };

    axios(config)
      .then(function (response) {
        var count = Object.keys(response.data).length;
        let stateArray = [];
        for (var i = 0; i < count; i++) {
          stateArray.push({
            value: response.data[i].stateId,
            label: response.data[i].stateName,
          });
        }
        setStateData(stateArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCity = (countryCode, stateCode) => {
    console.log(countryCode+"=="+stateCode);
    setCityEdit(true)
    var config = {
      method: 'get',
      url: `${REACT_APP_LOCATION_API}/CityList?stateId=${stateCode}&countryId=${countryCode}`,
      headers: {
        'content-type': 'application/json',
      },
    };

    axios(config)
      .then(function (response) {
        var count = Object.keys(response.data).length;
        let cityArray = [];
        for (var i = 0; i < count; i++) {
          cityArray.push({
            value: response.data[i].cityId,
            label: response.data[i].cityName,
          });
        }
        setCityData(cityArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleRegion = (cityCode) => {
    setRegionEdit(true);
    var config = {
      method: 'get',
      url: `${REACT_APP_LOCATION_API}/RegionList?cityId=${cityCode}`,
      headers: {
        'content-type': 'application/json',
      },
    };

    axios(config)
      .then(function (response) {
        var count = Object.keys(response.data).length;
        let regionArray = [];
        for (var i = 0; i < count; i++) {
          regionArray.push({
            value: response.data[i].regionId,
            label: response.data[i].regionName + " - " + response.data[i].pincode,
          });
        }
        setRegionData([...regionArray]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleRegister = () => {
    console.log(handleRegister);
    axios
    .post(`${REACT_APP_BASE_URL_API}/church/register`, 
      church_model,
      {headers: { 'content-type': 'application/json', 'Authorization': "Bearer "+ userToken},
      })
    .then((res) => {
      navigation.replace('Church', 
      "success"
    );
    })
    .catch((err) => showMessage({
      message: "Unable to register church, please try again.",
      type: "info",
      hideOnPress: true,
      backgroundColor: "red",
    })); 
  };

  const regionOnSearchLoad = (item) =>{
    console.log("item= ", cityId);
    console.log(item);
    axios
    .get(`${REACT_APP_LOCATION_API}/RegionsByKey?cityId=${cityId}&key=${item}`, {
      headers: {
        'content-type': 'application/json',
      },
    })
    .then((res) => {
      var count = Object.keys(res.data).length;
      let regionArray = [];
      for (var i = 0; i < count; i++) {
        regionArray.push({
          value: res.data[i].regionId,
          label: res.data[i].regionName + " - " + res.data[i].pincode,
        });
      }
      console.log("regionArray", regionArray)
      setRegionData([...regionArray, ...regionData])
    })
    .catch((err) => console.log(err));
  }

  const openImagePicker = () => {
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 3,
      width: 300,
      height: 400,
      cropping: true,
      waitAnimationEnd: false,
      forceJpg: true,
      mediaType: 'photo',
      includeBase64: true
    })
    .then(res => {
      res.map(image=>{
        imageList.push({
            path: image.path,
            data: image.data
      });
      console.log("image.path  = ",image.path)
      getBase64(image)
      //imageDataList.push(image.data);
    })
      setImages(imageList);
      setImageUrl(imageDataList);
    })
    .catch(e => console.log('Error: ', e.message));
  };
  
  const _renderItem = ({item, index}) =>{
    return (
        <View key={index}>
            <Image
                style={{
                    width: '90%',
                    borderRadius: 0,
                    height: 400,
                }}
                source={{uri: item?item.path?item.path:item:""}
                }
              />
        </View>
    )
  }

  const getBase64 = (image)=> {
    ImgToBase64.getBase64String(image.path)
    .then(base64String => {
        const imageData = `data:${image.mime};base64,${base64String}`
        if("image/jpeg"===image.mime){
         // console.log("image/jpeg imageData ==",imageData);
          imageDataList.push(imageData);
        } 
    })
    .catch(err => console.log(err));
};

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center', marginTop: 30, marginBottom: 20}}>
        <FontAwesome5 name="church" size={50} color="purple" />
        </View>

        <InputField
          label={'Church Name*'}
          icon={
            <MaterialCommunityIcons
              name="church"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setChurchName(text)}}
          value={churchName}
          error={errors.churchName}
        />

    {!languageEdit && 
        <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
        >
        <InputField
          label={'State'}
          editable={false}
          icon={
            <FontAwesome5 name="city" size={20} color="black" style={{margin: 5}}/>
          }
          onChangeText={(text) => {setLanguageName(text)}}
          value={" "+languageName}
          error={errors.languageName}
          fieldButtonLabel={<FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>setLanguageEdit(true)}
        />

      </View>
      }
      
      {languageEdit &&

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
          placeholder={!isFocus ? 'Select church language*' : '...'}
          searchPlaceholder="Search..."
          value={languageId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setLanguageId(item.value);
            //setCategoryName(item.label);
            setIsFocus(false);
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
          />}
          {
            errors.languageId ? (<Text style={styles.errorText}>{errors.languageId}</Text>):null
          }

      <TouchableOpacity onPress={openImagePicker}>
          <View style={styles.uploadContainer}>
              <View style={styles.imageContainer}>
                <Image source={imageUpload} style={styles.image} />
                <InputField
                  editable={false}
                  label={'Click to upload church pictures'}
                />
              
              </View>
            </View>
        </TouchableOpacity>
        {images?.length > 0 &&
            <View style={{ flex: 1 }}>
                  <Carousel
                      loop
                      width={width}
                      height={350}
                      autoPlay={true}
                      data={images}
                      mode="advanced-parallax"
                      parallaxScrollingScale={0.9}
                      parallaxScrollingOffset={50}
                      scrollAnimationDuration={1000}
                      renderItem={_renderItem}
                  />
            </View>
          } 

        <InputField
          label={'About church...'}
          icon={
            <MaterialCommunityIcons
              name="details"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          inputMultiline={true}
          numberofLines={4}
          onChangeText={(text) => {setAboutChurch(text)}}
          value={aboutChurch}
        />


        <InputField
          label={'Church web-site url'}
          icon={
            <MaterialCommunityIcons
              name="web"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          keyboardType="email-address"
          onChangeText={(text) => {setChurchWebsiteUrl(text)}}
          value={churchWebsiteUrl}
        />

        <InputField
          label={'Phone-1*'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setPhone1(text)}}
          value={phone1}
          error={errors.phone1}
        />
        <InputField
          label={'Phone-2'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setPhone2(text)}}
          value={phone2}
        />

        <InputField
          label={'Address Line 1*'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setAddressline1(text)}}
          value={addressline1}
          error={errors.addressline1}
        />
        <InputField
          label={'Address Line 2'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setAddressline2(text)}}
          value={addressline2}
        />

        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'black'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={countryData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select country*' : '...'}
          searchPlaceholder="Search..."
          value={countryId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCountryId(item.value);
            handleState(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? '#AD40AF' : 'black'}
              name="Safety"
              size={20}
            />
          )}
          error={errors.countryId}
          />
          {
            errors.countryId ? (<Text style={styles.errorText}>{errors.countryId}</Text>):null
          }
    {!stateEdit && 
        <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
        >
        <InputField
          label={'State'}
          editable={false}
          icon={
            <FontAwesome5 name="city" size={20} color="black" style={{margin: 5}}/>
          }
          onChangeText={(text) => {setStateName(text)}}
          value={" "+stateName}
          error={errors.stateName}
          fieldButtonLabel={<FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>setStateEdit(true)}
        />

      </View>
      }
      
      {stateEdit &&
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'black'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={stateData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select state*' : '...'}
          searchPlaceholder="Search..."
          value={stateId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setStateId(item.value);
            handleCity(countryId, item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? '#AD40AF' : 'black'}
              name="Safety"
              size={20}
            />
          )}
          error={errors.stateId}
          />}
          {
            errors.stateId ? (<Text style={styles.errorText}>{errors.stateId}</Text>):null
          }

      {!cityEdit && 
        <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <InputField
          label={'City'}
          editable={false}
          icon={
            <FontAwesome5 name="city" size={20} color="black" style={{margin: 5}}/>
          }
          onChangeText={(text) => {setPhone1(text)}}
          value={" "+cityName}
          error={errors.cityName}
          fieldButtonLabel={<FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>handleCity(countryId, stateId)}
        />

      </View>
      }
      {cityEdit && 
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'black'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={cityData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select city*' : '...'}
          searchPlaceholder="Search..."
          value={cityId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCityId(item.value);
            handleRegion(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? '#AD40AF' : 'black'}
              name="Safety"
              size={20}
            />
          )}
          error={errors.cityId}
          />}
          {
            errors.cityId ? (<Text style={styles.errorText}>{errors.cityId}</Text>):null
          }

      {!regionEdit && 
        <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <InputField
          label={'Region'}
          editable={false}
          icon={
            <FontAwesome5 name="city" size={20} color="black" style={{margin: 5}}/>
          }
          onChangeText={(text) => {setRegionName(text)}}
          value={" "+regionName}
          error={errors.regionName}
          fieldButtonLabel={<FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>
            handleRegion(cityId)}
        />

      </View>
      }
      {regionEdit && 
        <Dropdown
          style={[styles.dropdownRegion, isFocus && {borderColor: 'black'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={regionData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select region*' : '...'}
          searchPlaceholder="Search with region name or pincode..."
          value={regionId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setRegionId(item.value);
            setIsFocus(false);
          }}
          onChangeText={item=> {
            regionOnSearchLoad(item)
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? '#AD40AF' : 'black'}
              name="Safety"
              size={20}
            />
          )}
          error={errors.regionId}
          />}
          {
            errors.regionId ? (<Text style={styles.errorText}>{errors.regionId}</Text>):null
          }

        <CustomButton label={churchId?'Update':'Register'} onPress={handleSubmit} />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.9,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  dropdownRegion: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 25,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray'
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  imageUploadContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 2,
    flexDirection:'row',
    alignItems:'center'
  },
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  search: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  image: {
    marginRight: 2,
    marginLeft:25,
    alignSelf: 'center',
    height: 50, width: 50, resizeMode: 'contain'
  },
});
