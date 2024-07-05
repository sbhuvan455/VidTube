import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home.jsx'
import Navbar from '@/components/Navbar'
import LoginPage from '@/pages/Sign'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route
        path='/'
        element={<Navbar />}
      >
        <Route path='/' element={<Home />} />
        <Route path='/authentication' element={<LoginPage />} />
      </Route>
    </Routes>
  )
}

export default App
