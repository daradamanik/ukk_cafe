import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getLocalStorage } from '../helper/localStorage'
import { LOCAL_STORAGE_TOKEN, LOCAL_STORAGE_USER } from '../helper/helper'
import {AdminLayout} from '../../components/layout/Layout'

const userAuth = () => {
    const token = getLocalStorage(LOCAL_STORAGE_TOKEN)
    const user = getLocalStorage(LOCAL_STORAGE_USER)

    if(token) {
        return {
            token: token,
            user: user.role
        }
    } else {
        return false
    }
}

const ProtectedRoute = () => {
    const {token} = userAuth()
    return token ? (
        <Outlet render = {(props) => <AdminLayout {...props}/>}/>
    ) : (
        <Navigate to='/login'/>
    )
}

export default ProtectedRoute