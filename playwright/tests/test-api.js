import { test, expect } from "@playwright/test";

test.describe("Test WP-JSON @api endpoints @desktopOnly", () => {
	test("Test metro app editions endpoint", async ({ page }) => {
		const url = "/wp-json/wp/v2/metro-app-editions?metro_app_content=1";

		// Uses baseURL from config.
		const response = await page.goto(url, { waitUntil: "domcontentloaded" });

		expect(response.status()).toBe(200);
	});

	test("Test trending commercial video endpoint", async ({
		page,
		isMobile,
	}) => {
		test.skip(isMobile, "This test is not applicable to mobile viewports");
		const url =
			"/wp-json/videos/trending-commercial?per_page=50&fields=id,headline";

		// Uses baseURL from config.
		const response = await page.goto(url, { waitUntil: "domcontentloaded" });

		expect(response.status()).toBe(200);

		const body = await response.json();
		expect(body.videos.length).toBeGreaterThan(0);
	});

  test('Test Metro daily horoscope page endpoint', async ({request}) => {
  
  // The Metro daily horoscope API endpoint
  const url = '/wp-json/metro-horoscopes/daily/';

  // Make the GET request
  const response = await request.get(url);

  // Check the response is OK
   expect(response.status()).toBe(200)

  // Parse the JSON
  const data = await response.json();
  expect(data.signs).toBeTruthy()
  
  //  Validate all horoscope sign keys exist
  const EXPECTED_SIGNS = [
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
    'scorpio',
    'sagittarius',
    'capricorn',
    'aquarius',
    'pisces'
    
  ];

  for (const sign of EXPECTED_SIGNS) {
    expect(data.signs).toHaveProperty(sign);
  }

});

  test('Test Metro video endpoint', async ({ request }) => {
     const url = 'wp-json/videos/';
    //  Make the GET request
    const response = await request.get(url);

    //  Validate status code is 200 OK
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Parse the JSON body
    const videos = await response.json();

    //  Basic Assertions
    expect(Array.isArray(videos)).toBeTruthy();
    expect(videos.length).toBeGreaterThan(0);
    
    // Validate the video titles
     videos.forEach(video => {
    expect(video).toHaveProperty('videoTitle');
    expect(video.videoTitle).toBeTruthy(); // not null/empty
  });
  });

});
