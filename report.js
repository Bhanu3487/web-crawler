function printReport(pages){
    console.log("========================================");
    console.log("REPORT");
    console.log("========================================");
    const sortedPages = sortPages(pages)
    for(const sortedPage in sortedPages){
        const url = sortedPage[0];
        const hits = sortedPage[1];
        console.log(`found ${hits} links to page: ${url}`);
    }
}

function sortPages(pages){
    pagesArr = Object.entries(pages);
    pagesArr.sort((a,b)=>{
        const aHits = a[1];
        const bHits = b[1];
        return b[1]-a[1];
    })
    return pagesArr; 
}

module.exports={
    sortPages,printReport
}