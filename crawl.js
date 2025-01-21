const {JSDOM} = require('jsdom');

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
    getURLsFromHTML
}