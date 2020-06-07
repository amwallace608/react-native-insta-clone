import React, {Component} from 'react';
import {Text, Layout, Avatar} from 'react-native-ui-kitten';
import {View, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import {withFirebaseHOC} from '../utils';

class Profile extends Component {
  state = {
    id: '',
    name: '',
    username: '',
    email: '',
    avatar: '',
    posts: [],
  };

  getProfileData = async () => {
    //get user ID from firebase
    const currentUser = auth().currentUser;
    const userId = currentUser.uid;
    console.log(userId);

    //get user data from firestore db
    const userProfile = await this.props.firebase.getUser(userId);
    console.log('Profile of user: ', userProfile);
    this.setState(userProfile);
  };

  componentDidMount() {
    //start retrieval of user data
    const userData = this.getProfileData();
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
    return (
      <Layout
        style={{
          flex: 1,
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
    );
  }
}

//wrap in Firebase HOC
export default withFirebaseHOC(Profile);
