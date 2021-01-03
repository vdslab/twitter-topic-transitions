import csv
import json
import os
import re
from argparse import ArgumentParser
from datetime import datetime, timedelta, timezone
from itertools import count, groupby
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
                        default='words.json', help='output filename')
    parser.add_argument('-c', '--chunk', dest='chunk',
                        default=100, help='chunk size', type=int)
    parser.add_argument('-w', '--window', dest='window',
                        default=20, help='window size', type=int)
    parser.add_argument('files', nargs='+')
    args = parser.parse_args()

    outpath = os.path.abspath(args.output)
    os.makedirs(os.path.dirname(outpath), exist_ok=True)
    with open(outpath, 'w') as f:
        tweets = [t for t in load_tweet(
            *args.files) if 'retweeted_status' not in t]
        tweets.sort(key=lambda t: t['id'])
        groups = (len(tweets) + args.chunk - 1) // args.chunk
        for i, t in enumerate(tweets):
            group_id = i // args.chunk
            tags = ['twuser{}'.format(t['user']['id']), 'tw{}'.format(t['id'])]
            for j in range(max(0, group_id - args.window), min(groups, group_id + args.window + 1)):
                tags.append('twhour{}'.format(j))
            f.write(json.dumps({
                'group_id': group_id,
                'created_at': t['created_at'],
                'tags': tags,
                'words': divide_text(full_text(t)),
            }, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
