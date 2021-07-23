//some regexes
const competitorUrl = /velonews\.competitor\.com\/20[0-9]{2}\//g;
const liveUrl = /velonews\.com\/(tick|live)\//g;
const competitorImg = /competitor\.com\/(.*?).jpg/g;
const veryoldImg = /velonews\.com(\S*?).(f|preview).jpg/g;
const veryoldUrl = /velonews\.com\/(.*?)\.htm/g;
const articleUrl = /article(s)?\/[0-9]+/g;
const photoUrl = /velonews\.com\/photo(s)?/g;

//some strings
const competitorBase = "velonews.competitor.com";
const vnBase = "https://velonews.com?p=";
const domainBase = "https://velonews.com";
const wbBase = "https://web.archive.org/web/2000/"; //for the oldest version

//a place to put the WP post ID
let postId = "";

//storing changed Urls
const changedUrls = new Map();

//remove slash(es) from end of string
function clearEnd(target, badChar = "/", pos = 1) {
	let cleared = false;
	if ( target[target.length - pos] === badChar) {
		cleared = clearEnd(target, badChar, pos + 1);
	} else {
		cleared = target.substr(0, (target.length - (pos - 1) ) );
	}
	return cleared;
}

//return portion of url path following the last slash
function lastSlash(urlString, delimiter = "/") {
	let lsReturn = urlString.split(delimiter)[urlString.split(delimiter).length - 1];
	return lsReturn;
}

//changes the link
function updateLink(oldLink, newHref, urlMap = changedUrls) {
	changedUrls.set(oldLink.href, newHref);
	oldLink.dataset.originalUrl = oldLink.href;
	oldLink.href = newHref;
}

document.addEventListener("DOMContentLoaded", function(event) { 

	//get all the links
	let pageLinks = document.querySelectorAll("a");

	for (let link of pageLinks) {

		let clearedUrl = clearEnd(link.href);

		//make each href attribute a URL
		let linkUrl = new URL(clearedUrl);

		//is it velonews?
		if (linkUrl.hostname === "velonews.competitor.com" || linkUrl.hostname === "www.velonews.com" || linkUrl.hostname === "velonews.com") {
			
			//if data-no-relink is true, skip this link
			if(link.dataset.noRelink) {
				changedUrls.set(link.href, link.href);
				continue;
			}

			//if there's no direct query id or path (i.e., if it's the homepage)
			if (!linkUrl.search && linkUrl.pathname === "/") {
				updateLink(link, domainBase);
				continue;
			}

			//if it's a competitor URL
			if (linkUrl.hostname === "velonews.competitor.com") {

				//if it matches domain/year WP format remove "competitor" 
				//e.g. https://velonews.competitor.com/2013/03/news/must-read-french-politician-says-he-ran-into-a-drunk-andy-schleck_277922
				if ( linkUrl.href.match(competitorUrl) ) {
					updateLink(link, domainBase + link.pathname);
					continue;
				} else { //e.g. "velonews.competitior.com/2010-tour-de-france-stage-19"
					updateLink(link, wbBase + link.href);
					continue;
				}
			}

			//if it's an old image or live report URL, VN doesn't have it, pray Wayback Machine has it
			//e.g. https://www.velonews.com/images/int/8806.12445.f.jpg, https://velonews.com/live/text/261.html
			if ( linkUrl.href.match(liveUrl) || linkUrl.href.match(veryoldImg) || linkUrl.href.match(photoUrl) ) {
				updateLink(link, wbBase + link.href);
				continue;
			}

			//if it's a very old, non image URL
			//e.g. https://velonews.com/race/int/articles/8867.0.html
			if ( linkUrl.href.match(veryoldUrl) ) {
				postId = lastSlash(linkUrl.pathname);
				updateLink(link, vnBase + postId);
				continue;
			}

			//if it's a naked article/id URL, e.g.
			//e.g. https://velonews.com/article/71917
			if ( linkUrl.pathname.match(articleUrl) ) {
				postId = lastSlash( linkUrl.pathname.match(articleUrl)[0] );
				updateLink(link, vnBase + postId);
				continue;
			}

			//if all previous checks pass and we made it this far, assume the link works
			changedUrls.set(link.href, link.href);
		}
	}

	//output changes
	console.log("%c velonews-relinker found " + changedUrls.size + " urls:", "background: #000; color: cyan");
	for (let urls of changedUrls) {
		if (urls[0] === urls[1]) {
			console.log("\n %c ignored " + urls[0], "background: #000; color: cyan");
		} else {
			console.log("\n  %c removed " + urls[0] + "\n %c inserted " + urls[1], "background: #000; color: yellow", "background: #000; color: lime");
		}
	}
	console.log("%c more info: https://github.com/cosmocatalano/velonews-relinker", "background: #000; color: cyan");
});
