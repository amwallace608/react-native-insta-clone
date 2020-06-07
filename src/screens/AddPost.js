import React, {Component} from 'react';
import {
  Image,
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, Input} from 'react-native-ui-kitten';
import ImagePicker from 'react-native-image-picker';
import {withFirebaseHOC} from '../utils';
import auth from '@react-native-firebase/auth';

class AddPost extends Component {
  initialState = {
    image: null,
    title: '',
    description: '',
    currentUser: null,
  };

  state = this.initialState;

  //on title change method - update state
  onChangeTitle = title => {
    this.setState({title});
  };

  //on description change method - update state
  onDescriptionChange = descr => {
    this.setState({description: descr});
  };

  //on submit asynch method - upload post to firestore and reset state obj on success
  onSubmit = async () => {
    try {
      console.log(this.state.image)
      //get user data from state
      const user = this.state.currentUser
      //get post data from state
      const post = {
        photo: this.state.image,
        title: this.state.title,
        description: this.state.description,
        postedBy: user,
      };
      //upload post w/ method from Firebase.js
      this.props.firebase.uploadPost(post);
      //update user posts field

      //reset state
      this.setState(this.initialState);
    } catch (error) {
      console.error(error);
    }
  };

  //change image URL callback for firebase upload/download image
  onImageReady(newUrl) {
    console.log('newUrl in Addpost: ', newUrl)
    this.setState({image: newUrl})
  }
  //select image w/ image picker method
  selectImage =  () => {
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
          this.state.currentUser.username
          }/post${this.state.currentUser.posts.length}`;

        console.log('path to storage: ', storagePath);

        const imgData = {
          localPath: response.path,
          storagePath: storagePath,
        };
        //success, get image URI and set image in state
        this.props.firebase.uploadImage(imgData, this.onImageReady.bind(this))
      }
    });
  };

  getCurrentUser = async () => {
    //get user id from firebase auth
    const currentUser = auth().currentUser;
    //get user data from firebase firestore
    const user = await this.props.firebase.getUser(currentUser.uid);
    this.setState({currentUser: user});
  };

  componentDidMount() {
    //get current user from firebase auth
    this.getCurrentUser();
  }

  //render create post UI
  render() {
    const imageUri = {
      uri: this.state.image
    }
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <View style={{flex: 1, marginTop: 20}}>
          <View>
            {this.state.image ? ( //render image if picked, else render button
              <Image
                source={imageUri}
                style={{width: '100%', height: 300}}
              />
            ) : (
              <Button
                onPress={this.selectImage}
                style={{
                  alignItems: 'center',
                  padding: 10,
                  margin: 30,
                }}>
                Add an image
              </Button>
            )}
          </View>
          <View style={{marginTop: 10, alignItems: 'center'}}>
            <Text category="h4">Post Details</Text>
            <Input
              placeholder="Enter title of the post"
              style={{margin: 10}}
              value={this.state.title}
              onChangeText={title => this.onChangeTitle(title)}
            />
            <Input
              placeholder="Enter description"
              style={{margin: 10}}
              value={this.state.description}
              onChangeText={description =>
                this.onDescriptionChange(description)
              }
            />
            <Button status="success" onPress={this.onSubmit}>
              Add post
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
//wrap in Firebase HOC
export default withFirebaseHOC(AddPost);
