import React, {useState, useEffect} from "react";

function Featured({company}) {
    let [loading, setLoading] = useState(true)
    let [comData, setData] = useState({})
    let [comName, setComName] = useState([])

    useEffect(() =>{
        fetch(`http://${process.env.REACT_APP_API_URL}/company/lookup/${company}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.data)
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
        
    }, [])

    return (
        <div>
            {
                !loading &&
                <div className="featureList">
                    <div className="row d-flex align-items-center">
                        <div className="col-8 d-flex align-items-left">
                            <h1>{company}</h1>
                        </div>
                        <div className="col-4">

                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Featured