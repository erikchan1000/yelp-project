import React from 'react'
import NavBar from './NavBar'
import { useAuth } from './Firebase/AuthContext'
import {Link, useNavigate} from 'react-router-dom'
import {useState} from 'react'
import {Alert} from 'react-bootstrap'


export default function Dashboard() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const {currentUser, logout} = useAuth()

  async function handleLogOut() {
    setError(null)
    
    try {
      await logout()
      navigate('/')
    }
    catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
        <NavBar/>
        {error && <Alert variant="danger">{error}</Alert>}
        <button onClick={handleLogOut}>Log Out</button>
    </div>
  )
}
