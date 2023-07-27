//Please run the followibg command to install puppeteer
            // npm install puppeteer
//Run the program using following command (make sure node is install on your machine)
//if not please download from https://nodejs.org/en/download and install 
          // node .\webScrappingAssignment.js

const puppeteer = require("puppeteer");

async function scrapeData() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the website
    await page.goto(
      "https://www.msamb.com/ApmcDetail/APMCPriceInformation#ArrivalGird",
      {
        waitUntil: "networkidle2", // Wait until the page is fully loaded
      }
    );

    // Select the language to English
    await page.select(".language #language", "en");
    await page.waitForTimeout(1000);
    // Wait for the APMCs button to appear and click on it
    await page.waitForSelector("#APMCTitle");
    await page.click("#APMCTitle");
    await page.waitForTimeout(4000);
    // Wait for the popup to appear and click on "APMC Wise"
    await page.waitForSelector("#ArrivalGirdID");
    await page.click("#ArrivalGirdID");
    // Wait for the element to render after clicking "APMC Wise"
    await page.waitForTimeout(1000); // Adjust the delay as needed
    // Click on the dropdown to open it
    await page.waitForSelector("#drpArrival");
    await page.waitForTimeout(1000);
    await page.click("#drpArrival");
    // Wait for the options to render after opening the dropdown
    await page.waitForTimeout(2000); // Adjust the delay as needed
    await page.select("#drpArrival", "007");
    // Click on the first option in the dropdown
    // Wait for the table data to load
    await page.waitForTimeout(4000); // Adjust the delay as needed
    //     await page.waitForSelector('.table table tbody tr');
    // await page.waitForSelector('.table table tbody tr', { timeout: 60000 });
    await page.waitForSelector(".table.custom-table tbody tr td");
    // Scrape the data from the table
    await page.waitForTimeout(4000);
    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll(".table.custom-table tbody tr");
      const dataArray = [];

      rows.forEach((row) => {
        const columns = row.querySelectorAll("td");
        if (columns.length <= 1) {
          return; // Skip this iteration and move to the next row
        }
        const rowData = {
          commodity: columns[0]?.innerText.trim() || "", // Use conditional chaining to handle missing columns
          variety: columns[1]?.innerText.trim() || "",
          unit: columns[2]?.innerText.trim() || "",
          quantity: columns[3]?.innerText.trim() || "",
          lrate: columns[4]?.innerText.trim() || "",
          Hrate: columns[5]?.innerText.trim() || "",
          modal: columns[6]?.innerText.trim() || "",
        };
        dataArray.push(rowData);
      });

      return dataArray;
    });

    console.log(data);
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

scrapeData();


