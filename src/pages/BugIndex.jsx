import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import { BugFilter } from '../cmps/bugFilter.jsx'
import { ListPaging } from '../cmps/ListPaging.jsx'


export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [filterByToEdit, setFilterByToEdit] = useState(bugService.getDefaultFilter())
    const [totalPages, setTotalPages] = useState(0)

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
        if (bugs.length === 0 && filterByToEdit.pageIdx > 0) {
            setFilterByToEdit(prev => ({ ...prev, pageIdx: filterByToEdit.pageIdx - 1 }))
        } 
    }, [bugs])

    async function loadBugs() {
        const [bugs, totalPages] = await bugService.query( filterByToEdit)
        setBugs(bugs)
        setTotalPages(totalPages)
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
            <h3>Bugs App</h3>
            <main>
                <BugFilter filterBy={filterByToEdit} onSetFilterBy={setFilterByToEdit} />
                {sessionStorage.getItem('loggedinUser') && <button onClick={onAddBug}>Add Bug ⛐</button>}
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
                <ListPaging page={filterByToEdit.pageIdx} totalPages={totalPages} onSetPage={(num) => setFilterByToEdit(prev => ({ ...prev, pageIdx: num }))} />
            </main>
        </section>
    )
}
