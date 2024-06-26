import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {store } from './app/store.js';
import { Provider } from 'react-redux';
import { fetchPosts } from './features/posts/postsSlice.js';
import { fetchUsers } from "./features/users/usersSlice";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

store.dispatch(fetchUsers())
store.dispatch(fetchPosts())
 
 // the '/*' in route path indicates nested Routes inside Route


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store = {store}>
      <Router>
        <Routes>
          <Route path ="/*" element={<App />}/>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
