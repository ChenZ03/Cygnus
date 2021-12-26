import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom'

function Featured({company}) {
    let [loading, setLoading] = useState(true)
    let [comData, setData] = useState({})
    let [comName, setComName] = useState([])

    const navigate = useNavigate()

    useEffect(() =>{
        fetch(`http://${process.env.REACT_APP_API_URL}/company/lookup/${company}`)
        .then(response => response.json())
        .then(data => {
            if(data.data.result.length > 0) {
                fetch(`http://${process.env.REACT_APP_API_URL}/company/quote/${company}`)
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
        navigate("/stock", {state : {company : company}})
    }

    return (
        <div>
            {
                !loading &&
                <div className="featureList" onClick={onClickHandler}>
                    <div className="row d-flex align-items-center">
                        <div className="col-8">
                            <h2>{comName[1]} - {comName[0]}</h2>
                        </div>
                        <div className="col-4"  d-flex >
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