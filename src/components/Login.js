import React, {useState, useRef, useEffect} from 'react'
import {Form} from 'react-bootstrap'
import jwt_decode from 'jwt-decode'
import '@fortawesome/fontawesome-free/css/all.min.css';
import BackdropFilter from "react-backdrop-filter";
import '../assets/css/Login.css'
import Swal from 'sweetalert2'
import {useNavigate} from "react-router-dom"

const clientId = '137944324026-ku0kjalf18s7c9r7qfaum4amgcahjlh4.apps.googleusercontent.com'

function Login() {
    const [register, setRegister] = useState(false)
    const btnDivRef = useRef()

    const navigate = useNavigate()

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
            fetch(`http://${process.env.REACT_APP_API_URL}/auth/user`, {
                method : 'POST',
                headers : {'Content-Type': 'application/json'},
                body : JSON.stringify({email})
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.msg)
                if(data.msg === "Not Found"){
                    Swal.fire({
                        icon : "error",
                        title : "User not found, please proceed to register"
                    })
                }else{
                    let code = Math.floor(100000 + Math.random() * 900000)
                    fetch(`http://${process.env.REACT_APP_API_URL}/auth/login`, {
                        method : 'POST',
                        headers : {'Content-Type': 'application/json'},
                        body : JSON.stringify({email, password, code})
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        if(data.msg === "Logged in succesfully"){
                            Swal.fire({
                                customClass: {
                                    input : 'swalInput'
                                },
                                title : "Two Factor Authentication",
                                text : "Enter the 6 digits code in your email address",
                                input : "text",
                                showCancelButton :true
                            })
                            .then(result => {
                                console.log(result.value, code);
                                if(parseInt(result.value) === code) {
                                    Swal.fire({
                                        icon : "success",
                                        title : "Login Successfully"
                                    })
                                    let decoded = jwt_decode(data.token)

                                    localStorage.setItem('userData', JSON.stringify(decoded))
                                    localStorage.setItem('token', data.token)
                                    navigate("/home")

                                }else{
                                    Swal.fire({
                                        icon : "error",
                                        title : "Invalid Code"
                                    })
                                }
                            })
                        }else{
                            Swal.fire({
                                icon : "error",
                                title : "Fail to Login"
                            })
                        }
                    })
                }
            })
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
            fetch(`http://${process.env.REACT_APP_API_URL}/auth/user`, {
                method : 'POST',
                headers : {'Content-Type': 'application/json'},
                body : JSON.stringify({email})
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg === "Not Found"){
                    if(password !== password2){
                        Swal.fire('Password does not match')
                        return
                    }

                    fetch(`http://${process.env.REACT_APP_API_URL}/auth/register`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({email, username, password})
                    })
                    .then(response => response.json())
                    .then(data => {
                        if(data.msg === "Succesfully registered"){
                            Swal.fire("Successfully Registered, please proceed to login")
                        }else{
                            Swal.fire("Error: Failed to register")
                        }
                    })
                }else{
                    Swal.fire('User Exist, Please proceed to login')
                }
            })
        }else{
            setRegister(true)
        }
       
    }

    return(
        <div className="MainPg tint">
            <div className="Logo">
                <h1 className="LgText mb-5">CYGNUS</h1>
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
                <Form className="d-flex justify-content-center align-items-center">
                    <div className="content">
                        <h1 className="log mb-5">{register ? "Register" : "Login"}</h1>
                        {
                            register &&
                            <Form.Group className="for">
                                <div className="formItem">
                                    <div className="icons d-flex align-items-center justify-content-center  ">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <input type="text" placeholder="Enter your username" id="username" className="formInt" autoComplete="off"/>
                                </div>   
                            </Form.Group>  
                        }
                        <Form.Group className="for">
                            <div className="formItem">
                                <div className="icons d-flex align-items-center justify-content-center  ">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <input type="email" placeholder="Enter your email address" id="email" className="formInt" autoComplete="off"/>
                            </div>   
                        </Form.Group>
                        <Form.Group className="for">
                            <div className="formItem">
                                <div className="icons d-flex align-items-center justify-content-center  ">
                                    <i className="fas fa-lock"></i>
                                </div>
                                <input type="password" placeholder="Enter your password" id="password" className="formInt" autoComplete="off"/>
                            </div>   
                        </Form.Group>
                        
                        {
                            register &&
                            <Form.Group className="for">
                                <div className="formItem">
                                    <div className="icons d-flex align-items-center justify-content-center  ">
                                        <i className="fas fa-lock"></i>
                                    </div>
                                    <input type="password" placeholder="Reenter your password" id="password2" className="formInt" autoComplete="off"/>
                                </div>   
                            </Form.Group>
                        }

                        <div className="d-flex justify-content-between mx-4">
                            <button className="m-2" onClick={loginHandler}>{register ? "Sign In" : "Login Now"}</button>
                            <button className="m-2" onClick={registerHandler}>{register ? "Register Now" : "Register"}</button>
                        </div>
                        
                        {/* <div>
                            <div id="buttonDiv" className="d-flex justify-content-center p-3 m-3" ref={btnDivRef}></div>
                        </div> */}
                    </div>
                </Form>
                </BackdropFilter>
            </div>

            

        </div>
    )
}
        
export default Login