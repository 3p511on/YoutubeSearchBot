'use strict';

const { fetch } = require('./network');
const { cookiesToString } = require('./util');

const getSearchURL = (query) => `https://www.youtube.com/results?search_query=${query.split(' ').join('+')}`;

class Video {
  constructor(data) {
    this.patch(data);
  }

  get views() {
    return this.viewsText ? +this.viewsText.match(/\d+/g).join('') : 0;
  }

  get url() {
    return `https://youtu.be/${this.id}`;
  }

  patch(data = {}) {
    this.id = data.videoId ?? null;
    this.title = data?.title?.runs[0]?.text ?? null;
    this.thumbnails = data?.thumbnail?.thumbnails ?? null;
    this.duration = data?.lengthText?.simpleText ?? null;
    this.viewsText = data?.viewCountText?.runs?.length
      ? data?.viewCountText?.runs[0]?.text ?? null
      : data?.viewCountText?.simpleText ?? null;
    this.channelName = data?.longBylineText?.runs[0]?.text ?? null;
    this.channelUrl =
      data?.longBylineText?.runs[0]?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url ?? null;
  }
}

const getSearchResults = async (query, cookies = '') => {
  try {
    const headers = { Cookie: cookies };
    const res = await fetch(getSearchURL(query), { headers });
    const ytInitialData = JSON.parse(res.split('var ytInitialData = ')[1].split(';</script>')[0]);
    const { sectionListRenderer } = ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents;
    const rawVideos = sectionListRenderer.contents[0].itemSectionRenderer.contents.filter((i) => i.videoRenderer);
    const videos = rawVideos.map((i) => new Video(i.videoRenderer));
    return videos;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const extractID = (data) => {
  const isID = typeof data === 'string' && data.length === 11 && !data.includes(' ');
  if (isID) return data;
  try {
    const { searchParams, pathname, host } = new URL(data);
    if (host === 'www.youtube.com' && pathname === '/watch') {
      const id = searchParams.get('v');
      return id;
    } else if (host === 'youtu.be') {
      return pathname.slice(1);
    }
    return null;
  } catch (err) {
    return null;
  }
};

const findVideo = async (videoID, searchQuery, parsedCookies = {}) => {
  const userCookies = cookiesToString(parsedCookies);
  const searchResults = await getSearchResults(searchQuery, userCookies);
  const info = searchResults.find((r) => r.id === videoID);
  if (!info) return null;
  const position = searchResults.findIndex((video) => video.id === videoID) + 1;
  return { info, searchQuery, position };
};

module.exports = { getSearchResults, Video, extractID, findVideo };
