import React, {useState, useEffect} from 'react'
import '../assets/css/watchList.css'

function WatchListCom({company, onClick}){
    const [sdata, setData] = useState(null)

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_API_URL}/company/quote/${company}`)
        .then(response => response.json())
        .then(data => {
           setData(data.data)
        })
    }, [company])
    return(
        <div className="container watch-list-item d-flex justify-content-between align-items-center"  onClick={e => {
            e.preventDefault();
            onClick(company)
            }}>
            <div className="row text-center w-100">
                <div className="col-xl-3 d-flex align-items-center justify-content-center">
                    <h2>{company}</h2>
                </div>
                <div className="col-xl-9">
                    {
                        sdata &&
                        <table>
                            <thead>
                                <tr>
                                    <th>OPEN</th>
                                    <th>HIGH</th>
                                    <th>LOW</th>
                                    <th>CURRENT</th>
                                    <th>PREVIOUS CLOSE</th>
                                    <th>CHANGE</th>
                                    <th>PERCENT CHANGE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{sdata.o}</td>
                                    <td>{sdata.h}</td>
                                    <td>{sdata.l}</td>
                                    <td>{sdata.c}</td>
                                    <td>{sdata.pc}</td>
                                    <td>{sdata.d}</td>
                                    <td className={sdata.d < 0 ? "lose" : "win"}>{sdata.dp}</td>
                                </tr>
                            </tbody>
                        </table>
                    }
                   
                </div>
            </div>
        
        
        </div>
    )
}

export default WatchListCom