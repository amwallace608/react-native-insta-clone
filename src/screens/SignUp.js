import React, {Component} from 'react';
import {Platform, Text, View, KeyboardAvoidingView} from 'react-native';
import {Button, Input} from 'react-native-ui-kitten';
import ImagePicker from 'react-native-image-picker';
import {withFirebaseHOC} from '../utils';
import auth from '@react-native-firebase/auth';

class SignUp extends Component {
  initialState = {
    name: '',
    email: '',
    username: '',
    password: '',
  };

  state = this.initialState;

  //on name change method - update state
  onChangeName = name => {
    this.setState({name});
  };

  //on email change method - update state
  onChangeEmail = email => {
    this.setState({email});
  };

  //on username change method - update state
  onChangeUsername = username => {
    this.setState({username});
  };

  //on password change method - update state
  onChangePassword = password => {
    this.setState({password});
  };

  //on submit asynch method -
  onSubmit = async () => {
    try {
      //get user email & password from state
      const userInfo = {
        email: this.state.email,
        password: this.state.password,
      };
      //create user and sign in with given info
      const userCred = await auth()
        .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            //user with email already exists
            console.log('Email is already in use');
            //alert user
            alert('That email is already in use');
          }
          if (error.code === 'auth/invalid-email') {
            //invalid email address
            console.log('Invalid email');
            alert('Please enter a valid email address');
          }
        });

      //create new user in 'users' firestore collection w/ new user data
      if (userCred) {
        console.log(userCred);
        console.log(userCred.user.uid);
        const uid = userCred.user.uid;
        const newUserData = {
          id: uid,
          name: this.state.name,
          username: this.state.username,
          email: this.state.email,
          avatar:
            'https://firebasestorage.googleapis.com/v0/b/instaclone-bd05e.appspot.com/o/default-profile-1.png?alt=media&token=c28f56ec-615a-4ac2-906f-1f3e969b9cb2',
        };
        //add user to 'users' collection in firestore
        this.props.firebase.newUser(newUserData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <View style={{flex: 1, marginTop: 20}}>
          <View style={{marginTop: 5, alignItems: 'center'}}>
            <Text category="h4">User Information</Text>
            <Input
              placeholder="Enter your name"
              style={{margin: 8}}
              value={this.state.name}
              onChangeText={name => this.onChangeName(name)}
            />
            <Input
              placeholder="Enter your email"
              style={{margin: 8}}
              value={this.state.email}
              onChangeText={email => this.onChangeEmail(email)}
            />
            <Input
              placeholder="Enter a username"
              style={{margin: 8}}
              value={this.state.username}
              onChangeText={username => this.onChangeUsername(username)}
            />
            <Input
              placeholder="Enter your password"
              style={{margin: 8}}
              value={this.state.password}
              secureTextEntry={true}
              onChangeText={password => this.onChangePassword(password)}
            />
            <Button status="success" onPress={this.onSubmit}>
              Sign Up
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

//wrap in Firebase HOC
export default withFirebaseHOC(SignUp)