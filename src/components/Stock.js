import React, {useState, useEffect} from 'react';
import Header from './Header'
import Nav from './Nav'
import {useLocation} from 'react-router-dom'
import '../assets/css/Stock.css'

function Stock() {
    const location = useLocation()
    const company = location.state.company
    const [hasData, setHasData] = useState(true)
    const [loading, setLoading] = useState(true)
    const [chartLoading, setChartLoading] = useState(true)
    const [interval, setInterval] = useState('day')
    const [companyData, setCompanyData] = useState({}) // Finn
    const [companyData2, setCompanyData2] = useState({}) // Alpha
    const [companyNews, setCompanyNews] = useState([]) // Finn
    const [chart, setChart] = useState([]) // Alpha
    const [trends, setTrends] = useState([]) // Finn
    const [earnings, setEarnings] = useState([]) // Alpha + surprise data
    const [reddit, setReddit] = useState([]) // Finn
    const [twitter, setTwitter] = useState([]) // Finn
    const [insiderTrans, setInsiderTrans] = useState([]) // Finn


    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_API_URL}/company/companyData/${company}`)
        .then(response => response.json())
        .then(async (data) => {
            if(data.data.hasOwnProperty('name')){
                setCompanyData(data.data)
                await fetch(`http://${process.env.REACT_APP_API_URL}/company/companyNews/${company}`)
                .then(response => response.json())
                .then(data => setCompanyNews(data.data))

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/trends/${company}`)
                .then(response => response.json())
                .then(data => setTrends(data.data))

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/social/${company}`)
                .then(response => response.json())
                .then(data => {
                    setReddit(data.data.reddit)
                    setTwitter(data.data.twitter)
                })

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/insider/${company}`)
                .then(response => response.json())
                .then(data => {
                    setInsiderTrans(data.data.data)
                })

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/companyData2/${company}`)
                .then(response => response.json())
                .then(data => setCompanyData2(data.data))

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/earnings/${company}`)
                .then(response => response.json())
                .then(data => {
                    setEarnings(data.data.annualEarnings)
                })

               setLoading(false)
            }else{
                setHasData(false)
            }
        })

    }, [company])

    useEffect(() => {

    }, [interval])


    return(
        <>
        {
            localStorage.hasOwnProperty('userData') &&
            <div className="stock">
                {<Header />}
                {<Nav />}
                {
                    (!loading && hasData) &&
                    <div className="stockData">
                        {console.log(earnings)}
                    </div>
                }
            </div>  
        }
        </>
    )
}

export default Stock