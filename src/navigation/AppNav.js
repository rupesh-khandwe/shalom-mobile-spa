import { NavigationContainer } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';
import { DeviceInfo } from 'react-native-device-info'; // Import for version check
import { AuthContext } from '../context/AuthContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

export default function AppNav() {
  const { isLoading, userToken } = useContext(AuthContext);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const checkForUpdate = async () => {
      // backend API that returns the latest version
      const response = await fetch('http://shalom-api.us-east-1.elasticbeanstalk.com/version/v1');
      const latestVersion = await response.json();
      const currentVersion = await DeviceInfo.getVersion();
      if (currentVersion !== latestVersion.version) {
        setUpdateAvailable(true);
      }
    };
    checkForUpdate();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {userToken !== null ? <AppStack /> : <AuthStack />}
      {updateAvailable && (
        <FlashMessage // Replace with your preferred notification component
          message="A new version is available. Please update to the latest version."
          type="info"
          duration={5000}
        />
      )}
    </NavigationContainer>
  );
}

/**
  * Linking Configuration
  */
const linking = {
  // Prefixes accepted by the navigation container, should match the added schemes
  prefixes: ["shalomgolive://"],  // , "https://shalomgolive/"
  // Route config to map uri paths to screens
  config: {
    // Initial route name to be added to the stack before any further navigation,
    // should match one of the available screens
    initialRouteName: "Home",
    screens: {
      // myapp://home -> HomeScreen
      Home: {
        screens: {
          // myapp://details/1 -> DetailsScreen with param id: 1
          GoLive: "golive/:id"
        }
      }
    },
  },
  async getInitialURL() {
    return Linking.getInitialURL();
  },
};


if (isLoading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} />
    </View>
  );
}
return (
  <NavigationContainer linking={linking}>
    {userToken !== null ? <AppStack /> : <AuthStack />}

  </NavigationContainer>
);