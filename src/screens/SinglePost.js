import React from 'react';
import {
    ScrollView,
    StyleSheet
} from 'react-native';
import Post from '../components/Post';
import NavigationOptions from '../config/NavigationOptions';
import { HeaderBackButton } from 'react-navigation';
import appParams from '../../app.json';
import { DefaultColors, Palette, Skin } from '../config/Settings';

export default class SinglePost extends React.Component {
    render() {
        this.props.navigation.setOptions({ 
            headerTitle: appParams.expo.name + ": View Post",
            headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()} tintColor="#fff" />
        })

        return (
            <ScrollView style={styles.container}>
                <Post
                    style={{ flex: 1 }}
                    post={this.props.route.params.post}
                    navigation={this.props.navigation}
                    navToFullScreen={false} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});