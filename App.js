/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import Reactotron from 'reactotron-react-native';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  AppState,
} from 'react-native';
import ActivityRecognition from 'react-native-activity-recognition';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  constructor(props) {
    super(props);
    // Start activity detection
    const detectionIntervalMillis = 1000;
    ActivityRecognition.start(detectionIntervalMillis);
    this.state = {
      mostProbableActivity: null,
      latitude: null,
      longitude: null,
      error: null,
    };
    // console.dir(ActivityRecognition);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }
  componentDidMount() {
    // Subscribe to updates
    this.unsubscribe = ActivityRecognition.subscribe(detectedActivities => {
      this.setState({ mostProbableActivity: detectedActivities.sorted[0] });
      console.log(detectedActivities);
    });
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount() {
    // Stop activity detection and remove the listener
    ActivityRecognition.stop();
    this.unsubscribe();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    if (appState === 'background') {
      console.log('app is in the background');
    }
  }

  render() {
    // Reactotron.log('hello rendering world');
    // Reactotron.display({
    //   name: 'KNOCK KNOCK',
    //   preview: "Who's there?",
    //   value: 'Orange.',
    // });

    // Reactotron.display({
    //   name: 'ORANGE',
    //   preview: 'Who?',
    //   value: "Orange you glad you don't know me in real life?",
    //   important: true,
    // });
    const mpa = this.state.mostProbableActivity;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        {mpa ? <Text>{mpa.type}</Text> : null}
        {this.state.latitude ? (
          <Text>
            Lat: {this.state.latitude}, Long: {this.state.longitude}
          </Text>
        ) : null}
        {mpa && mpa.type === 'WALKING'
          ? Alert.alert(
              "You're Walking!",
              `Confidence: ${mpa.confidence}%`,
              [
                {
                  text: 'Ask me later',
                  onPress: () => console.log('Ask me later pressed'),
                },
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                { text: 'OK', onPress: () => console.log('OK Pressed') },
              ],
              { cancelable: false }
            )
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
