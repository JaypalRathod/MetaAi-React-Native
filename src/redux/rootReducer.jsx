import { combineReducers } from "redux";
import chatSlice from "./reducer/chatSlice";

const rootReducer = combineReducers({
    chat: chatSlice,
})

export default rootReducer;