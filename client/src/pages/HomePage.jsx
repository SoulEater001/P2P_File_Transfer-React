import React from 'react'
import { Link } from "react-router-dom"
const HomePage = () => {
    return (
        <div>
            <div>
                <Link to="/send"><button>Send</button></Link>
                <Link to="/receive"><button>Receive</button></Link>
            </div>
        </div>
    )
}

export default HomePage
