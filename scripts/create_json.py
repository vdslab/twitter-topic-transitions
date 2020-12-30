import json
from argparse import ArgumentParser
from datetime import datetime, timedelta
from itertools import count
from gensim.models.doc2vec import Doc2Vec
from sklearn.manifold import TSNE

datetime_format = '%Y%m%d%H'


def main():
    parser = ArgumentParser()
    parser.add_argument('-c', '--corpus', dest='corpus', help='corpus path')
    parser.add_argument('-m', '--model', dest='model', help='model path')
    parser.add_argument('-o', '--output', dest='output', help='output path')
    parser.add_argument('--start', dest='start',
                        default='2019121700', help='start date')
    parser.add_argument('--stop', dest='stop',
                        default='2020050100', help='stop date')
    args = parser.parse_args()

    model = Doc2Vec.load(args.model)

    start = datetime.strptime(args.start, datetime_format)
    stop = datetime.strptime(args.stop, datetime_format)
    times = []
    for i in count():
        t = start + timedelta(hours=i)
        if t >= stop:
            break
        h = t.strftime(datetime_format)
        tag = 'twhour{}'.format(h)
        times.append((t, h, tag))

    hour_words = {h: {} for _, h, _ in times}
    tweet_count = {h: 0 for _, h, _ in times}
    for row in open(args.corpus):
        t = json.loads(row.strip())
        d = datetime.strptime(t['created_at'], '%a %b %d %H:%M:%S %z %Y')
        h = d.strftime(datetime_format)
        tweet_count[h] += 1
        for word in t['words']:
            if word['pos'] not in ['名詞', '動詞', '形容詞']:
                continue
            word = word['base']
            if word not in hour_words[h]:
                hour_words[h][word] = 0
            hour_words[h][word] += 1

    words = {}
    for h in hour_words:
        for word in hour_words[h]:
            if word not in words:
                words[word] = 0
            words[word] += 1
    words = [{'word': w, 'count': c} for w, c in words.items()]
    words.sort(key=lambda w: w['count'], reverse=True)
    words = [w for w in words][:300]

    topics = [{'time': t.strftime('%Y-%m-%dT%H:%M:%S'), 'tweetCount': tweet_count[h], 'vec': [float(v) for v in model.docvecs[tag]]}
              for t, h, tag in times]
    words = [{'word': w['word'], 'count': w['count'], 'hourlyCount': [hour_words[h].get(
        w['word'], 0) for _, h, _ in times], 'vec': [float(v) for v in model.wv[word]]} for w in words]
    obj = {
        'topics': topics,
        'words': words,
    }
    json.dump(obj, open(args.output, 'w'), ensure_ascii=False)


if __name__ == '__main__':
    main()
