import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import CustomText from './CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { XCircleIcon } from 'react-native-heroicons/outline';
import { TrashIcon } from 'react-native-heroicons/solid';
import { useDispatch } from 'react-redux';
import { clearAllChats, createNewChat, deleteChat } from '../redux/reducer/chatSlice';
import uuid from 'react-native-uuid';

const SideDrawer = ({ setCurrentChatId, chats, onPressHide, visible, currentChatId }) => {

    const dispatch = useDispatch();

    const addNewChat = async () => {
        dispatch(createNewChat({
            chatId: uuid.v4(),
            messages: [],
            summary: 'New chat',
        }));
    }

    const clearAllChat = async () => {
        dispatch(clearAllChats());
    }

    const deleteAChat = async id => {
        dispatch(deleteChat({ chatId: id }));
    }

    const renderChats = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => { setCurrentChatId(item.id), onPressHide() }}
                style={[styles.chatBtn, { backgroundColor: currentChatId == item.id ? '#041e49' : '#131314' }]}
            >
                <CustomText
                    numberOfLines={1}
                    style={{ width: '70%' }}
                    size={RFValue(11)}
                    fontWeight='500'
                >
                    {item?.summary}
                </CustomText>

                <TouchableOpacity onPress={() => {deleteAChat(item.id)}} style={styles.trashIcon}>
                    <TrashIcon color={'#ef4444'} size={RFValue(12)} />
                </TouchableOpacity>

            </TouchableOpacity>
        )
    }

    return (
        <Modal
            isVisible={visible}
            backdropColor='black'
            backdropOpacity={0.5}
            animationIn={'slideInLeft'}
            animationOut={'slideOutLeft'}
            onBackButtonPress={onPressHide}
            onBackdropPress={onPressHide}
            style={styles.bottomModalView}
        >
            <SafeAreaView >
                <View style={styles.modalContainer}>
                    <View style={{ height: '100%', width: '100%' }}>
                        <View style={styles.header}>
                            <View style={styles.flexRow}>
                                <Image
                                    source={require('../assets/logo_t.png')}
                                    style={{ height: 30, width: 30 }}
                                />

                                <CustomText size={RFValue(16)} opacity={0.8} fontWeight='600'>
                                    All Chats
                                </CustomText>
                            </View>
                            <TouchableOpacity onPress={onPressHide}>
                                <XCircleIcon color={'#ccc'} size={RFValue(16)} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={addNewChat} style={styles.newChat} >
                            <CustomText size={RFValue(10)}>+ Add new chat</CustomText>
                        </TouchableOpacity>

                        <CustomText style={{ margin: 10, fontSize: RFValue(12) }}>
                            Recent
                        </CustomText>

                        <View style={{ height: '60%' }}>
                            <FlatList
                                data={[...chats].reverse()}
                                renderItem={renderChats}
                                key={item => item.id}
                                keyExtractor={item => item.id}
                                contentContainerStyle={{ paddingHorizontal: 5, paddingVertical: 10 }}
                            />
                        </View>

                        <TouchableOpacity onPress={clearAllChat} style={styles.clearAllChats} >
                            <CustomText fontWeight='500' size={RFValue(10)}>Clear All Chats</CustomText>
                        </TouchableOpacity>

                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    bottomModalView: {
        justifyContent: 'flex-end',
        width: '70%',
        margin: 10,
    },
    modalContainer: {
        backgroundColor: '#171717',
        borderRadius: 20,
        overflow: 'hidden',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'grey',
    },
    flexRow: {
        gap: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    newChat: {
        backgroundColor: '#272a2c',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: '60%',
        margin: 10,
        alignSelf: 'center',
    },
    clearAllChats: {
        backgroundColor: '#ef4444',
        padding: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    },
    chatBtn: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8
    },
    trashIcon: {
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 20
    }
})

export default SideDrawer