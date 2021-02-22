import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import AuthScreen from './screens/Authentication/AuthScreen';
import ToastProvider from './providers/ToastProvider';
import AppToast from './components/Layout/AppToast';
import AppContext from './providers/AppContext';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState("");
  const [grpId, setGrpId] = useState("");
  const [id, setId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [headerStyle, setHeaderStyle] = useState(Math.floor(Math.random() * 3) + 1);
  const [grpArr, setGrpArr] = useState([]);
  
  const userSettings = {
    isAuth: isAuth,
    token: token,
    grpId: grpId,
    id: id,
    displayName: displayName,
    headerStyle: headerStyle,
    grpArr,
    setDisplayName,
    setToken,
    setGrpId,
    setIsAuth,
    setId,
    setHeaderStyle,
    setGrpArr
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AppContext.Provider value={userSettings}>
          <ToastProvider>
            <StatusBar translucent backgroundColor="transparent" />
            <AppToast />
            {!isAuth ?
              <AuthScreen />
              :
              <Navigation />
            }
          </ToastProvider>
        </AppContext.Provider>
      </SafeAreaProvider>
    );
  }
}
