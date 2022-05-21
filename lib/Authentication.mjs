import axios from "axios";

/**
 * Axios Post Type Request
 * @function
 * @param {Object|string} data - post type request body
 * @param {Object} headers - request header
 * @param {string} api - api sublink
 * @returns {Promise<Object>} response data
 */
export async function postRequest (
    data,
    headers,
    api = "/v1/common/websocketInfo"
) {
    const baseURL = {
        test: "http://test-live-open.biliapi.net",
        formal: "https://live-open.biliapi.com"
    }
    axios.defaults.baseURL = baseURL.formal

    const response = await axios.post(api, data, { headers })
    return response.data
}
