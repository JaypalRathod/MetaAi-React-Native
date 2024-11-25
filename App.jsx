import React from 'react'
import MetaAI from './src/MetaAI'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './src/redux/store'
import { Provider } from 'react-redux'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MetaAI />
      </PersistGate>
    </Provider>
  )
}

export default App