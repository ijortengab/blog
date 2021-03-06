var fileCount = 0,dirCount = 0;
var dirStatElem = document.getElementById('dir-stats');
var fileStatElem = document.getElementById('file-stats');
var allLinks = document.getElementsByTagName('a');
for (let item of allLinks){
    if (item.innerHTML != "../"){
        if (item.innerHTML.endsWith('/')){
            dirCount += 1;
        }
        else {
            fileCount += 1;
        }
    }
    item.className = "link-icon";
}
var parentFolderElement = document.querySelector("a[href='../']");
parentFolderElement.className = "folderup";
parentFolderElement.innerHTML = "&#8682; Up";
if (dirCount == 1){
    dirStatElem.innerHTML = dirCount + " directory";
}
else {
    dirStatElem.innerHTML = dirCount + " directories";
}
if (fileCount == 1){
    fileStatElem.innerHTML = fileCount + " file";
}
else {
    fileStatElem.innerHTML = fileCount + " files";
}
// Added by ijortengab. 20210227
var path = location.pathname
var host = location.host
var crumbs = path.split("/");
var href = "";
var listing = document.querySelector('#listing h1');
listing.textContent = ''
var a = document.createElement('a');
a.setAttribute('href', '/');
a.textContent = host
listing.appendChild(a);
var span = document.createElement('span');
span.textContent = '/'
listing.appendChild(span);
crumbs.forEach(function(item, i){
    if(item.length) {
        href = href + "/" + item;
        var a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = item
        listing.appendChild(a);
        var span = document.createElement('span');
        span.textContent = '/'
        listing.appendChild(span);
    }
});
