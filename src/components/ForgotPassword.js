import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import {useAuth} from './Firebase/AuthContext'
import {Link} from 'react-router-dom'

export default function ForgotPassword() {
    const emailRef = useRef();
    const {resetPassword} = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault()


        try {
            setMessage(null)
            setError(null)
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your email for a link to reset your password.')
        } catch  (err) {
            setError('Error: ' + err.message)
        }
        setLoading(false)
    }


  return (
    <>
        {/* <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Password Reset</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Button disabled={loading} className="w-100" type="submit">Reset Password</Button>
                </Form>
                <div className='w-100 text-center mt-3'>
                    <Link to='/login'>Login</Link>
                </div>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Need an Account? <Link to="/signup">Sign Up</Link>
        </div> */}

        <div class="login-box">
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div class="user-box">
                <input type="email" ref={emailRef} name="" required/>
                <label>Email</label>
                </div>
                <button disabled={loading} type="submit" class="btn">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Reset
                </button>
            </form>
            <div className="w-100 text-center mt-2">
            Already have an account? <Link to="/login">Log in</Link>
            </div>
            <div className="w-100 text-center mt-2">
            Need an Account? <Link to="/signup">Sign Up</Link>
            </div>
        </div>        
    </>
  )
}
