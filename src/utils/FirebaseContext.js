import React, { createContext } from 'react';

//create Firebase context
const FirebaseContext = createContext({})
//get & export provider
export const FirebaseProvider = FirebaseContext.Provider
//get & export consumer
export const FirebaseConsumer = FirebaseContext.Consumer

/********************************************************************* 
* HOC - remove need to import and use Firebase.js
* wrap each component as parameter to provide access to Firebase queries/methods from Firebase.js
**********************************************************************/
export const withFirebaseHOC = Component => props => (
  <FirebaseConsumer>
    {state => <Component {...props} firebase={state}/>}
  </FirebaseConsumer>
)
