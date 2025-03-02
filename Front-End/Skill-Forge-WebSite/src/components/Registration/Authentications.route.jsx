import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login.page';
import SignUp from './pages/SignUp.page';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPasswordPage from './pages/ForgetPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { RedirectAuthenticatedUser } from './AuthGuard';
import { Toaster } from 'react-hot-toast';

function Authentications() {
  const location = useLocation();

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 border-l-cyan-800 to-sky-600 flex items-center justify-center relative overflow-hidden'>
      <Routes>
        <Route path='/signup' element={
          <RedirectAuthenticatedUser>
            <SignUp />
          </RedirectAuthenticatedUser>
        } />

        <Route path='/login' element={
          <RedirectAuthenticatedUser>
            <Login />
          </RedirectAuthenticatedUser>
        } />

        <Route path='/verify-email' element={<EmailVerificationPage />} />

        <Route path='/forgot-password' element={
          <RedirectAuthenticatedUser>
            <ForgotPasswordPage />
          </RedirectAuthenticatedUser>
        } />

        {/* Handle reset password path */}
        <Route path='/reset-password/:token' element={
          <RedirectAuthenticatedUser>
            <ResetPasswordPage />
          </RedirectAuthenticatedUser>
        } />

        {/* Redirect from /auth to /auth/login as default */}
        <Route path='/' element={<Navigate to="/auth/login" replace />} />
        <Route path='*' element={<Navigate to="/auth/login" replace />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default Authentications;
