import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity} from 'react-native';
import {Avatar, withStyles, Icon} from 'react-native-ui-kitten';
import auth from '@react-native-firebase/auth';
import {withFirebaseHOC} from '../utils';

class _PostItem extends Component {
  state = {
    liked: false,
    likes: 0,
    userId: '',
    authorData: {},
    authorDataSynced: false
  };

  //check if user liked post already method
  checkIfLiked = async () => {
    //get current user from firebase
    const currentUser = auth().currentUser;
    const numLikes = this.props.item.likes.length;

    if (this.props.item.likes.includes(currentUser.uid)) {
      //current user has already liked the post, update state
      this.setState({
        liked: true,
        likes: numLikes,
        userId: currentUser.uid,
      });
    } else {
      //user has not already liked the post, set likes and userId anyway
      this.setState({
        likes: numLikes,
        userId: currentUser.uid,
      });
    }
  };

  //on post liked async method - update posts likes
  onPostLiked = async () => {
    if (this.state.liked) {
      //user already liked post, unlike post
      const likeData = {
        post: this.props.item,
        user: this.state.userId,
        liked: false,
        likes: this.state.likes
      };
      //update likes for post, get number of likes back
      const numLikes = await this.props.firebase.updateLikes(likeData);
      //update state with liked status and number of likes
      this.setState({
        liked: false,
        likes: numLikes,
      });
    } else {
      //user hasn't liked post yet - like post with user ID
      const likeData = {
        post: this.props.item,
        user: this.state.userId,
        liked: true,
        likes: this.state.likes
      };
      //update likes for post, get number of likes back
      const numLikes = await this.props.firebase.updateLikes(likeData);
      //update state with liked status and number of likes
      this.setState({
        liked: true,
        likes: numLikes,
      });
    }
  };

  //sync postedBy user data
  syncAuthorData = async(authorId) =>{
    //get author data, update state
    await this.props.firebase.getUser(authorId).then(foundUser => {
      this.setState({
        authorData: foundUser,
        authorDataSynced: true
      })
    })

  }

  componentDidMount() {
    //check if user liked post, update state values
    this.checkIfLiked();
    //sync post author data
    this.syncAuthorData(this.props.item.postedBy.id)
  }

  render() {
    const avatar = this.state.authorDataSynced ? this.state.authorData.avatar : this.props.item.postedBy.avatar.toString()
    const avatarUri = {
      uri: avatar
    }
    return (
      <View style={this.props.themedStyle.card}>
        <Image
          source={{uri: this.props.item.postPhoto}}
          style={this.props.themedStyle.cardImage}
        />
        <View style={this.props.themedStyle.cardHeader}>
          <TouchableOpacity onPress={() => this.onPostLiked()}>
            <Icon
              name="heart"
              width={20}
              height={20}
              fill={this.state.liked ? '#660000' : '#939393'}
            />
            <Text style={this.props.themedStyle.likesText}>{`${this.state.likes}`}{this.state.likes == 1 ? ' like' : ' likes'}</Text>
          </TouchableOpacity>
          <Text category="s1" style={this.props.themedStyle.cardTitle}>
            {this.props.item.postTitle}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const navProfile = this.props.item.postedBy
              this.props.navigation.navigate('Profile', navProfile)
            }}
          >
            <Avatar
              source={avatarUri}
              size="medium"
              style={this.props.themedStyle.cardAvatar}
            />
          </TouchableOpacity>
        </View>
        <View style={this.props.themedStyle.cardContent}>
          <Text category="p2">{this.props.item.postDescription}</Text>
        </View>
      </View>
    );
  }
}

export default (PostItem = withFirebaseHOC(
  withStyles(_PostItem, theme => ({
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
    likesText: {
      fontSize: 11,
    },
  })),
));