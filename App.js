import React from 'react';

import { AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';
import FlashMessage from "react-native-flash-message";

function App() {
  return (
    <AuthProvider>
      <AppNav></AppNav>
      <FlashMessage position="top" /> 
    </AuthProvider>
  );
}

export default App;
