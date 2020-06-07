import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { Icon } from 'react-native-ui-kitten';
import { FeedHeader } from './StackNavigator';
import Search from '../screens/Search';
import AddPost from '../screens/AddPost';
import Activity from '../screens/Activity';
import Profile from '../screens/Profile';

const TabNavigator = createBottomTabNavigator({
  Feed: {
    //main feed screen
    screen: FeedHeader,
    navigationOptions: {
      //set home icon, blue when focused, otherwise gray
      tabBarIcon: ({focused}) => (
        <Icon
          name="home"
          width={30}
          height={30}
          fill={focused ? '#005DAA' : '#939393'}
        />
      ),
    },
  },
  Search: {
    //search screen
    screen: Search,
    navigationOptions: {
      //set search icon, blue when focused, otherwise gray
      tabBarIcon: ({focused}) => (
        <Icon
          name="search"
          width={30}
          height={30}
          fill={focused ? '#005DAA' : '#939393'}
        />
      ),
    },
  },
  AddPost: {
    //add post screen
    screen: AddPost,
    navigationOptions: {
      //set plus icon icon, blue when focused, otherwise gray
      tabBarIcon: ({focused}) => (
        <Icon
          name="plus"
          width={30}
          height={30}
          fill={focused ? '#005DAA' : '#939393'}
        />
      ),
    },
  },
  Activity: {
    //Activity screen
    screen: Activity,
    navigationOptions: {
      //set heart icon, blue when focused, otherwise gray
      tabBarIcon: ({focused}) => (
        <Icon
          name="heart"
          width={30}
          height={30}
          fill={focused ? '#005DAA' : '#939393'}
        />
      ),
    },
  },
  Profile: {
    //Profile screen
    screen: Profile,
    navigationOptions: {
      //set person icon, blue when focused, otherwise gray
      tabBarIcon: ({focused}) => (
        <Icon
          name="person"
          width={30}
          height={30}
          fill={focused ? '#005DAA' : '#939393'}
        />
      ),
    },
  },
});

export default createAppContainer(TabNavigator);