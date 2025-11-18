import Axios from 'axios'
const axios = Axios.create({
    withCredentials: true
})

const BASE_URL = `https://miss-bug-back-6cjh.onrender.com/:10000/api/`

export const userService = {
    login,
    signup,
    logout,
    getUsers,
    getEmptyUser,
    getLoggedinUser
}

async function login(credentials) {
    console.log('user Service login credentials:', credentials);
    try {
        const res = await axios.post(`${BASE_URL}auth/login`, credentials)
        if (res.status !== 200) throw new Error('Failed to login')
        if (res.data) saveLocalUser(res.data)
        return res.data
    }
    catch (err) {
          console.error(err)
    }
}

async function signup(credentials) {
    try {
        const res = await axios.post(`${BASE_URL}auth/signup`,  credentials)
        console.log('signup response:', res);
        if (res.status !== 200) throw new Error('Failed to signup')
        if (res.data) saveLocalUser(res.data)
        return res.data
    }
    catch (err) {
          console.error(err)
    }
}

async function logout() {
    try {
        const res = await axios.post(`${BASE_URL}auth/logout`)
        if (res.status !== 200) throw new Error('Failed to logout')
        sessionStorage.removeItem('loggedinUser')
        return res.data
    }
    catch (err) {
          console.error(err)
    }
}   

async function getUsers() {
    try {
        const res = await axios.get(`${BASE_URL}user`)
        return res.data
    }
    catch (err) {
          console.error(err)
    }
}  

function saveLocalUser(user) {
    sessionStorage.setItem('loggedinUser', JSON.stringify(user))
}

export function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem('loggedinUser') || 'null')
}

function getEmptyUser() {
    return {
        username: '',
        password: '',
        fullname: '',
        score: 100
    }
}
