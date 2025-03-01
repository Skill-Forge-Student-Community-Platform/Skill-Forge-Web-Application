import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from './Login.page';
import SignUp from './SignUp.page';
import EmailVerificationPage from './EmailVerificationPage';
import { Toaster } from 'react-hot-toast';

function Authentications() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 border-l-cyan-800 to-sky-600 flex items-center justify-center relative overflow-hidden'>
      <Routes>
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/verify-email' element={<EmailVerificationPage/>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default Authentications;
