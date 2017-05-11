const fetch = require('node-fetch');
const cheerio = require('cheerio');

class YouTubeProfile {

    async getUserInfo(url) {
        if (this.checkUrl(url)) {
            const parsedUrl = this.buildCorrectUrl(url);
            const page = await this.getPage(parsedUrl);
            const userInfo = this.parseDom(this.buildCheerio(page));

            const clearedSubs = this.getNumber(userInfo[0], 'subscribers');
            const clearedViews = this.getNumber(userInfo[1], 'views');

            console.log(`Subscribers: ${clearedSubs}`, `Views: ${clearedViews}`);
        } else {
            console.log("Something wrong with url");
        }
    }

    async getPage(url) {
        let preparsed = await fetch(url);
        return preparsed.text();
    }

    buildCheerio(data) {
        return cheerio.load(data);
    }

    parseDom($) {
        const subscribers = $('.about-stats span').first().text();
        const views = $('.about-stats span:nth-child(2)').text();
        return [subscribers, views];
    }

    buildCorrectUrl(url) {
        if (url.includes('http')) {
            return this.checkAbout(url);
        } else {
            let added = this.addHttps(url);
            return this.checkAbout(added);
        }
    }

    checkAbout(url) {
        if (url.includes('/about')) {
            return url;
        } else {
            return `${url}/about`;
        }
    }

    addHttps(url) {
        return `https://${url}`;
    }

    getNumber(value, type) {
        if (this.checkParsedValues(value)) {
            if (type == 'subscribers') {
                return value.split(' ')[0];
            } else if (type == 'views') {
                return value.split(' ')[2];
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    checkParsedValues(value) {
        return value != '' ? true : false;
    }

    checkUrl(url) {
        if (url.includes('youtube')) {
            return url.length >= 30 ? true : false;
        } else {
            return false;
        }
    }
}

module.exports = YouTubeProfile;
