import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export default function useKeyboardOffsetHeight() {

    const [KeyboardOffsetHeight, setKeyboardOffsetHeight] = useState(0)

    useEffect(() => {

        const keyboardWillAndroidShowListener = Keyboard.addListener('keyboardDidShow', e => {
            setKeyboardOffsetHeight(e.endCoordinates.height);
        })

        const keyboardWillAndroidHideListener = Keyboard.addListener('keyboardDidHide', e => {
            setKeyboardOffsetHeight(0);
        })

        const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', e => {
            setKeyboardOffsetHeight(e.endCoordinates.height);
        })

        const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', e => {
            setKeyboardOffsetHeight(0);
        })

        return () => {
            keyboardWillAndroidHideListener.remove()
            keyboardWillAndroidShowListener.remove()
            keyboardWillHideListener.remove()
            keyboardWillShowListener.remove()
        }

    }, [])

    return KeyboardOffsetHeight
}