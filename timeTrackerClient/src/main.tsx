import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import axios, { AxiosInstance } from 'axios';
import { ServerConfig } from '../../server/configs/server-config';

const http: AxiosInstance = axios.create({
  baseURL: `http://${ServerConfig.ip}:${ServerConfig.port}`,
  timeout: 2000
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App http={http}/>}/>
        <Route path="/home" element={<App http={http}/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
