import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Button} from 'react-native-ui-kitten';
import auth from '@react-native-firebase/auth';
import Feed from '../screens/Feed';

//header/stack Nav for feed screen
export const FeedHeader = createAppContainer(
  createStackNavigator({
    Feed: {
      screen: Feed,
      navigationOptions: {
        headerTitle: 'InstaClone',
        headerTitleAlign: 'center',
        headerTitleAllowFontScaling: true,
        headerLeft: () => (
          //sign out button
          <Button
            style={{margin: 1}}
            appearance="ghost"
            status="basic"
            onPress={() => {
              //sign out w/ auth
              auth().signOut();
            }}>
            {'[➜'}
          </Button>
        ),
      },
    },
  }),
);
