import React from 'react';
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { BoldText, RegularText, MediumText } from '../components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import FadeIn from 'react-native-fade-in-image';
import { Skin, DefaultColors, Palette } from '../config/Settings';
import i18n from "../../i18n";

export default class PostAttachmentMassTweet extends React.Component {
    render() {
        const roster = this.props.roster;

        let thumbnail = Skin.Roster_DefaultThumbnail;
        if (roster.defaultThumbnail)
            thumbnail = { uri: roster.defaultThumbnail };

        return (
            <View style={styles.row}>
                <TouchableOpacity
                    onPress={this._handlePress}
                    activeOpacity={0.2}
                    style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: i18n.getFlexDirection() }}>
                        <View style={styles.rowImageContainer}>
                            <FadeIn>
                                <Image
                                    source={thumbnail}
                                    style={{ width: 50, height: 50, borderRadius: 25 }}
                                />
                            </FadeIn>
                        </View>
                        <View style={{ flex: 1 }}>
                            <BoldText style={styles.title}>{roster.rosterTitle}</BoldText>
                            <View style={styles.tweetAllContainer}>
                                <Ionicons
                                    name={'logo-twitter'}
                                    size={16}
                                    style={{
                                        color: Palette.Sky,
                                        backgroundColor: 'transparent'
                                    }} />
                                <RegularText style={styles.tweetAllText}>Tweet all players</RegularText>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View >
        );
    }

    _handlePress = () => {
        if (this.props.onPress)
            this.props.onPress(this.props.roster);
    };
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        paddingTop: 10,
        padding: 10,
        backgroundColor: Palette.White,
        borderBottomWidth: 1,
        borderColor: '#eee',
        flexDirection: i18n.getFlexDirection()
    },
    rowLogoContainer: {
        paddingVertical: 5,
        paddingHorizontal: 5
    },
    title: {
        fontSize: 18,
        color: Palette.Navy,
        backgroundColor: Palette.White,
        paddingLeft: 4,
        textAlign: i18n.getRTLTextAlign(),
        writingDirection: i18n.getWritingDirection()
    },
    tweetAllContainer: {
        flexDirection: i18n.getFlexDirection(),
        alignItems: 'center',
        marginHorizontal: 8
    },
    tweetAllText: {
        fontFamily: 'heebo',
        fontSize: 16,
        lineHeight: 24,
        flex: 1,
        color: Palette.Navy,
        backgroundColor: Palette.White,
        marginLeft: 5,
        textAlign: i18n.getRTLTextAlign(),
        writingDirection: i18n.getWritingDirection()
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 4,
        fontSize: 18,
        textAlign: i18n.getRTLTextAlign()
    },
});