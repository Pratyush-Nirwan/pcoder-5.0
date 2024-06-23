const UMAMI_API_URL = 'https://api.umami.is';
const UMAMI_WEBSITE_ID = 'f5965afc-32c8-468c-8174-331567bb7f2b';
const UMAMI_AUTH_TOKEN = '3stuKecfYsKNKjqEhrANBB2S8AzL1G92';

const getPageViews = async (startDate, endDate) => {
    try {
        const response = await fetch(`${UMAMI_API_URL}/v1/websites/${UMAMI_WEBSITE_ID}/pageviews`, {
            headers: {
                'Authorization': `Bearer ${UMAMI_AUTH_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Error fetching page views:', error);
        throw error;
    }
};

export default getPageViews;
