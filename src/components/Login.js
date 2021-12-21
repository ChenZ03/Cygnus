import React, {useState, useRef, useEffect} from 'react'
import {Button, Form} from 'react-bootstrap'
import jwt_decode from 'jwt-decode'
import '@fortawesome/fontawesome-free/css/all.min.css';
import BackdropFilter from "react-backdrop-filter";
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
        <div className="MainPg tint">
            <div className="Logo">
                <h1 className="LgText">CYGNUS</h1>
            </div>
            <div className="d-flex justify-content-center">
                <BackdropFilter
                    className="formBox"
                    filter={"blur(30px) sepia(5%) "}
                    canvasFallback={true}
                    html2canvasOpts={{
                        allowTaint: true
                    }}
                    onDraw={() => {
                        console.log("Rendered !");
                    }}
                >
                <Form>
                    <div className="content">
                        <h1 className="log mb-5">{register ? "Register" : "Login"}</h1>
                        {
                            register &&
                            <Form.Group className="for">
                                <div className="formItem">
                                    <div className="icons d-flex align-items-center justify-content-center  ">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <input type="text" placeholder="Enter your username" id="username" className="formInt"/>
                                </div>   
                            </Form.Group>  
                        }
                        <Form.Group className="for">
                            <div className="formItem">
                                <div className="icons d-flex align-items-center justify-content-center  ">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <input type="email" placeholder="Enter your email address" id="email" className="formInt"/>
                            </div>   
                        </Form.Group>
                        <Form.Group className="for">
                            <div className="formItem">
                                <div className="icons d-flex align-items-center justify-content-center  ">
                                    <i className="fas fa-lock"></i>
                                </div>
                                <input type="password" placeholder="Enter your password" id="password" className="formInt"/>
                            </div>   
                        </Form.Group>
                        
                        {
                            register &&
                            <Form.Group className="for">
                                <div className="formItem">
                                    <div className="icons d-flex align-items-center justify-content-center  ">
                                        <i className="fas fa-lock"></i>
                                    </div>
                                    <input type="password" placeholder="Reenter your password" id="password2" className="formInt"/>
                                </div>   
                            </Form.Group>
                        }

                        <div className="d-flex justify-content-between mx-4">
                            <button className="m-2" onClick={loginHandler}>{register ? "Sign In" : "Login Now"}</button>
                            <button className="m-2" onClick={registerHandler}>{register ? "Register Now" : "Register"}</button>
                        </div>
                        
                        <div>
                            <div id="buttonDiv" className="d-flex justify-content-center p-3 m-3" ref={btnDivRef}></div>
                        </div>
                    </div>
                </Form>
                </BackdropFilter>
            </div>

            

        </div>
    )
}
        
export default Login