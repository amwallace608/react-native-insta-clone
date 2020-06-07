import React, { useState, useEffect, Fragment} from 'react';
import { mapping, dark as darkTheme} from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from 'react-native-ui-kitten';
//import tab navigator
import TabNavigator from './src/navigation/TabNavigator';
//import icons
import { EvaIconsPack } from '@ui-kitten/eva-icons';
//import Firebase utils
import Firebase, { FirebaseProvider } from './src/utils';
import auth from '@react-native-firebase/auth';
import AuthNavigator from './src/navigation/AuthNavigator';


const App = () => {

  // Set an initializing state while Firebase connects
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState()

  //user state change handler (async listener)
  function onAuthStateChanged(user) {
    //set current user - null if none signed in
    setUser(user)
    //set initializing state to false
    if(initializing) {
      setInitializing(false)
    }
  }

  //subscribe to AuthStateChanged event
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber; //unsubscribe on unmount
  }, [])

  //block render until firebase connects
  if(initializing) return null;

  //if no user signed in
  if(!user) {
    return (
      <Fragment>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider mapping={mapping} theme={darkTheme}>
          <FirebaseProvider value={Firebase}>
            <AuthNavigator />
          </FirebaseProvider>
        </ApplicationProvider>
      </Fragment>
    );
  } else {
    //user signed in, proceed to main feed
    return (
      //register Eva icons, configure application provider(root component), render tab navigator (wrapped in FireBase provider)
      <Fragment>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider mapping={mapping} theme={darkTheme}>
          <FirebaseProvider value={Firebase}>
            <TabNavigator />
          </FirebaseProvider>
        </ApplicationProvider>
      </Fragment>
    )
  }
} 

export default App;
