import React from 'react'
import CustomerReport from './Pages/CustomerReport'
import Profile from './Pages/Profile';
import Setting from './Pages/Setting';
import {Routes, Route} from 'react-router-dom'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<CustomerReport />}/>
        <Route path='/profile' element={<Profile />} />
        <Route path='/setting' element={<Setting />}/>
      </Routes>
    </>
  )
}

export default App;
