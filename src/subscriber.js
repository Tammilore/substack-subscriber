const { chromium } = require('playwright');

function formatSubstackUrl(url) {
    // Ensure the URL starts with "https://"
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    // Remove any trailing slashes
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }

    return url;
}

async function subscribe(email, substackUrl) {
    if (!email) throw new Error('Email is required.');
    if (!substackUrl) throw new Error('Substack link is required.');

    const formattedSubstackUrl = formatSubstackUrl(substackUrl);

    const browser = await chromium.launch({
        headless: true,
        slowMo: 250, // Add a delay for realism (optional)
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    const pageUrl = `${formattedSubstackUrl}/subscribe`;

    try {
        console.log("Navigating to Substack...");
        await page.goto(pageUrl, { 
            waitUntil: 'networkidle',
            timeout: 80000, // 80 seconds timeout
        });

        console.log("Page loaded, waiting for readiness...");
        await page.waitForTimeout(5000); // Pause to allow all elements to load

        const requestBody = {
            "first_url": pageUrl,
            "first_referrer": "",
            "current_url": pageUrl,
            "current_referrer": "",
            "first_session_url": pageUrl,
            "first_session_referrer": "",
            "referral_code": "",
            "source": "subscribe_page",
            "referring_pub_id": "",
            "additional_referring_pub_ids": "",
            "email": email
        };

        const apiResponse = await page.evaluate(async ({ requestBody, formattedSubstackUrl }) => {
            try {
                const response = await fetch(
                    `${formattedSubstackUrl}/api/v1/free`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        mode: 'cors',
                        body: JSON.stringify(requestBody),
                    });

                if (response.ok) {
                    const data = await response.json();
                    return data;
                } else {
                    const errorText = await response.text();
                    return { 
                        error: `Error ${response.status}`,
                        details: errorText,
                    };
                }
            } catch (error) {
                return { 
                    error: error.message,
                    type: error.name,
                };
            }
        }, { requestBody, formattedSubstackUrl });

        return apiResponse;
    } finally {
        await browser.close();
    }
}

module.exports = { subscribe };
