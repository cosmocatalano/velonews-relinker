# velonews-relinker
fixes legacy VeloNews links on the fly for your website and/or blog

## the problem
*[VeloNews](https://velonews.com)* is one of the oldest cycling publications in the US. Despite effectively being the sports' periodical of record, many of the publication's older URLs were broken by a series of platform and ownership changes between 2008 and 2017. 

As former *VN* technical staff noted after the [the first time I tried to fix this problem](https://www.cyclocosm.com/2011/12/velonews-dead-link-article-finder/), the unique identifiers for content have been preserved throughout these changes, but as of July 2021, a tranlsation layer connecting links to to this content has not been constructed—and, until *VN*'s ownership regains access to the `velonews.competitor.com` domain, any solution they do implement will remain incomplete.

## this solution
As the owner of a [long-running cycling blog](https://cyclocosm.com), I wanted to reduce the impact of this link rot and ensure that *VN*'s primary-source reporting remained accessible to readers. 

To address this, I wrote a script that scans an HTML document for any `velonews.com` or `velonews.competitor.com` links, parses them to determine the content's unique identifier, and changes their `href` attribute to a raw query for that identifier (e.g. `https://velonews.com?p=123456`). The old URL is stored as a `data-originalurl` attribute on the updated link.

## installation
You can install this script on your blog or website by adding the following script to any HTML page:

`<script src="https://cdn.jsdelivr.net/gh/cosmocatalano/velonews-relinker@v1.0.0/relinker.min.js"></script>`

## caveats
This will re-write **all** *VN* links on a given page, whether they currently resolve or not, and makes no effort to determine whether the translated links resolve as intended. This script also logs any links it updates in the console.

