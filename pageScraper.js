const scraperObject = {
	url: 'https://www.kreuzbergkinder.com/category.php?cat=&subcat=opti&mat=&bestsellers=yes',
	async scraper(browser, category){
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		await page.goto(this.url, { timeout: 0});

		// let selectedCategory = await page.$$eval('#menu2 > div > div > div.col-md-6.float-left > div > ul > li.dropdown.dropdown--active > div > ul > li', (links, _category) => {
		// 	// console.log(links);
		// 	links = links.map(a => a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") === _category ? a : null);
		// 	let link = links.filter(tx => tx !== null)[0];
		// 	// console.log(link)
		// 	return link.href;
		// 	// let urlLinks;

		// 	// links.forEach(element => {
		// 	// 	let check = element.querySelector('span').textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "")
		// 	// 	if (check === _category[0]) {
		// 	// 		let el = element.querySelectorAll('.container > ul > li')
		// 	// 		let allLinks = el.map(a => a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") === _category[1] ? a : null)
		// 	// 		let link = allLinks.filter(tx => tx !== null)[0];

		// 	// 		urlLinks = link.href
		// 	// 	}
				
		// 	// });
		// 	// return urlLinks;


		// }, category)
		// // Navigate to the selected category
		// await page.goto(selectedCategory);
		let scrapedData = [];
		async function scrapeCurrentPage(){
			await page.waitForSelector('section');
		let urls = await page.$$eval('section .row > div', links => {
			links = links.map(el => el.querySelector('div > a').href)
			return links;
		});

		let pagePromise = (link) => new Promise(async(resolve, reject) => {
			let dataObj = {};
			let boolcheck = false;
			let variants = [];
			let newPage = await browser.newPage();
			await newPage.goto(link);
			dataObj['productName'] = await newPage.$eval('body > section > div > div > div.col-sm-5.col-md-5.p-r-50 > h2', text => text.textContent);
			dataObj['productPrice'] = await newPage.$eval('body > section > div > div > div.col-sm-5.col-md-5.p-r-50 > div.text-block > h2', text => text.textContent);
			dataObj['details'] = {
				FrameColor: await newPage.$eval('body > section > div > div > div.col-sm-5.col-md-5.p-r-50 > div.text-block > span:nth-child(2)', text => text.textContent.split(':').join('')),
				Lenses: await newPage.$eval('body > section > div > div > div.col-sm-5.col-md-5.p-r-50 > div.text-block > span:nth-child(3)', text => text.textContent.split(':').join(''))
			}
			// try {
			// 	dataObj['productPrice'] = await newPage.$eval('section .col-sm-5 .col-md-5 .p-r-50 .text-block > h2', text => text.textContent);
			// 	boolcheck = true
			// } catch (error) {
			// 	boolcheck = false
			// }

			// if(!boolcheck) {
			// 	dataObj['productPrice'] = await newPage.$eval('.price-info .price-box .regular-price > span', text => text.textContent);

			// }
			dataObj['productImage'] = await newPage.$eval('body > section > div > div > div.col-sm-7.col-md-7 > div > div:nth-child(1) > img', img => img.src);
			// dataObj['productSku'] = await newPage.$eval('.product-name > div', text => text.textContent);
			let pageurls = await newPage.$$eval('body > section > div > div > div.col-sm-5.col-md-5.p-r-50 > div.col-sm-12.col-md-12.no-pm.m-b-50 > div', (links) => {
				links = links.map(el => el.querySelector('a').href)
				return links

			});

			let pageurlPromise = (urlLink) => new Promise(async(resolve, reject) => {
				let detailObject = {};
				let newPage = await browser.newPage();
				await newPage.goto(urlLink);
				detailObject['fameColor'] = await newPage.$eval('body > section > div > div > div.col-sm-5.col-md-5.p-r-50 > div.text-block > span:nth-child(2)', text => text.textContent.split(':').join(''))
				detailObject['lenses'] =  await newPage.$eval('body > section > div > div > div.col-sm-5.col-md-5.p-r-50 > div.text-block > span:nth-child(3)', text => text.textContent.split(':').join(''))
				detailObject['image'] = await newPage.$eval('body > section > div > div > div.col-sm-7.col-md-7 > div > div:nth-child(1) > img', img => img.src)

				resolve(detailObject);
				await newPage.close();
			});
			
			for (detlink in pageurls) {
				let detailData = await pageurlPromise(pageurls[detlink]);
				variants.push(detailData);
			}

			dataObj['productVariations'] = variants
			// dataObj['productVariations'] = await newPage.evaluate(() => {
			// 	let options = [];
			// 	const getoptions = document.querySelector('#swatches-options-137')
			// 	const optionlength = getoptions.querySelectorAll('li')
			// 	// console.log(optionlength.length);
			// 	optionlength.forEach((el) => {
			// 		let images = [];
			// 		let code = el.querySelector('a').rel
			// 		let color = el.querySelector('a > span').textContent
			// 		const productGallery = document.querySelectorAll(`#product-gallery-container-temp .slides .attribute137-${code}`)
			// 		productGallery.forEach((el) => {
			// 			let image = el.querySelector('a').href
			// 			images.push(image)
			// 		})
			// 		let variantObj = {
			// 			color,
			// 			images
			// 		}
			// 		options.push(variantObj)
			// 	})

			// 	// for (code in options) {
			// 	// 	const getCode = options[code]
			// 	// 	console.log('checking', getCode)
			// 	// 	// const gallery = document.querySelectorAll(`#product-gallery-container-temp .slides .attribute137-${getCode}`)

			// 	// }
			
			// 	return options

			// })
			// dataObj['productVariations'] = await newPage.$$eval('#swatches-options-137 > li', (links) => {
			// 	links = links.map(async(el) => {
			// 		const code = el.querySelector('a').rel;
			// 		const color = el.querySelector('a > span').textContent;
			// 		const productPage = await browser.newPage();
			// 		await productPage.goto(`https://sacksfashion.com/srig-qrdign-arvk-rqvm.html#137=${code}`);

			// 		const image = await productPage.$$eval('#product-gallery-container .bx-wrapper .bx-viewport .slides > li', (img) => {
			// 			img = img.map(el => el.querySelector('.fancybox > img').src)

			// 			return img
			// 		})

			// 		return {
			// 			color,
			// 			image
			// 		}

					
			// 	})
			// 	return links

			// });
			// dataObj['productSizes'] = await newPage.$$eval('#swatches-options-133 > li', (links) => {
			// 	links = links.map(el => el.querySelector('a').textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, ""))
			// 	return links

			// });
			// dataObj['productImages'] = await newPage.$$eval('#product-gallery-container-temp .slides > li', (links) => {

			// 	links = links.map(el => el.querySelector('.fancybox > img').src)
			// 	return links

			// });
			resolve(dataObj);
			await newPage.close();

		});

		for (link in urls) {
			let currentPageData = await pagePromise(urls[link]);
			scrapedData.push(currentPageData);
		}
		// let nextButtonExist = false;
		// try {
		// 	const nextButton = await page.$eval('a.next.i-next', a => a.textContent);
		// 	nextButtonExist = true;
		// } catch (error) {
		// 	nextButtonExist = false;
		// }

		// if(nextButtonExist){
		// 	await page.click('a.next.i-next');	
		// 	return scrapeCurrentPage(); 
		// }
		await page.close();
		return scrapedData;

		}
		let data = await scrapeCurrentPage();
		console.log(data);
		return data;
		
	}
}

module.exports = scraperObject;