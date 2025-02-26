import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from './Login.page';
import SignUp from './SignUp.page';

function Authentications() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-violet-400 via-blue-500 to-sky-600 flex items-center justify-center relative overflow-hidden'>
      <Routes>
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/login' element={<Login/>} />
      </Routes>

    </div>
  )
}

export default Authentications;
