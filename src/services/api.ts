import { toPairs } from "lodash";
import "whatwg-fetch";

const SPOTIFY_ROOT = "https://api.spotify.com/v1";

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
const parseJSON = (response: any) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
};

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

const checkStatus = (response: any) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error: any = new Error(response.statusText);
  error.response = response;
  throw error;
};

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export const request = (url: any, options?: any) => {
  // eslint-disable-next-line no-undef
  return fetch(url, options).then(checkStatus).then(parseJSON);
};

const fetchFromSpotify = ({ token, endpoint, params }: any) => {
  let url = [SPOTIFY_ROOT, endpoint].join("/");
  if (params) {
    // [["type", "track"], ["q", a*], ["offset", 1000]]
    const paramString = toPairs(params)
    // ["type=track", "q=a*, "offset=1000]"]
      .map((param: any) => param.join("="))
    // "type=track&q=a*&offset=1000"
      .join("&");
    // "https://api.spotify.com/v1/search?type=track&q=a*&offset=1000"
    url += `?${paramString}`;
  }
  const options = {

    headers: { Authorization: `Bearer ${token}` },
  };
  console.log("Fetching from Spotify:", url);
  return request(url, options);
};

export default fetchFromSpotify;
