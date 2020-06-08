import React, {Component} from 'react';
import {Text, Layout, Avatar, List, withStyles} from 'react-native-ui-kitten';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import {withFirebaseHOC} from '../utils';

class _Profile extends Component {
  state = {
    id: '',
    name: '',
    username: '',
    email: '',
    avatar: '',
    posts: [],
    postsDATA: [],
    isRefreshing: false,
  };

  getProfileData = async () => {
    //get user ID from firebase
    const currentUser = auth().currentUser;
    const userId = currentUser.uid;
    console.log(userId);

    //get user data from firestore db
    const userProfile = await this.props.firebase.getUser(userId);
    const userPosts = await this.props.firebase.getUserPosts(userId);
    console.log('Profile of user: ', userProfile);
    this.setState({
      id: userId,
      name: userProfile.name,
      username: userProfile.username,
      email: userProfile.email,
      avatar: userProfile.avatar,
      posts: userProfile.posts,
      postsDATA: userPosts
    });
    console.log('Posts: ', userPosts)
  };

  componentDidMount() {
    //start retrieval of user data
    this.getProfileData();
  }

  onRefresh() {
    //refresh user data
    this.getProfileData();
  }

  //change image URL callback for firebase upload/download image
  onImageReady(newUrl) {
    console.log('newUrl in Addpost: ', newUrl);
    //update avatar for user entry in firestore
    this.props.firebase.updateAvatar(this.state.id, newUrl)
    this.setState({avatar: newUrl});
  }
  //select image w/ image picker method
  selectImage = () => {
    //setup options for image picker
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        //user cancelled
        console.log('Image picker cancelled by user');
      } else if (response.error) {
        //Error with ImagePicker, log error
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        //user hit custom button, log button
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //image chosen, upload to firebase image storage
        console.log('filepath of image: ', response.path);
        const storagePath = `userImages/${
          this.state.username
        }/avatar`;

        console.log('path to storage: ', storagePath);

        const imgData = {
          localPath: response.path,
          storagePath: storagePath,
        };
        //success, get image URI and set image in state
        this.props.firebase.uploadImage(imgData, this.onImageReady.bind(this));
      }
    });
  };

  render() {
    const avatarUri = {
      uri: this.state.avatar,
    };
    const renderItem = ({item}) => (
      <PostItem item={item} navigation={this.props.navigation} />
    );

    return (
      <Layout
        style={{
          flex: 1,
          paddingTop: 8,
        }}>
        <Layout
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {this.state.avatar !== '' && (
            <TouchableOpacity onPress={() => this.selectImage()}>
              <Avatar source={avatarUri} size="giant" />
            </TouchableOpacity>
          )}
          <Text>@{this.state.username}</Text>
          <Text>{this.state.name}</Text>
          <Text>{this.state.email}</Text>
        </Layout>
        {this.state.posts.length > 0 && (
          //User has posts
          //return styled list, items rendered by renderItem method
          <List
            style={this.props.themedStyle.container}
            data={this.state.postsDATA}
            renderItem={renderItem}
            keyExtractor={this.state.postsDATA.id}
            refreshing={this.state.isRefreshing}
            onRefresh={() => this.onRefresh()}
          />
        )}
      </Layout>
    );
  }
}

//wrap in Firebase HOC
export default (Profile = withFirebaseHOC(
  withStyles(_Profile, theme => ({
    container: {
      flex: 1,
      borderWidth: 5,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      marginTop: 3,
      padding: 5
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