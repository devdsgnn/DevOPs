import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

/**
 * Extract metadata from a webpage
 * @param {string} url - The URL to extract metadata from
 * @returns {Promise<{title: string, description: string}>}
 */
export async function extractMetadata(url) {
    try {
        console.log(`🔍 Fetching metadata from: ${url}`);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Try to get title from various sources
        let title =
            $('meta[property="og:title"]').attr('content') ||
            $('meta[name="twitter:title"]').attr('content') ||
            $('title').text() ||
            'Untitled';

        // Try to get description from various sources
        let description =
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="twitter:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            '';

        // Clean up title and description
        title = title.trim();
        description = description.trim();

        console.log(`✅ Extracted metadata - Title: ${title}`);

        return { title, description };
    } catch (error) {
        console.error('Error extracting metadata:', error.message);
        // Return defaults if extraction fails
        return {
            title: url,
            description: ''
        };
    }
}

/**
 * Take a screenshot of a webpage
 * @param {string} url - The URL to screenshot
 * @param {number} waitTime - Time to wait for page load in milliseconds (default: 10000)
 * @returns {Promise<Buffer>} - Screenshot as a buffer
 */
export async function takeScreenshot(url, waitTime = 10000) {
    let browser = null;

    try {
        console.log(`📸 Taking screenshot of: ${url}`);

        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        // Set viewport to a standard desktop size
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1
        });

        // Navigate to the URL
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for the specified time to ensure everything loads
        console.log(`⏳ Waiting ${waitTime}ms for page to fully load...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));

        // Take screenshot
        const screenshot = await page.screenshot({
            type: 'png',
            fullPage: false // Only capture viewport
        });

        console.log(`✅ Screenshot captured successfully`);

        await browser.close();
        return screenshot;
    } catch (error) {
        console.error('Error taking screenshot:', error.message);

        if (browser) {
            await browser.close();
        }

        throw error;
    }
}

/**
 * Truncate description to a specified length with ellipsis
 * @param {string} description - The description to truncate
 * @param {number} maxLines - Maximum number of lines (default: 2)
 * @param {number} charsPerLine - Approximate characters per line (default: 50)
 * @returns {string} - Truncated description
 */
export function truncateDescription(description, maxLines = 2, charsPerLine = 50) {
    if (!description) return '';

    const maxLength = maxLines * charsPerLine;

    if (description.length <= maxLength) {
        return description;
    }

    // Truncate and add ellipsis
    return description.substring(0, maxLength).trim() + '...';
}
