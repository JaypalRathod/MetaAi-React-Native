import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react';
import { Bars3BottomLeftIcon, CheckBadgeIcon } from 'react-native-heroicons/solid'
import { RFValue } from 'react-native-responsive-fontsize';
import MetaAILogo from '../assets/logo_s.jpeg';
import CustomText from './CustomText';
import { useDispatch } from 'react-redux';
import { clearAllChats, clearChat } from '../redux/reducer/chatSlice';
import SideDrawer from './SideDrawer';

const CustomHeader = ({ currentChatId, chats, setCurrentChatId }) => {
    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);

    const onClearChat = async () => {
        dispatch(clearChat({ chatId: currentChatId }));
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.subContainer}>
                    <TouchableOpacity onPress={() => setVisible(!visible)}>
                        <Bars3BottomLeftIcon size={RFValue(20)} color={'white'} />
                    </TouchableOpacity>

                    <View style={styles.flexRow}>
                        <Image source={MetaAILogo} style={styles.image} />
                        <View>
                            <CustomText fontWeight='bold'>
                                Meta AI <CheckBadgeIcon color={'#27d66'} size={16} />
                            </CustomText>
                            <CustomText fontWeight={500} opacity={0.7} size={12}>
                                With Liama 3
                            </CustomText>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={onClearChat}
                    >
                        <CustomText size={14}>Clear</CustomText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {visible && (
                <SideDrawer
                    setCurrentChatId={id => setCurrentChatId(id)}
                    chats={chats}
                    onPressHide={() => setVisible(false)}
                    visible={visible}
                    currentChatId={currentChatId}
                />
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'rgba(20,25,46,1)',
        borderBottomWidth: 0.18,
        borderBottomColor: 'rgba(62,62,63,1)',
    },
    subContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    image: {
        width: 38,
        height: 38,
        borderRadius: 40,
    },
    flexRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    }
})

export default CustomHeader