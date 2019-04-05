const DELTA = 2

function getPaginationWithDots(currentPage, amountOfPages) { // Credit to users "kottentator" and "anotherstarburst" on gist.github, comment here: https://gist.github.com/kottenator/9d936eb3e4e3c3e02598#gistcomment-2209229
    console.log("currentPage:", currentPage);

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
            if (i - l === 2) {  // TODO: förstå den här if-satsen
                rangeWithDots.push({
                    value: l + 1,
                    isNumber: true
                })
            } else if (i - l !== 1) {
                rangeWithDots.push({
                    value: '...',
                    isnumber: false
                })
            }
        }
        rangeWithDots.push({
            value: i,
            isNumber: true
        })
        l = i
    }

    return rangeWithDots
}

exports.getPaginationWithDots = getPaginationWithDots