import {useLocation, useNavigate} from 'react-router-dom'
import React, {useState, useEffect} from 'react'
import Header from './Header'
import Nav from './Nav'
import '../assets/css/Search.css'
import Swal from 'sweetalert2'

function Search() {
    const location = useLocation()
    const navigate = useNavigate()
    const [term, setTerm] = useState(location.state.term)
    const [companyList, setCompanyList] = useState([])
    const [companyList2, setCompanyList2] = useState([])
    const [loading, setLoading] = useState(true)
    const [empty, setEmpty] = useState(false)

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_API_URL}/company/lookup/${term}`)
        .then(response => response.json())
        .then(data => {
            if(data.data.count < 1){
                setEmpty(true)
            }else{
                let comData = []
                let comData2 = []
                let length = data.data.result.length
                for(let i = 0; i < length / 2; i++){
                    comData.push(data.data.result[i])
                    comData2.push(data.data.result[(Math.floor(length / 2)+ i)])
                }
                setCompanyList2(comData2)
                setCompanyList(comData)
            }
           
        })
        .then(setLoading(false))
    }, [term])

    const onClickHandler = e => {
        navigate('/stock', {state : {company : e}})
    }

    const search = e => {
        e.preventDefault()
        let newTerm = document.getElementById('search').value
        if(newTerm.length < 1) {
            Swal.fire("Please enter at least one character")
        }else{
            setLoading(true)
            setTerm(newTerm)
            setEmpty(false)
        }
    }

    return(
        <>
        {
            localStorage.hasOwnProperty('userData') &&
            <div className="searchPage">
                {<Header />}
                {<Nav />}
                <div className="d-flex align-items-center justify-content-center py-4">
                    <input type="text" className="search" placeholder="Search for stocks" id="search"/>
                    <button onClick={search}>Search</button>
                </div>
                {
                    !loading  &&
                    !empty ?
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="stockList ">
                            {
                                companyList.map((company, index) => {
                                    return(
                                        <div className="row" key={index}>
                                            <div className="col-xl-6">
                                                <div className="stockItem"  onClick={e => {
                                                    e.preventDefault()
                                                    onClickHandler(company.symbol)
                                                }}>
                                                    <div className="row d-flex align-items-center">
                                                        <div className="col-8">
                                                            <h2>{company.symbol} - {company.description}</h2>
                                                        </div>
                                                        <div className="col-4">
                                                            <h2>{company.type}</h2>
                                                        </div>
                                                    </div>             
                                                </div>  
                                            </div>
                                            <div className="col-xl-6">
                                                <div className="stockItem"  onClick={e => {
                                                    e.preventDefault()
                                                    onClickHandler(companyList2[index].symbol)
                                                }}>
                                                    <div className="row d-flex align-items-center">
                                                        <div className="col-8">
                                                            <h2>{companyList2[index].symbol} - {companyList2[index].description}</h2>
                                                        </div>
                                                        <div className="col-4">
                                                            <h2>{companyList2[index].type}</h2>
                                                        </div>
                                                    </div>             
                                                </div>  
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    <div className="d-flex align-items-center justify-content-center">
                        <h1>SEARCH FAILED</h1>
                    </div>
                }
            </div>
        }
        </>
    )
}

export default Search