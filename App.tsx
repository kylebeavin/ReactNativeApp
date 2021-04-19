import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import AuthScreen from './screens/authentication/AuthScreen';
import ToastProvider from './providers/ToastProvider';
import AppToast from './components/layout/AppToast';
import CameraProvider from './providers/CameraProvider';
import AppCamera from './components/AppCamera';
import AppContext from './providers/AppContext';
import {Permission} from './providers/PermissionContext'

export default function App() {
  const isLoadingComplete = useCachedResources();
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState('');
  const [grpId, setGrpId] = useState('');
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [image, setImage] = useState('');
  const [grpArr, setGrpArr] = useState([]);

  const userSettings = {
    isAuth,
    token,
    grpId,
    id,
    displayName,
    grpArr,
    role,
    image,
    setDisplayName,
    setToken,
    setGrpId,
    setIsAuth,
    setId,
    setGrpArr,
    setRole,
    setImage,
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AppContext.Provider value={userSettings}>
          <ToastProvider>
            <Permission>
            <CameraProvider>
              <StatusBar translucent backgroundColor='transparent' />
              <AppCamera />
              <AppToast />
              {!isAuth ? <AuthScreen /> : <Navigation />}
            </CameraProvider>
            </Permission>
          </ToastProvider>
        </AppContext.Provider>
      </SafeAreaProvider>
    );
  }
}
