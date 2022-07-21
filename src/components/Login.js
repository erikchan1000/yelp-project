import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import {useAuth} from './Firebase/AuthContext'
import {Link, useNavigate} from 'react-router-dom'
import './Login.css'


export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const {login} = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()


        try {
            setError(null)
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate('/')
        } catch  (err) {
            setError('Error: ' + err.message)
        }
        setLoading(false)
    }


  return (
    <>
        {/* <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Yelp Notifications Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <div className='login-form'>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">Login</Button>
                    </Form>
                </div>
                <div className='w-100 text-center mt-3'>
                    <Link to='/forgot-password'>Forgot Password?</Link>
                </div>
            </Card.Body>
        </Card> */}

        <div className="login-box">
            {error && <Alert variant="danger">{error}</Alert>}
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="user-box">
                <input type="email" ref={emailRef} name="" required/>
                <label>Username</label>
                </div>
                <div className="user-box">
                <input type="password" ref={passwordRef} name="" required/>
                <label>Password</label>
                </div>
                <button type="submit" class="btn">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Login
                </button>
            </form>
            <div className='w-100 text-center mt-3'>
            <Link to='/forgot-password'>Forgot Password?</Link>
            </div>
            
            <div className="w-100 text-center mt-2">
            Need an Account? <Link to="/signup">Sign Up</Link>
            </div>
        </div>
     
    </>
  )
}
