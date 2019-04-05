const DELTA = 2


function pagination(currentPage, amountOfPages) { // Credit to user "anotherstarburst" on gist.github, comment here: https://gist.github.com/kottenator/9d936eb3e4e3c3e02598#gistcomment-2209229
    const delta = DELTA
    let range = []
    rangeWithDots = []

    range.push(1)

    if (amountOfPages <= 1) {
        return range
    }

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        if (i > 1 && i < amountOfPages) {
            range.push(i)
        }
    }
    range.push(amountOfPages)

    let l
    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1)
            } else if (i - l !== 1) {
                rangeWithDots.push("...")
            }
        }
        rangeWithDots.push(i)
        l = i
    }

    return rangeWithDots
}

exports.pagination = pagination