import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
   <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <>
          <App />
          <Toaster position="top-center" reverseOrder={false} />
        </>
      </BrowserRouter>
    </AuthProvider>
  </Provider> 
)
