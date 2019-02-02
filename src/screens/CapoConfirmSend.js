import React from 'react';
import {
  Text,
  Image,
  Platform,
  StyleSheet,
  View,
  Keyboard
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import FadeIn from 'react-native-fade-in-image';
import { withNavigation } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import NavigationOptions from '../config/NavigationOptions';
import { Ionicons } from '@expo/vector-icons';

import withUnstated from '@airship/with-unstated';
import GlobalDataContainer from '../containers/GlobalDataContainer';

import LoadingPlaceholder from '../components/LoadingPlaceholder';
import { BoldText, RegularText, SemiBoldText } from '../components/StyledText';

import SongView from '../components/SongView';

import { Colors, FontSizes, Layout } from '../constants';
import { Constants } from 'expo';
import { HeaderBackButton } from 'react-navigation';
import { Location, Permissions } from 'expo';

import CapoMessageSchema from '../data/capo_message_schema';
import RemoteNotifications from '../server_store/RemoteNotifications';

@withNavigation
class CapoConfirmSend extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Confirm?',
    ...NavigationOptions,
    headerLeft: (
      <HeaderBackButton onPress={() => navigation.goBack()} tintColor="#fff" />
    )
  });

  componentWillMount() {
    Keyboard.dismiss();

    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.log(
        'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      );
    } else {
      //this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.props.globalData.setLocation(null);
    } else {
      let location = await Location.getCurrentPositionAsync({});
      this.props.globalData.setLocation(location);
    }
  };

  render() {
    const { currentSong } = this.props.globalData.state;
    return (
      <LoadingPlaceholder>
        <View style={styles.container}>
          <SongView song={currentSong} />
          <View style={styles.buttonContainer}>
            <ClipBorderRadius>
              <RectButton
                style={styles.bigButton}
                onPress={this._handlePressSendOnlyButton}
                underlayColor="#fff"
              >
                <SemiBoldText style={styles.bigButtonText}>
                  Send Only
                </SemiBoldText>
                <Ionicons
                  name="md-send"
                  size={23}
                  style={{
                    color: '#fff',
                    marginTop: 3,
                    backgroundColor: 'transparent',
                    marginRight: 5
                  }}
                />
              </RectButton>
            </ClipBorderRadius>
            <ClipBorderRadius>
              <RectButton
                style={styles.bigButton}
                onPress={this._handlePressSendAndNotifyButton}
                underlayColor="#fff"
              >
                <SemiBoldText style={styles.bigButtonText}>
                  Send &amp; Notify
                </SemiBoldText>
                <Ionicons
                  name="md-notifications"
                  size={23}
                  style={{
                    color: '#fff',
                    marginTop: 3,
                    backgroundColor: 'transparent',
                    marginRight: 5
                  }}
                />
              </RectButton>
            </ClipBorderRadius>
          </View>
        </View>
      </LoadingPlaceholder>
    );
  }

  _handlePressSendOnlyButton = () => {
    console.log('send only');
    this._sendMessage(false);
  };
  _handlePressSendAndNotifyButton = () => {
    console.log('send and notify');
    this._sendMessage(true);
  };

  _sendMessage = pushFlag => {
    const { currentSong, location, token } = this.props.globalData.state;

    CapoMessageSchema.sender = token;
    CapoMessageSchema.send_time = new Date();
    if (null == location) {
      CapoMessageSchema.sender_latitude = '';
      CapoMessageSchema.sender_longitude = '';
    } else {
      CapoMessageSchema.sender_latitude = location.coords.latitude;
      CapoMessageSchema.sender_longitude = location.coords.longitude;
    }
    CapoMessageSchema.song = currentSong;
    //console.log('---- object to wrap in a message to server ----\n', CapoMessageSchema);

    let notifications = new RemoteNotifications();

    notifications
      .create({
        sender: CapoMessageSchema.sender,
        send_time: CapoMessageSchema.send_time,
        sender_latitude: CapoMessageSchema.sender_latitude,
        sender_longitude: CapoMessageSchema.sender_longitude,
        message: '',
        push: pushFlag,
        announcement: undefined,
        song: {
          category: CapoMessageSchema.song.category,
          create_time: CapoMessageSchema.song.create_time,
          update_time: CapoMessageSchema.song.update_time,
          title: CapoMessageSchema.song.title,
          tags: CapoMessageSchema.song.tags,
          lyrics: CapoMessageSchema.song.lyrics,
          tbd_various_boolean_flags:
            CapoMessageSchema.song.tbd_various_boolean_flags,
          reference_title: CapoMessageSchema.song.reference_title,
          reference_link: CapoMessageSchema.song.reference_link,
          instructions: CapoMessageSchema.song.instructions,
          player_id: CapoMessageSchema.song.player_id,
          override_html: CapoMessageSchema.song.override_html,
          delete_local: CapoMessageSchema.song.delete_local
        }
      })
      .then(responseJson => {
        // this is the output from the server for sending our capo_message
        console.log(JSON.stringify(responseJson));
        // we REALLY need to confirm this got sent
        //alert("success or fail message? do we even know?");
        // if fail, stay here
        // if success
        this.props.navigation.navigate('Home');
      });
  };
}

const ClipBorderRadius = ({ children, style }) => {
  return (
    <View
      style={[
        { borderRadius: BORDER_RADIUS, overflow: 'hidden', marginTop: 10 },
        style
      ]}
    >
      {children}
    </View>
  );
};

const BORDER_RADIUS = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 100 + '%',
    paddingBottom: 8
  },
  buttonContainer: {
    flexDirection: 'row',
    width: 100 + '%',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  bigButton: {
    backgroundColor: Colors.green,
    paddingHorizontal: 15,
    height: 50,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bigButtonText: {
    fontSize: FontSizes.normalButton,
    color: '#fff',
    textAlign: 'center'
  }
});

export default withUnstated(CapoConfirmSend, {
  globalData: GlobalDataContainer
});
