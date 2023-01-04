const pageScraper = require('./pageScraper');
const fs = require('fs');

async function scrapeAll(browserInstance){
	let browser;
	try{
		browser = await browserInstance;
        let scrapedData = {};
        scrapedData['BestSellers'] = await pageScraper.scraper(browser);
        // scrapedData['Men'] = await pageScraper.scraper(browser, 'Men');
        // scrapedData['NewArrivals'] = await pageScraper.scraper(browser, 'New Arrivals');
        // scrapedData['ShopAll'] = await pageScraper.scraper(browser, 'Shop All');
        // scrapedData['Pants'] = await pageScraper.scraper(browser, 'Pants');
        // scrapedData['Kimonos'] = await pageScraper.scraper(browser, 'Kimonos');	
        // scrapedData['Skirts'] = await pageScraper.scraper(browser, 'Skirts');
        // scrapedData['ShortPants'] = await pageScraper.scraper(browser, 'Short Pants');
        // scrapedData['Sweatshirt'] = await pageScraper.scraper(browser, 'Sweatshirt');
        // scrapedData['TankTops'] = await pageScraper.scraper(browser, 'Tank Tops');
        // scrapedData['PrintCollection'] = await pageScraper.scraper(browser, 'Print Collection');
        await browser.close();
        fs.appendFile("optical.json", JSON.stringify(scrapedData), 'utf8', function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log("The data has been scraped and saved successfully! View it at './optical.json'");
		});

		
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance) => scrapeAll(browserInstance)