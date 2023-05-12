import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Overview, Login, History, Profile, Error, Transaction, MultipleFactors } from "./pages";
import { ProtectProp } from "./types/protectProp.type";
import { LayoutApp } from "./components";
import React from "react";

// import { useSelector, useDispatch } from 'react-redux'
// import { login, logout } from './store/features/login/reducer'
// import type { RootState } from './store/store'
const RouterApp = () => {
  const ProtectedRoute = ({ user, children }: ProtectProp): JSX.Element => {
    if (!user) {
      return <Navigate to='/' replace />;
    }
    return children;
  };

  // const user = useSelector((state: RootState) => state.login.value)
  const user = true;
  return (
    <Router>
      <LayoutApp>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/multiple-factors' element={<MultipleFactors />} />
          <Route
            path='/overview'
            element={
              <ProtectedRoute user={user}>
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path='/transaction'
            element={
              <ProtectedRoute user={user}>
                <Transaction />
              </ProtectedRoute>
            }
          />
          <Route
            path='/history'
            element={
              <ProtectedRoute user={user}>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute user={user}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='*'
            element={
              <ProtectedRoute user={user}>
                <Error />
              </ProtectedRoute>
            }
          />
        </Routes>
      </LayoutApp>
    </Router>
  );
};
export default RouterApp;
