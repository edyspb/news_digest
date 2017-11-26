import os
import re
from datetime import datetime

from lxml import etree
from requests import get

LENTA_RU_RSS = 'https://lenta.ru/rss/news'
RSS_ITEM_PATH = '/rss/channel/item'

TITLE_TAG = 'title'
DESCRIPTION_TAG = 'description'
CATEGORY_TAG = 'category'
PUBDATE_TAG = 'pubDate'
DATETIME_FMT = '%a, %d %b %Y %H:%M:%S %z'


def get_news():
    resp = get(LENTA_RU_RSS)
    root = etree.fromstring(resp.text.encode())

    news = []
    for item in root.xpath(RSS_ITEM_PATH):
        title = item.find(TITLE_TAG).text.strip()
        description = item.find(DESCRIPTION_TAG).text.strip()
        category = item.find(CATEGORY_TAG).text.strip()

        pub_date = item.find(PUBDATE_TAG).text.strip()
        pub_date = datetime.strptime(pub_date, DATETIME_FMT)

        news.append({
            'title': title,
            'description': description,
            'category': category,
            'pub_date': pub_date
        })

    return news


if __name__ == '__main__':
    from pprint import pprint
    news = get_news()
    pprint(news)
