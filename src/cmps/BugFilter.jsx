import { useEffect, useRef, useState } from "react"
import { debounce } from "../services/util.service.js"
import { bugService } from "../services/bug.service.js"

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const onSetFilterByDebounce = useRef(debounce(onSetFilterBy, 400)).current

    useEffect(() => {
        onSetFilterByDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        if (field === 'labels') {
            value = value ? value.split(',').map(label => label.trim()) : []
        }

        console.log('handleChange', field, value)
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }


    const { txt, minSeverity, labels, sortBy, orderBy } = filterByToEdit
    return (
        <section className="car-filter">
            <h2>Filter Our Cars</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Vendor: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Vendor" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                <label htmlFor="labels">Labels: </label>
                <input value={labels} onChange={handleChange} type="text" placeholder="By Labels" id="labels" name="labels" />

                <select name="sortBy" value={sortBy} onChange={handleChange}>
                    <option value="txt">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                </select>

                <select name="orderBy" value={orderBy} onChange={handleChange}>
                    <option value={1}>Asc</option>
                    <option value={-1}>Desc</option>
                </select>


                <button onClick={()=>setFilterByToEdit(bugService.getDefaultFilter())}>clear Filter</button>
            </form>
        </section>
    )
}