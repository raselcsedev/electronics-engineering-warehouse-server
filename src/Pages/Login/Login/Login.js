import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { useSendPasswordResetEmail, useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import auth from '../../../firebase.init';
import Social from '../Social/Social';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Shared/Loading/Loading';
import google from '../../../images/social/google.png';

const Login = () => {
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const navigate = useNavigate();
    const location = useLocation();
    let from = location.state?.from?.pathname || '/';
    let errorShow;

    const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);
    const [sendPasswordResetEmail] = useSendPasswordResetEmail(auth);
    if (user || gUser) {
        navigate(from, {replace:true});
    };

    if (loading || gLoading) {
        return <Loading></Loading>
    }

    if (error || gError) {
        errorShow = <div>
            <p className='text-danger'>Error: {error.message}</p>
        </div>

    };

    const handleSubmit = event => {
        event.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        signInWithEmailAndPassword(email, password);

    }

    const navigateRegister = event => {
        navigate('/register');
    }

    const passwordReset = async() =>{
        const email = emailRef.current.value;
        if(email){
            await sendPasswordResetEmail(email);
        toast('send email');
        }  
        else{
            toast('Enter your Email');
        }      
    }

    return (
        <div className='container w-50 mx-auto'>
            <h2 className='text-info mt-3'>Please login</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">

                    <Form.Control ref={emailRef} type="email" placeholder="Enter email" required />

                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">

                    <Form.Control ref={passwordRef} type="password" placeholder="Password" required />
                </Form.Group>
                <Button variant="info" type="submit">
                    Login
                </Button>
            </Form>
            {errorShow}
            <p>New User ? <Link to='/register' className='text-danger w-25 pe-auto text-decoration-none' onClick={navigateRegister}>Please Register</Link></p>

            <p>Forgot Password? <button className='text-danger w-25 pe-auto text-decoration-none btn btn-link' onClick={passwordReset}>Reset Password</button></p>
            
            <button
                onClick={() => signInWithGoogle()}
                className='btn btn-info w-50 d-block my-2'>
                <img style={{ width: '30px' }} src={google} alt="" />
                <span className='px-2'>Google Sign In</span>
            </button>
            <ToastContainer />
        </div>
    );
};

export default Login;