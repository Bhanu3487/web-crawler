const {JSDOM} = require('jsdom');

async function crawlPage(baseURL, currentURL, pages){
    const baseURLObj = new URL(baseURL);
    const currentURLURLObj = new URL(currentURL);
    if(baseURLObj.hostname !== currentURLURLObj.hostname){return pages}

    const normalizedCurrentURL = normalizeURL(currentURL);
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++;
        return pages;
    }


    console.log(`actively crawling ${currentURL}`);
    pages[normalizedCurrentURL]++;

    try{
        const resp = await fetch(currentURL);
        if(resp.status > 399){
            console.log(`error in fetch status code: ${resp.status} on page:${currentURL}`);
            return pages
        }
        const contentType = resp.headers.get("content-type");
        if (!contentType.includes("text/html")) {
            console.log(`Got non-html response: ${contentType}`);
            return pages; // Correctly handle non-HTML responses
        }

        const htmlBody = await resp.text();

        const nextURLs = getURLsFromHTML(htmlBody, baseURL);
        for (const nextURL of nextURLs){
            pages = await crawlPage(baseURL, nextURL, pages);
        }
    }catch(err){
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`);
    }
    return pages;
}

function getURLsFromHTML(htmlBody, baseURL){
    // htmlBody: HTML of the page; baseURL: URL of the website that we are in the process of crawling
    // returns urls: arr of strs representing URLs
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    for (const linkElement of linkElements){
        console.log(linkElement.href)
        if(linkElement.href.slice(0,1) === '/'){
            try{
                const urlObj = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObj.href);
            }catch(err){
                console.log(`error ith relative URL: ${err.message}`);
            }
        }else{
            try{
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            }catch(err){
                console.log(`error ith relative URL: ${err.message}`);
            }
        }
    }
    return urls
}

function normalizeURL(urlString){
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if(hostPath.length > 0 && hostPath.slice(-1) === '/'){
        return hostPath.slice(0,-1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}