import { View, Text, StyleSheet, ImageBackground, StatusBar } from 'react-native'
import React, { useState } from 'react'
import WABG from '../src/assets/w_bg.png';
import CustomHeader from './components/CustomHeader';
import SendButton from './components/SendButton';
import { useDispatch, useSelector } from 'react-redux';
import { changeCurrentChatId, selectChats, selectCurrentChatId } from './redux/reducer/chatSlice';
import Chat from './components/Chat';

const MetaAI = () => {
    const dispatch = useDispatch();
    const chats = useSelector(selectChats);
    const currentChatId = useSelector(selectCurrentChatId);

    const [isTyping, setIsTyping] = useState(false);
    const [hieghtOfMessageBox, setHieghtOfMessageBox] = useState(0);

    const setCurrentChatId = id => {
        dispatch(changeCurrentChatId({ chatId: id }))
    }

    return (
        <ImageBackground source={WABG} style={styles.container} resizeMode='cover'>
            <StatusBar backgroundColor={'rgba(20,25,46,1)'} />
            <CustomHeader
                chats={chats}
                currentChatId={currentChatId}
                setCurrentChatId={id => setCurrentChatId(id)}
            />

            <Chat
                isTyping={isTyping}
                hightOfMessageBox={hieghtOfMessageBox}
                messages={chats?.find(chat => chat.id === currentChatId)?.messages || []}
            />

            <SendButton
                isTyping={isTyping}
                setHieghtOfMessageBox={setHieghtOfMessageBox}
                hieghtOfMessageBox={hieghtOfMessageBox}
                setIsTyping={setIsTyping}
                currentChatId={currentChatId}
                setCurrentChatId={id => setCurrentChatId(id)}
                length={chats?.find(chat => chat.id === currentChatId)?.messages?.length || [].length}
                messages={chats?.find(chat => chat.id === currentChatId)?.messages || []}
            />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default MetaAI