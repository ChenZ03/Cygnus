import React, {useState, useEffect} from 'react';
import Header from './Header'
import Nav from './Nav'
import {useLocation} from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';
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
    const [earnings, setEarnings] = useState([]) // Alpha 
    const [quarterEarnings, setQuarterEarnings] = useState([]) // Alpha
    const [reddit, setReddit] = useState([]) // Finn
    const [twitter, setTwitter] = useState([]) // Finn
    const [insiderTrans, setInsiderTrans] = useState() // Finn
    const [quote, setQuote] = useState({}) // Finn


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

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/quote/${company}`)
                .then(response => response.json())
                .then(data => setQuote(data.data))

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/earnings/${company}`)
                .then(response => response.json())
                .then(data => {
                    setEarnings(data.data.annualEarnings)
                    setQuarterEarnings(data.data.quarterlyEarnings)
                })

               setLoading(false)
            }else{
                setHasData(false)
            }
        })


    }, [company])

    useEffect(() => {

    }, [interval])

    if(!loading) {

        var generalData = Object.keys(companyData2).map((ele, index) => {
            if(index > 14){
                return(
                    <tr key={ele}>
                        <td>{ele}</td>
                        <td>{companyData2[ele]}</td>
                    </tr>
                )
            }
            return(
                <></>
            )
        })

        var news = []

        if(companyNews.length > 3){
            for(let i = 0; i < 3 ; i ++){
                news.push(companyNews[i])
            }
    
            var showNews = news.map(e => {
                return(
                    <div className="row" key={e.id}>
                        <div className="col-4">
                            <img src={e.image} alt={e} className="img-fluid news-img"/>
                        </div>
                        <div className="col-8">
                            <h2 className="news-headline">{e.headline}</h2>
                            <p className="news-summary">{e.summary}</p>
                            <a className="news-link" href={e.url} target="_blank" rel="noreferrer">Read Details</a>
                        </div>
                    </div>
                )
            })
        }

        if(insiderTrans.length > 0){
            var showInsiders = insiderTrans.map(trans => {
                return(
                    <div className="insiderElement d-flex justify-content-between px-4 py-2" key={trans.name}>
                        <h3>{trans.name}</h3>
                        <ul className="insidersul">
                            <li><h4>Share : {trans.share}</h4></li>
                            <li><h4>Change : {trans.change}</h4></li>
                            <li><h4>Price : {trans.transactionPrice} USD</h4></li>
                        </ul>
                    </div>
                )
            })
        }

        
    }


    return(
        <>
        {
            localStorage.hasOwnProperty('userData') &&
            <div className="stock">
                {<Header />}
                {<Nav />}
                {
                    (!loading && hasData) &&
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-center py-5">
                            <a className="companyLink" rel="noreferrer" target="_blank" href={companyData.weburl}><h1>{companyData.name} - {companyData.ticker}</h1></a>
                            <button className="view">Add to watchList</button>
                        </div>
                        <div className="description d-flex">
                            <div className="row py-3">
                                <div className="col-xl-6 py-4">
                                    <p className="text-left">{companyData2.Description}</p>
                                </div>
                                <div className="col-xl-6 px-5 py-4">
                                    <ul>
                                        <li><h5>CURRENCY - {companyData2.Currency}</h5></li>
                                        <li><h5>COUNTRY - {companyData2.Country}</h5></li>
                                        <li><h5>ADDRESS - {companyData2.Address}</h5></li>
                                        <li><h5>SECTOR - {companyData2.Sector}</h5></li>
                                        <li><h5>INDUSTRY - {companyData2.Industry}</h5></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="latest">
                            <div className="row py-5">
                                <div className="col-xl-4 d-flex align-items-center justify-content-center">
                                    <h1>Latest Quote :</h1>
                                </div>
                                <div className="col-xl-8 d-flex align-items-center justify-content-center">
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
                                                <td>{quote.o}</td>
                                                <td>{quote.h}</td>
                                                <td>{quote.l}</td>
                                                <td>{quote.c}</td>
                                                <td>{quote.pc}</td>
                                                <td>{quote.d}</td>
                                                <td className={quote.d < 0 ? "lose" : "win"}>{quote.dp}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="generalData py-5">
                            <div className="row">
                                <div className="col-12 d-flex align-items-center justify-content-center py-3">
                                    <h1>General Data :</h1>
                                </div>
                                <div className="col-12 d-flex align-items-center justify-content-center">
                                     <table>
                                        <tbody>
                                            {generalData}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <br />
                        <h1 className="text-center"> Analytics : </h1>
                        {
                            !chartLoading &&
                            <div className="chart py-5">

                            </div>
                        }
                        <div className="trends py-5">

                        </div>
                        <div className="insiders py-5">
                            <div className="row insiders-logo">
                                <div className="col-12 d-flex align-items-center justify-content-left">
                                    <i className="fas fa-mask"></i>
                                    <h1>INSIDERS TRADES</h1>
                                </div>
                            </div>
                            <div className="insidersBox py-5">
                                {
                                    insiderTrans.length > 0 ?
                                    showInsiders
                                    :
                                    <h1>NO INSIDERS TRANSACTIONS</h1>
                                }
                            </div>
                        </div>
                        <div className="earnings py-5">

                        </div>
                        <div className="quarterEarnings py-5">

                        </div>
                        <div className="social py-5">

                        </div>
                        {
                            companyNews.length > 3 &&
                            <div className="comNews">
                                <h1 className="text-center py-4">NEWS :</h1>
                                {showNews}
                            </div>
                        }
                    </div>
                }
            </div>  
        }
        </>
    )
}

export default Stock