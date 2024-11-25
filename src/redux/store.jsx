import { configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import reduxStorage from "./storage";
import rootReducer from './rootReducer';

const persistConfig = {
    key: 'root',
    storage: reduxStorage,
    // blacklist: [],
    whitelist: ['chat'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PURGE, PERSIST]
            }
        })
})

export const persistor = persistStore(store);