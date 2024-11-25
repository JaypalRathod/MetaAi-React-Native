import { View, StyleSheet, Dimensions, Platform, TextInput, Animated, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize';
import useKeyboardOffsetHeight from '../helpers/useKeyboardOffsetHight';
import { useDispatch, useSelector } from 'react-redux';
import { addAssitentMessage, addMessage, createNewChat, markMessageAsRead, selectChats, selectCurrentChatId, updateAssitentMessage, updateChatSummary } from '../redux/reducer/chatSlice';
import { PaperAirplaneIcon } from 'react-native-heroicons/solid';
import uuid from 'react-native-uuid';
import EventSource from "react-native-sse";
import { HUGGING_API_KEY, HUGGING_API_URL, STABLE_DIFFUSION_API, STABLE_DIFFUSION_KEY } from '../api/Api';
import axios from 'axios';

const windowHieght = Dimensions.get('window').height;

const SendButton = ({
    isTyping,
    setIsTyping,
    setHieghtOfMessageBox,
    setCurrentChatId,
    length,
    messages
}) => {

    const dispatch = useDispatch();
    const chats = useSelector(selectChats);
    const currentChatId = useSelector(selectCurrentChatId);
    const animationValue = useRef(new Animated.Value(0)).current;
    const TextInputRef = useRef(null);

    const [message, setMessage] = useState('');
    const KeyboardOffsetHeight = useKeyboardOffsetHeight();

    const handleTextChange = (text) => {
        setIsTyping(!!text);
        setMessage(text);
    }

    const handleContentSizeChange = event => {
        setHieghtOfMessageBox(event.nativeEvent.contentSize.height);
    }

    useEffect(() => {
        Animated.timing(animationValue, {
            toValue: isTyping ? 1 : 0,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, [isTyping])

    const sendButtonStyle = {
        opacity: animationValue,
        transform: [{
            scale: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
            }),
        }],
    };

    const identifyImageApi = prompt => {
        const imageRegex = /\b(generate\s*image|imagine)\b/i;
        if (imageRegex.test(prompt)) {
            return true;
        } else {
            return false;
        }
    }

    const fetchResponse = async (mes, selectedChatId) => {
        let id = length + 2;
        dispatch(addAssitentMessage({
            chatId: selectedChatId,
            message: {
                content: 'Loading...',
                time: mes.time,
                role: 'assistent',
                id: id,
            },
        }));

        const eventSource = new EventSource(HUGGING_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${HUGGING_API_KEY}`,
                'Content-Type': 'application/json',
            },
            pollingInterval: 0,
            body: JSON.stringify({
                model: 'meta-llama/Meta-Llama-3-8B-Instruct',
                messages: [...messages, mes],
                max_tokens: 500,
                stream: true
            }),
        });

        let content = '';
        let responseComplete = false;

        eventSource.addEventListener("message", (event) => {
            if (event.data !== '[DONE]') {
                const parsedData = JSON.parse(event.data);
                if (parsedData.choices && parsedData.choices.length > 0) {
                    const delta = parsedData.choices[0].delta.content;

                    if (delta) {
                        content += delta;
                        dispatch(
                            updateAssitentMessage({
                                chatId: selectedChatId,
                                message: {
                                    content,
                                    time: new Date().toString(),
                                    role: 'assitant',
                                    id: id
                                },
                                messageId: id,
                            }),
                        );
                    }
                }
            } else {
                responseComplete = true;
                eventSource.close();
            }
        });

        eventSource.addEventListener("error", (error) => {
            console.log(error);
            dispatch(
                updateAssitentMessage({
                    chatId: selectedChatId,
                    message: {
                        content: "Oops! looks like something snapped ! 🤕",
                        time: new Date().toString(),
                        role: 'assitant',
                        id: id
                    },
                    messageId: id,
                }),
            );
            eventSource.close();
        });

        eventSource.addEventListener("close", () => {
            if (!responseComplete) {
                eventSource.close();
            }
        });

        return () => {
            eventSource.removeAllEventListeners();
            eventSource.close();
        }
    };

    const generateImage = async (mes, selectedChatId) => {
        let id = length + 2;
        dispatch(addAssitentMessage({
            chatId: selectedChatId,
            message: {
                content: 'Loading...',
                time: mes.time,
                role: 'assistent',
                id: id,
            },
        }),
        );

        try {
            const res = await axios.post(STABLE_DIFFUSION_API, {
                key: STABLE_DIFFUSION_KEY,
                prompt: message,
                negative_prompt: 'low quality',
                width: '512',
                height: '512',
                safety_checkers: false,
                seed: null,
                samples: 1,
                base64: false,
                webhook: null,
                track_id: null,
            },
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            dispatch(
                updateAssitentMessage({
                    chatId: selectedChatId,
                    message: {
                        content: res.data?.proxy_links[0],
                        imageUri: res.data?.proxy_links[0],
                        time: new Date().toString(),
                        role: 'assitant',
                        id: id
                    },
                    messageId: id,
                }),
            );

        } catch (error) {
            console.log(error);
            dispatch(
                updateAssitentMessage({
                    chatId: selectedChatId,
                    message: {
                        content: "Oops! looks like something snapped ! 🤕",
                        time: new Date().toString(),
                        role: 'assitant',
                        id: id
                    },
                    messageId: id,
                }),
            );
        }
    }

    const addChat = async newId => {
        let selectedChatId = newId ? newId : currentChatId;
        let msgId = length + 1;

        if (length == 0 && message.trim().length > 0) {
            dispatch(
                updateChatSummary({
                    chatId: selectedChatId,
                    summary: message?.trim().slice(0, 40),
                }),
            );
        }

        dispatch(
            addMessage({
                chatId: selectedChatId,
                message: {
                    content: message,
                    time: new Date().toString(),
                    role: 'user',
                    id: msgId,
                    isMessageRead: false,
                },
            }),
        );

        setMessage('');
        setIsTyping(false);
        TextInputRef.current.blur();

        let promptForAssistant = {
            content: message,
            time: new Date().toString(),
            role: 'user',
            id: msgId,
            isMessageRead: false,
        }

        if (!identifyImageApi(message)) {
            fetchResponse(promptForAssistant, selectedChatId);
        } else {
            generateImage(promptForAssistant, selectedChatId);
        }

        dispatch(
            markMessageAsRead({
                chatId: selectedChatId,
                messageId: msgId,
            })
        )

    };

    return (
        <View style={[styles.container, {
            bottom: Platform.OS === 'android' ? windowHieght * 0.02 : Math.max(KeyboardOffsetHeight, windowHieght * 0.02),
        }]}>
            <View style={styles.subContainer}>
                <View style={[styles.inputContainer, { width: isTyping ? '87%' : '100%' }]}>
                    <TextInput
                        editable={true}
                        multiline={true}
                        ref={TextInputRef}
                        value={message}
                        style={styles.textInput}
                        placeholder='Message...'
                        placeholderTextColor='#888'
                        onChangeText={handleTextChange}
                        onContentSizeChange={handleContentSizeChange}
                    />
                </View>
                {isTyping && (
                    <Animated.View style={[styles.sendButtonWrapper, sendButtonStyle]}>
                        <TouchableOpacity style={styles.sendButton} onPress={async () => {
                            const chatIndex = chats.findIndex(chat => chat.id == currentChatId);
                            if (chatIndex === -1) {
                                let newId = uuid.v4();
                                setCurrentChatId(newId);
                                await dispatch(
                                    createNewChat({
                                        chatId: newId,
                                        messages: [],
                                        summary: 'New Chat'
                                    })
                                );

                                addChat(newId);
                                return;
                            } else {
                                addChat();
                            }
                        }}>
                            <PaperAirplaneIcon color={'#000'} />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        minHeight: windowHieght * 0.06,
        minWidth: windowHieght * 0.4,
        paddingHorizontal: '1%',
        padding: 10,
        position: 'absolute',
        left: 0,
        right: 0,
        width: '98%',
        alignContent: 'center',
    },
    subContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    },
    inputContainer: {
        maxHeight: windowHieght * 0.2,
        backgroundColor: '#232626',
        margin: '1%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        padding: 5
    },
    textInput: {
        width: '98%',
        padding: 10,
        marginHorizontal: '2%',
        fontSize: RFValue(13),
        color: 'white',
    },
    sendButtonWrapper: {
        position: 'absolute',
        right: 0,
        bottom: 6,
        width: '11%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButton: {
        backgroundColor: '#22c063',
        borderRadius: 42,
        height: 42,
        width: 42,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default SendButton