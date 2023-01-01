import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import MapVerifier from './MapVerifier'

export default function Profile(props) {

    const [loading, setLoading] = useState(true);
    const location = useLocation()


    let user = props.user

    let { username } = useParams()

    if (!loading) {
        user = props.allUsers.find(u => u.username === username)
    }

    useEffect(() => {
        if (props.allUsers) {
            setLoading(false)
        }
    }, [props.allUsers])


    useEffect(() => {
        window.localStorage.setItem('path', JSON.stringify(location.pathname))
    }, [])

    if (loading) {
        return (
            <h1>LOADING...</h1>
        )
    }

    return (
        <div>
            <MapVerifier longitude={user.longitude} latitude={user.latitude} anchor="bottom" />
            <div className="d-flex flex-column justify-content-start col-12 col-lg-8 offset-lg-2">
                {user.username === props.user.username &&
                    <h2 className="mt-4 mb-4 text-center card-text fw-bold">
                        Hi, {user.firstName}</h2>}
                {user.username !== props.user.username &&
                    <h2 className="mt-4 mb-4 text-center card-text fw-bold">
                        Viewing {user.firstName}'s profile</h2>}
                <ul className="list-group primary-border">
                    <li className="list-group-item card-text d-flex justify-content-between"><b>Name:</b> <span>{user.firstName} {user.lastName}</span></li>
                    <li className="list-group-item card-text d-flex justify-content-between"><b>Username:</b> <span>{user.username}</span></li>
                    <li className="list-group-item card-text d-flex justify-content-between text-end"><b>Address:</b> <span>{user.address}</span></li>
                </ul>
            </div>
        </div>
    )

}