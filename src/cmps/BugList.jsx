
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { userService } from '../services/user.service.js'
import { BugPreview } from './BugPreview'

export function BugList({ bugs, onRemoveBug, onEditBug }) {
    const [user, setUser] = useState(null)

    
    useEffect(() => {
        const loggedInUser = userService.getLoggedinUser()
        setUser(loggedInUser)
    }, [])
    
    return (
        <ul className="bug-list">
            {bugs.map((bug) => {

                return (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    <div>
                        {(user?.isAdmin || user?._id === bug.creator._id) &&<>
                            <button
                                onClick={() => {
                                    onRemoveBug(bug._id)
                                }}
                            >
                                x
                            </button>
                            <button
                                onClick={() => {
                                    onEditBug(bug)
                                }}
                            >
                                Edit
                            </button>
                        </> }
                    </div>
                    <Link to={`/bug/${bug._id}`}>Details</Link>
                </li>
            )}
            )}
        </ul>
    )
}
