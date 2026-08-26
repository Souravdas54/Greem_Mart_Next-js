import axios from 'axios';

export class GeocodingService {
    static async geocodeLocation(locationName: string): Promise<{ lat: number; lng: number } | null> {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search`,
                {
                    params: {
                        q: locationName,
                        format: 'json',
                        limit: 1
                    },
                    headers: {
                        'User-Agent': 'GreenMart-App'
                    }
                }
            );

            if (response.data && response.data.length > 0) {
                return {
                    lat: parseFloat(response.data[0].lat),
                    lng: parseFloat(response.data[0].lon)
                };
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    }
}

// The URL https://nominatim.openstreetmap.org/search is used because it is the public API endpoint for a free, open-source geocoding service called Nominatim, which translates place names (like "Kolkata") into latitude and longitude coordinates.

// This approach allows you to let users type in a location name without needing to know the exact coordinates. Here is an explanation of the key parts of the geocoding code you were provided.

// 🔍 Explanation of the Code Components
// Code Component / Parameter	What It Does	Why It's Used
// q Parameter	The main search query (e.g., "Kolkata, India").	Passes the user's location text to Nominatim for geocoding.
// format: 'json'	Requests the response in JSON format.	Makes the data easy to parse in your JavaScript/TypeScript code.
// limit: 1	Tells Nominatim to return a maximum of 1 result.	You only need the single best match (the most likely coordinates) for the user's location.
// headers with 'User-Agent'	Identifies your application to the Nominatim server.	Required by Nominatim's Usage Policy to prevent your requests from being blocked.
// response.data[0].lat/.lon	Extracts the latitude and longitude from the first result.	Uses the coordinates of the best match returned by the geocoding service.
// ⚠️ Important Requirements and Limitations
// When using this free, public API, it is crucial to follow its rules:

// Strict Rate Limit: You must not make more than 1 request per second.

// Attribution Required: If you use OpenStreetMap data (via Nominatim), you must credit "OpenStreetMap" in your application, typically with a link to openstreetmap.org/copyright.

// Not for High-Volume Use: This service is not designed for bulk geocoding or high-traffic commercial apps. For those, you'd need to look at commercial services or host your own Nominatim server.

// Here is the corrected geocoding service code from earlier, now including the required User-Agent header:

// typescript
// import axios from 'axios';

// export class GeocodingService {
//     static async geocodeLocation(locationName: string): Promise<{ lat: number; lng: number } | null> {
//         try {
//             const response = await axios.get(
//                 `https://nominatim.openstreetmap.org/search`,
//                 {
//                     params: {
//                         q: locationName,
//                         format: 'json',
//                         limit: 1
//                     },
//                     headers: {
//                         // A descriptive User-Agent is MANDATORY
//                         'User-Agent': 'GreenMart-App/1.0 (your-contact-email@example.com)'
//                     }
//                 }
//             );

//             if (response.data && response.data.length > 0) {
//                 return {
//                     lat: parseFloat(response.data[0].lat),
//                     lng: parseFloat(response.data[0].lon) // Note: Nominatim uses 'lon', not 'lng'
//                 };
//             }
//             return null;
//         } catch (error) {
//             console.error('Geocoding error:', error);
//             return null;
//         }
//     }
// }
// 🆚 Comparison with Commercial Alternatives
// If your Green Mart project grows and requires more reliability, higher limits, or advanced features (like autocomplete), you may eventually need a commercial geocoding service. Here’s a quick comparison:

// Feature	Nominatim (OpenStreetMap)	Google Maps Geocoding API	ArcGIS Geocoding Service
// Cost	Free (with strict limits)	Pay-as-you-go (charges per request)	Freemium / Paid tiers
// Rate Limits	Very low (1 req/sec)	High (with paid quota)	Varies by plan
// Best For	Low-traffic projects, learning, prototypes	High-traffic, commercial applications	Enterprise GIS applications
// Setup	Simple API call	Requires API key & Google Cloud project	Requires account and access token
// In summary, the code uses the Nominatim service because it's a straightforward, free way to add basic "text-to-coordinates" functionality to your project. Just remember to respect its usage policy and attribution requirements.