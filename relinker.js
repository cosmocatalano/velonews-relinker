//because JS is bad at trimming
function clearEnd(target, badChar, pos = 1) {
	let cleared = false;
	if ( target[target.length - pos] === badChar) {
		cleared = clearEnd(target, badChar, pos + 1);
	} else {
		cleared = target.substr(0, (target.length - (pos - 1) ) )
	}
	return cleared;
}

//a usable URL base
const vnBase = "https://velonews.com?p="

//a place to put the WP post ID
let postId = "";

//storing changed Urls
const changedUrls = new Map();

document.addEventListener("DOMContentLoaded", function(event) { 

	//get all the links
	let pageLinks = document.querySelectorAll("a");

	for (let link of pageLinks) {

		//make each href attribute a URL
		let linkUrl = new URL(link.href);

		//is it velonews?
		if (linkUrl.hostname === "velonews.competitor.com" || linkUrl.hostname === "velonews.com") {

			//if there's no direct query id
			if (!linkUrl.search) {

				//remove the trailing slash
				let noSlash = clearEnd(linkUrl.pathname, '/');

				//underscore always sets off the WP post ID
				if ( noSlash.indexOf('_') !== -1 ) {
					postId = noSlash.split('_')[1];
				} else {
					//otherwise we can be fairly certain it's the last section of the pathname
					postId = noSlash.split("/")[noSlash.split("/").length - 1];
				}
			//direct query ID always works
			} else {
				postId = linkUrl.search;
			}
			
			// storing old value as data attribute
			link.dataset.originalurl = linkUrl;

			//storing urls
			let oldUrl = link.href;
			let newUrl = vnBase + postId;

			//updating link 
			link.href = newUrl;

			//adding to collection of changed links
			changedUrls.set(oldUrl, newUrl);
		}
	}
	//output changes
	console.log("velonews-relinker updated " + changedUrls.size + " urls:");
	for (let urls of changedUrls) {
		console.log("updated " + urls[0] + " to " + urls[1]);
	}
	console.log("more info: https://github.com/cosmocatalano/velonews-relinker");
});
