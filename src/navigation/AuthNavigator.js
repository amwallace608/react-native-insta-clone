import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Icon} from 'react-native-ui-kitten';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';


const AuthNavigator = createBottomTabNavigator({
  Login: {
    //Login screen, default
    screen: Login,
    navigationOptions: {
      //set log out icon, blue when focused, otherwise gray
      tabBarIcon: ({focused}) => (
        <Icon
          name="log-in"
          width={30}
          height={30}
          fill={focused ? '#005DAA' : '#939393'}
        />
      ),
    },
  },
  SignUp: {
    //sign up screen
    screen: SignUp,
    navigationOptions: {
      //set plus circle icon, blue when focused, otherwise gray
      tabBarIcon: ({focused}) => (
        <Icon
          name="plus-circle-outline"
          width={30}
          height={30}
          fill={focused ? '#005DAA' : '#939393'}
        />
      ),
    },
  },
});

export default createAppContainer(AuthNavigator);