import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import useKeyboardOffsetHeight from '../helpers/useKeyboardOffsetHight';
import getMessageHeightOffset from '../helpers/getMessageHeightOffset';
import { FlashList } from '@shopify/flash-list';
import MessageBubble from './MessageBubble';
import EmptyComponents from './EmptyComponents';

const windowHeight = Dimensions.get('window').height

const Chat = ({ isTyping, messages, hightOfMessageBox }) => {
    const keyboardOffsetHeight = useKeyboardOffsetHeight();

    const renderMessageBubble = ({ item }) => {
        return <MessageBubble message={item} />
    }

    return (
        <View style={{
            height: windowHeight * 0.76 - keyboardOffsetHeight * 0.95 - getMessageHeightOffset(hightOfMessageBox, windowHeight),
        }}>
            {messages?.length == 0 ? (
                <EmptyComponents isTyping={isTyping} />
            ) : (
                <FlashList
                    indicatorStyle='black'
                    data={[...messages].reverse()}
                    inverted
                    estimatedItemSize={40}
                    renderItem={renderMessageBubble}
                />
            )}
        </View>
    )
}

export default Chat