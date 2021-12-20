import React, {useState, useRef, useEffect} from 'react'
import {Button, Form} from 'react-bootstrap'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import '../assets/css/Login.css'

const clientId = '137944324026-ku0kjalf18s7c9r7qfaum4amgcahjlh4.apps.googleusercontent.com'

function Login() {
    const [register, setRegister] = useState(false)
    const btnDivRef = useRef()

    useEffect(() => { 
        const handleGoogleSignIn = async res => {
            let decoded = jwt_decode(res.credential)  
            console.log(decoded.email)
        }
    
        const initializeGsi = _ => {
            if(!window.google) return;
           
            window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn
            });
            window.google.accounts.id.renderButton(
            btnDivRef.current,
            { theme: "outline", size: "large" }  // customization attributes
            );
    
        }
    
        const script = document.createElement('script')
        script.src = "https://accounts.google.com/gsi/client"
        script.onload = initializeGsi
        script.async = true
        script.id = 'google-script'
        document.querySelector('head')?.appendChild(script)
    
        return _ => {
            document.getElementById("google-script")?.remove()
            window.google?.accounts.id.cancel()
        }
    }, [])

    const loginHandler = e => { 
        e.preventDefault()
        if(!register){
            let email = document.getElementById('email').value
            let password = document.getElementById('password').value
            window.alert("Login")
        }else{
            setRegister(false)
        }
    }   

    const registerHandler = e => {
        e.preventDefault()
        if(register){
            let username = document.getElementById("username").value
            let email = document.getElementById('email').value
            let password = document.getElementById('password').value
            let password2 = document.getElementById('password2').value
            window.alert("Register")
        }else{
            setRegister(true)
        }
       
    }

    return(
        <div className="MainPg">
            <Form>
                {
                    register &&
                    <Form.Group className="mb-3">
                        <Form.Label>Username :</Form.Label>
                        <Form.Control type="text" placeholder="Enter your username" id="username" />
                    </Form.Group>
                }
                <Form.Group className="mb-3">   
                    <Form.Label>Email :</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email address" id="email"/>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">   
                    <Form.Label>Password :</Form.Label>
                    <Form.Control type="password" placeholder="Enter your password" id="password"/>
                </Form.Group>
                
                {
                    register &&
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password :</Form.Label>
                        <Form.Control type="password" placeholder="Renter your password" id="password2"/>
                    </Form.Group>
                }
                
                <Button className="m-2 btn btn-primary" onClick={loginHandler}>{register ? "Login" : "Login Now"}</Button>
                <Button className="m-2 btn btn-secondary" onClick={registerHandler}>{register ? "Register Now" : "Register"}</Button>
            </Form>

            <div id="buttonDiv" ref={btnDivRef}></div>

        </div>
    )
}
        
export default Login