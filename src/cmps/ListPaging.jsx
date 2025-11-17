export function ListPaging({ page, totalPages, onSetPage }) {
    const handlePrevPage = () => {
        if (page > 0) {
            onSetPage(page - 1)
        }

    }

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            onSetPage(page + 1)
        }
    }

    return (
        <div className="list-paging">
            <button onClick={handlePrevPage} disabled={page === 0}>Previous</button>
            <span> Page {page + 1} of {totalPages} </span>
            <button onClick={handleNextPage} disabled={page === totalPages - 1} >Next</button>
        </div>
    )
}