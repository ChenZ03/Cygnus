import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'

function Featured({company, editing, setE}) {
    let [loading, setLoading] = useState(true)
    let [comData, setData] = useState({})
    let [comName, setComName] = useState([])
    let [name, setName] = useState(company.code)
    const navigate = useNavigate()

    useEffect(() =>{
        fetch(`http://${process.env.REACT_APP_API_URL}/company/lookup/${company.code}`)
        .then(response => response.json())
        .then(data => {
            if(data.data.result.length > 0) {
                fetch(`http://${process.env.REACT_APP_API_URL}/company/quote/${company.code}`)
                .then(response2 => response2.json())
                .then(data2 => {
                    setComName([data.data.result[0].description, data.data.result[0].displaySymbol])
                    setData(data2.data)
                    setLoading(false) 
                })
            }
        })
        
    }, [company])

    const onClickHandler = e => {
        e.preventDefault()
        navigate("/stock", {state : {company : company.code}})
    }

    const onChangeHandler = e => {
        e.preventDefault()
        setName(e.target.value)
    }

    const confirmChange = e => {
        e.preventDefault()
        fetch(`http://${process.env.REACT_APP_API_URL}/company/lookup/${company.code}`)
        .then(response => response.json())
        .then(data => {
            if(data.data.result.length > 0) {
                fetch(`http://${process.env.REACT_APP_API_URL}/data/featured`, {
                    method : 'PUT',
                    headers : {'Content-Type': 'application/json'},
                    body : JSON.stringify({name, id : company._id})
                })
                .then(response => response.json())
                .then(data => {
                    if(data.msg === 'success') {
                        Swal.fire({
                            icon : "success",
                            title : "Update Successfully"
                        })
                        setE()
                    }else{
                        Swal.fire({
                            icon : "error",
                            title : "Error"
                        })
                    }
                })
            }else{
                Swal.fire({
                    icon : "error",
                    title : "Company Dosent Exist"
                })
            }
        })
        
    }

    return (
        <div>
            {
                !loading &&
                <div className="featureList" onClick={!editing ? onClickHandler : null}>
                    <div className="row d-flex align-items-center">
                        {
                            editing ?
                            <div className="col-8">
                                <input type="text" className="search" value={name} onChange={onChangeHandler}/>
                                <button onClick={confirmChange}>Confirm</button>
                            </div>
                            :
                            <div className="col-8">
                                <h2>{comName[1]} - {comName[0]}</h2>
                            </div>
                        }
                        <div className="col-4 d-flex" >
                            <div className="comData">
                                <div className="d-flex"> 
                                    <h1>{comData.c}</h1>
                                    <h4 className="align-self-end px-3">USD</h4>
                                </div>
                                <div className="d-flex align-items-right">
                                    <p className={comData.d < 0 ? "lose" : "win"}>{comData.d} / today</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Featured