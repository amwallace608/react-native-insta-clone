import React, {Component} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Avatar, withStyles, List} from 'react-native-ui-kitten';
import {withFirebaseHOC} from '../utils';
import PostItem from '../components/PostItem';


class _Feed extends Component {
  //state holds posts data from firestore, isRefreshing bool
  state = {
    DATA: null,
    isRefreshing: false,
  };

  //feed is entry screen, fetch posts on component mount
  componentDidMount() {
    this.fetchPosts();
  }

  //fetch posts async method - get posts collection from firebase
  fetchPosts = async () => {
    //try catch for getting posts from firebase getPosts() method
    try {
      const posts = await this.props.firebase.getPosts();
      //log posts for debugging/validation
      console.log(posts);
      //update DATA of state with posts
      this.setState({
        DATA: posts,
        isRefreshing: false,
      });
    } catch (error) {
      //log error
      console.error(error);
    }
  };

  //on refresh method - get posts when screen is pulled downwards
  onRefresh = () => {
    //update state to indicate posts are refreshing
    this.setState({isRefreshing: true});
    //fetch posts from firebase
    this.fetchPosts();
  };

  render() {
    const renderItem = ({item}) => (<PostItem item={item} navigation={this.props.navigation}/>)

    if (this.state.DATA != null) {
      return (
        //return styled list, items rendered by renderItem method
        <List
          style={this.props.themedStyle.container}
          data={this.state.DATA}
          renderItem={renderItem}
          keyExtractor={this.state.DATA.id}
          refreshing={this.state.isRefreshing}
          onRefresh={() => this.onRefresh()}
        />
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }
}

export default (Feed = withFirebaseHOC(
  withStyles(_Feed, theme => ({
    container: {
      flex: 1,
    },
    card: {
      backgroundColor: theme['color-basic-100'],
      marginBottom: 2,
    },
    cardImage: {
      width: '100%',
      height: 300,
    },
    cardHeader: {
      padding: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardTitle: {
      color: theme['color-basic-1000'],
    },
    cardAvatar: {
      marginRight: 16,
    },
    cardContent: {
      padding: 15,
      borderWidth: 0.25,
      borderColor: theme['color-basic-600'],
    },
  })),
));
