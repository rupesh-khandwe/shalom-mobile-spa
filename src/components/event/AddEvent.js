import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  Keyboard
} from 'react-native';

import InputField from '../common/InputField';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../common/CustomButton';
import { MaterialIcons, MaterialCommunityIcons, Fontisto } from '@expo/vector-icons'; 
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; 
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import {REACT_APP_LOCATION_API, REACT_APP_BASE_URL_API} from '@env'
import { Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from "moment";

export default function AddEvent({route, navigation}) {
  const {userToken, userInfo}= useContext(AuthContext);
  const [eventId, setEventId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [addressline1, setAddressline1] = useState('');
  const [addressline2, setAddressline2] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [regionId, setRegionId] = useState('');
  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [regionName, setRegionName] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [cityEdit, setCityEdit] = useState(true);
  const [stateEdit, setStateEdit] = useState(true);
  const [regionEdit, setRegionEdit] = useState(true);
  const [userId, setUserId] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [date, setDate] = useState(new Date(1598051730000));
  const [dateString, setDateString] = useState('Date of Birth');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [createdOn, setCreatedOn] = useState(null);
  const [updatedOn, setUpdatedOn] = useState(null);
  const event_model = {
    'eventId': eventId,
    'userId': userId,
    'categoryId': categoryId,
    'title': title,
    'description': description,
    'eventDate': eventDate,
    'eventTime': eventTime,
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
  }

  useEffect(() => {
    setUserId(userInfo.userId);
    setCreatedBy(userInfo.userName);
    var params = route.params
    console.log("route.params",params);
    !params && setCreatedOn(moment.utc().toISOString());
    console.log("Registration launched");
    axios
    .get(`${REACT_APP_BASE_URL_API}/event/category`, {
        headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
    })
    .then((res) => {
      var count = Object.keys(res.data).length;
      let categoryArray = [];
      for (var i = 0; i < count; i++) {
        categoryArray.push({
          value: res.data[i].categoryId,
          label: res.data[i].categoryName,
        });
      }
      setCategoryData(categoryArray);
    })
    .catch((err) => console.log(err));

    axios
    .get(`${REACT_APP_LOCATION_API}/CountryList`, {
      headers: { 'content-type': 'application/json'},
    })
    .then((res) => {
      var count = Object.keys(res.data).length;
      let countryArray = [];
      for (var i = 0; i < count; i++) {
        countryArray.push({
          value: res.data[i].countryId,
          label: res.data[i].countryName,
        });
      }
      setCountryData(countryArray);
    })
    .catch((err) => console.log(err));

    if(params && params.eventId){
      setStateEdit(false);
      setCityEdit(false);
      setRegionEdit(false);
      setEventId(params.eventId)
      setTitle(params.title)
      setDescription(params.description);
      setCategoryId(params.categoryId);
      setPhone1(params.phone1);
      setPhone2(params.phone2);
      setAddressline1(params.addressLine1);
      setAddressline2(params.addressLine2);
      setUpdatedOn(moment.utc().toISOString());
      setCountryId(params.countryId);
      setStateId(params.stateId);
      setStateName(params.stateName);
      setCityId(params.cityId);
      setCityName(params.cityName)
      setRegionId(params.regionId);
      setRegionName(params.regionName)
      setCreatedOn(params.createdOn)
      setEventDate(params.eventDate)
      setEventTime(params.eventTime)
      //Load state
      axios
        .get(`${REACT_APP_LOCATION_API}/StateList?countryId=${params.countryId}`, {
          headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
        })
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
    }



  }, []);


  const validateForm = () =>{
    Keyboard.dismiss();
    let errors = {};
    const requireFieldMsg = " Required field*";
    const regexPhone = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;

    if(!categoryId) errors.categoryId = "Please select category";
    if(!eventDate) errors.eventDate = "Please select event date";
    if(!eventTime) errors.eventTime = "Please select event time";

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
    setEventDate("");
    setEventTime("");
    setPhone1("");
    setPhone2("");
    setAddressline1("");
    setAddressline2("");
    setCountryId("");
    setCityId("");
    setStateId("");
    setRegionId("");
    setCategoryId("");
    setTitle("");
    setDescription("");
    setErrors({});
    handleAddEvent();
  }
}


  const handleState = countryCode => {
    console.log(countryCode);
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

  const handleAddEvent = () => {
    console.log(handleAddEvent);
    axios
    .post(`${REACT_APP_BASE_URL_API}/event/add`, 
      event_model,
      {headers: { 'content-type': 'application/json', 'Authorization': "Bearer "+ userToken},
      })
    .then((res) => {
        navigation.replace('Event', "success");
    })
    .catch((err) => console.log(`Login error ${err}`)); 
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth()+1; 
    const day= selectedDate.getDate();
    const dateString = `${day}-${month}-${year}`;
    setShow(false);
    setDateString(dateString);
    setDate(currentDate);
    var [eventDate, eventTime] = currentDate.toLocaleString().split(',');
    setEventDate(eventDate);
    setEventTime(eventTime);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
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


  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center', marginTop: 30, marginBottom: 20}}>
        <MaterialIcons name="event" size={50} color="purple" />
        </View>

        <Dropdown
          style={[styles.dropdownRegion, isFocus && {borderColor: 'black'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={categoryData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select event category*' : '...'}
          searchPlaceholder="Search..."
          value={categoryId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCategoryId(item.value);
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
          error={errors.categoryId}
          />
          {
            errors.categoryId ? (<Text style={styles.errorText}>{errors.categoryId}</Text>):null
          }

        <InputField
          label={'Event title'}
          icon={
            <MaterialCommunityIcons
              name="format-title"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setTitle(text)}}
          value={title}
        />

        <InputField
          label={'Description'}
          icon={
            <MaterialCommunityIcons
              name="details"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setDescription(text)}}
          value={description}
        />

      <TouchableOpacity onPress={showDatepicker}>
        <View pointerEvents="none">
          <InputField
              label={' Event date*'}
              icon={
                <Fontisto name="date" size={23} color="purple" />
              }
              value={" "+eventDate}
              error={errors.eventDate}
              />
          </View>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={showTimepicker}>
        <View pointerEvents="none">
          <InputField 
            label={' Event time*'}
            icon={
              <MaterialIcons name="av-timer" size={25} color="purple" />
            }
            value={eventTime}
            error={errors.eventTime}
          /></View>
      </TouchableOpacity>
          {show && (<DateTimePicker
            testID="dateTimePicker"
            minimumDate={new Date(1947, 0, 1)}
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            display='spinner'
          />
          )}

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
          error={errors.phone2}
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
            //setCountryName(item.label);
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


        <CustomButton label={eventId?'Update Event':'Add Event'} onPress={handleSubmit} />

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
  }
});
