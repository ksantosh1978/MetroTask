const { test, expect } = require( '@playwright/test' );
const configData = require( '../tests-config/ga-page-props.json' );

// Loop over all of the pages defined in the config we need to check.
test.describe( 'Test @ga4 Page Properties', () => {
	for ( const url in configData.pages ) {
		test( `Testing Google Analytics Page Properties for: ${url}`, async ( {
			page,
			context,
			isMobile,
		} ) => {
			await context.addCookies( [
				{
					name: 'dmg.cmp.uuid',
					value: 'b5fa0bbf-6115-4097-86f8-0322a9342412',
					path: '/',
					domain: 'localhost',
				},
				{
					name: 'mol.ads.cmp.tcf.cache',
					value: '{hasUserConsentedToAll: true}',
					path: '/',
					domain: 'localhost',
				},
			] );

			// Listen for the Google Analytics request that belong to the site's tracking ID.
			const gaRequestPromise = page.waitForResponse( response => {
				return (
					response.url().includes( 'collect?v=2' ) &&
					response.url().includes( configData.trackingID )
				);
			} );

			// Load the requested URL to test.
			await page.goto( url, { waitUntil: 'domcontentloaded' } );

			// Capture the GA request URL.
			const gaResponse = await gaRequestPromise;
			const request = gaResponse.request();
			let googleParams;

			// Handle the different types of GA requests.
			if ( request.url().includes( 'page_view' ) ) {
				const googleUrl = new URL( request.url() );
				googleParams = googleUrl.searchParams;
			} else {
				googleParams = new URLSearchParams( request.postData() );
			}

			// eslint-disable-next-line
			console.log( '\x1b[0;90m' + googleParams + '\x1b[0m' );

			// Define all of the props to check
			const assertions = [
				{
					propName: 'ep.rendered_platform',
					propValue: isMobile ? 'mobile' : 'desktop',
				},
			];

			// Check all of global props.
			for ( const propName in configData.global ) {
				const propObject = {
					propName,
					propValue: configData.global[ propName ],
				};
				assertions.push( propObject );
			}

			// Check all of page specific props.
			for ( const propName in configData.pages[ url ] ) {
				const propObject = {
					propName,
					propValue: configData.pages[ url ][ propName ],
				};
				assertions.push( propObject );
			}

			// Run the assertions for each.
			for ( const assertion of assertions ) {
				// do not run this assertion on mobile
				if ( isMobile && 'ep.push_notification_status' === assertion.propName ) {
					continue;
				}
				expect( googleParams.get( assertion.propName ) ).toBe( assertion.propValue );
				// eslint-disable-next-line
				console.log( assertion.propName + '\x1b[0;32m ok\x1b[0m' );
			}
		} );
	}
} );
