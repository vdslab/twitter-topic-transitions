import csv
import json
import os
import re
from argparse import ArgumentParser
from datetime import datetime, timedelta, timezone
from itertools import count
from tokenizer import divide_text


pattern_url = re.compile(
    r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
pattern_at = re.compile(
    r'@(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')


def load_tweet(*filenames):
    for filename in filenames:
        for s in open(filename):
            yield json.loads(s)


def format_text(text):
    text = text.replace('\n', ' ')
    text = text.replace('#', '')
    text = pattern_url.sub('', text)
    text = pattern_at.sub('', text)
    return text


def full_text(obj):
    if 'extended_tweet' in obj:
        return obj['extended_tweet']['full_text']
    return format_text(obj["text"])


def main():
    parser = ArgumentParser()
    parser.add_argument('-o', '--output', dest='output',
                        default='words.csv', help='output filename')
    parser.add_argument('--start', dest='start',
                        default='2019121700', help='start date')
    parser.add_argument('--stop', dest='stop',
                        default='2020050100', help='stop date')
    parser.add_argument('--window', dest='window',
                        default=24, help='window size', type=int)
    parser.add_argument('files', nargs='+')
    args = parser.parse_args()

    start = datetime.strptime(args.start, '%Y%m%d%H%M')
    stop = datetime.strptime(args.stop, '%Y%m%d%H%M')

    outpath = os.path.abspath(args.output)
    os.makedirs(os.path.dirname(outpath), exist_ok=True)
    with open(outpath, 'w') as f:
        for t in load_tweet(*args.files):
            if 'retweeted_status' in t:
                continue

            d = datetime.strptime(t['created_at'], '%a %b %d %H:%M:%S %z %Y').astimezone(
                timezone(timedelta(hours=9)))
            d = datetime(d.year, d.month, d.day, d.hour)
            if d < start or stop <= d:
                continue
            tags = ['twuser{}'.format(t['user']['id']), 'tw{}'.format(t['id'])]
            for i in range(-args.window, args.window + 1):
                e = d + timedelta(hours=i)
                tags.append('twhour{}'.format(e.strftime('%Y%m%d%H')))
            f.write(json.dumps({
                'created_at': t['created_at'],
                'tags': tags,
                'words': divide_text(full_text(t)),
            }, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
