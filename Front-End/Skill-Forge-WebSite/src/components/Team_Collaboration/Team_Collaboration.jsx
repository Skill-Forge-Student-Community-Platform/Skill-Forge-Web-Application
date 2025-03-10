import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

export const Team_Collaboration = () => {
  return (
    <div>
        Team_Collaboration
        <Routes>
            <Route path='/inbox' element={<Inbox/>}></Route>
            <Route path='/teams' element={<Teams/>}></Route>
        </Routes>
    </div>
  )
}
