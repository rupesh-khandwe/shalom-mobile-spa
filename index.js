import { registerRootComponent } from 'expo';
import { register } from '@videosdk.live/react-native-sdk';

import App from './App';

// Register the Video SDK service
register();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
