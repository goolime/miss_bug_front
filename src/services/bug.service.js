import Axios from 'axios'
const axios = Axios.create({
    withCredentials: true
})

const BASE_URL = `http://localhost:10000/api/bug/`

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}


function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
        .then(([bugs, totalPages]) => [bugs, totalPages])
}
function getById(bugId) {
    return axios.get(`${BASE_URL}${bugId}`)
        .then(res => res.data)
}
async function remove(bugId) {
     const url = BASE_URL + bugId
    try {
        const { data } = await axios.delete(url)
        return data
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}
async function save(bug) {
    const url = BASE_URL + (bug._id || '')
    const method = bug._id ? 'put' : 'post'

    try {
        const { data: savedBug } = await axios[method](url, bug)
        return savedBug
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        minSeverity: 0,
        labels: [],
        sortBy: 'txt',
        orderBy: 1,
        pageIdx: 0
    }
}