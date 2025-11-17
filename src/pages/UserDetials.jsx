import { useState, useEffect } from 'react'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { ListPaging } from '../cmps/ListPaging.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service'
import { useNavigate } from 'react-router-dom'

export function UserDetails() {
    const [bugs, setBugs] = useState([])
    const [filterByToEdit, setFilterByToEdit] = useState(bugService.getDefaultFilter())
    const [totalPages, setTotalPages] = useState(0)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const loggedInUser = userService.getLoggedinUser()
        if (!loggedInUser) navigate('/')
        setUser(loggedInUser)
    }, [])


    /*
    useEffect(() => {
        loadBugs()
    }, [])
    */

    useEffect(() => {
        console.log('Filter Changed', filterByToEdit)
        loadBugs()
    }, [filterByToEdit])

    useEffect(() => {
        console.log('User Changed', user)
        setFilterByToEdit(prev => ({ ...prev, owner: user? user._id : undefined }))
        }
    , [user])

    useEffect(() => {
        if (bugs.length === 0 && filterByToEdit.pageIdx > 0) {
            setFilterByToEdit(prev => ({ ...prev, pageIdx: filterByToEdit.pageIdx - 1 }))
        } 
    }, [bugs])

    async function loadBugs() {
        const [bugs, totalPages] = await bugService.query(filterByToEdit)
        setBugs(bugs)
        setTotalPages(totalPages)
    }


    function onSetFilter(filterBy) {
        setFilterByToEdit({...filterBy, owner: user? user._id : undefined} )
    }


    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            console.log('Deleted Succesfully!')
            setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
            showSuccessMsg('Bug removed')
            loadBugs()
        } catch (err) {
            console.log('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    async function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            labels: prompt('Bug labels?').split(',').map(label => label.trim())
        }
        try {
            const savedBug = await bugService.save(bug)
            console.log('Added Bug', savedBug)
            setBugs(prevBugs => [...prevBugs, savedBug])
            showSuccessMsg('Bug added')
            loadBugs()
        } catch (err) {
            console.log('Error from onAddBug ->', err)
            showErrorMsg('Cannot add bug')
        }
    }

    async function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        try {

            const savedBug = await bugService.save(bugToSave)
            console.log('Updated Bug:', savedBug)
            setBugs(prevBugs => prevBugs.map((currBug) =>
                currBug._id === savedBug._id ? savedBug : currBug
            ))
            showSuccessMsg('Bug updated')
        } catch (err) {
            console.log('Error from onEditBug ->', err)
            showErrorMsg('Cannot update bug')
        }
    }

    return (
        <section >
            <h3>{user?.fullname}</h3>
            <main>
                <BugFilter filterBy={filterByToEdit} onChangeFilter={onSetFilter} />
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
                <ListPaging page={filterByToEdit.pageIdx} totalPages={totalPages} onSetPage={(num) => setFilterByToEdit(prev => ({ ...prev, pageIdx: num }))} />
            </main>
        </section>
    )
}