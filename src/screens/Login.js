import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button, Input} from 'react-native-ui-kitten';
import {withFirebaseHOC} from '../utils';
import auth from '@react-native-firebase/auth';

class Login extends Component {
  state = {
    email: '',
    password: '',
  };

  //on email change method - update state
  onChangeEmail = email => {
    this.setState({email});
  };

  //on password change method - update state
  onChangePassword = password => {
    this.setState({password});
  };

  //on Submit async method
  onSubmit = async () => {
    //check for user input
    if (this.state.email != '' && this.state.password != '') {
      //get email and password from state
      const {email, password} = this.state;
      //sign in with email and password
      const user = await auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => {
          //log error
          console.log(error.code);
          //alert user based on error code
          if (error.code === 'auth/wrong-password') {
            alert('Incorrect Password');
          } else if (error.code === 'auth/invalid-email') {
            alert('Invalid Email');
          } else if (error.code === 'auth/user-not-found') {
            alert('User not found for that email address');
          } else {
            alert(error.code);
          }
        });

        //log user that signed in
        console.log('User signed in: ', user.user.email)
    } else {
      alert('Please enter your email and password')
    }
  };

  render() {
    return (
      <View style={{flex: 1, marginTop: 40}}>
        <View style={{marginTop: 10, alignItems: 'center'}}>
          <Text category="h4">User Information</Text>
          <Input
            placeholder="Enter your email"
            style={{margin: 10}}
            value={this.state.email}
            onChangeText={title => this.onChangeEmail(title)}
          />
          <Input
            placeholder="Enter your password"
            style={{margin: 10}}
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={password => this.onChangePassword(password)}
          />
          <Button status="success" onPress={this.onSubmit}>
            Login
          </Button>
        </View>
      </View>
    );
  }
}

//wrap in Firebase HOC
export default withFirebaseHOC(Login);
