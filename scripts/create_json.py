import json
from argparse import ArgumentParser
from datetime import datetime, timedelta, timezone
from itertools import count
from gensim.models.doc2vec import Doc2Vec
from sklearn.manifold import TSNE

datetime_format = '%Y%m%d%H'


def main():
    parser = ArgumentParser()
    parser.add_argument('-c', '--corpus', dest='corpus', help='corpus path')
    parser.add_argument('-m', '--model', dest='model', help='model path')
    parser.add_argument('-o', '--output', dest='output', help='output path')
    parser.add_argument('--seed', dest='seed', default=0,
                        type=int, help='random seed')
    parser.add_argument('--chunk', dest='chunk',
                        default=100, help='chunk size', type=int)
    parser.add_argument('--window', dest='window',
                        default=20, help='window size', type=int)
    args = parser.parse_args()

    model = Doc2Vec.load(args.model)

    corpus = [json.loads(row.strip()) for row in open(args.corpus)]
    num_groups = max(t['group_id'] for t in corpus) + 1
    group_words = [{} for _ in range(num_groups)]
    group_times = [[] for _ in range(num_groups)]

    for t in corpus:
        g = t['group_id']
        group_times[g].append(t['created_at'])
        for word in t['words']:
            if word['pos'] not in ['名詞', '動詞', '形容詞']:
                continue
            word = word['base']
            if word not in group_words[g]:
                group_words[g][word] = 0
            group_words[g][word] += 1

    words = {}
    for i in range(num_groups):
        for word in group_words[i]:
            if word not in words:
                words[word] = 0
            words[word] += 1
    words = [{'word': w, 'count': c} for w, c in words.items()]
    words.sort(key=lambda w: w['count'], reverse=True)
    words = [w for w in words][:300]

    topic_vec = [model.docvecs['twhour{}'.format(
        i)] for i in range(num_groups)]
    topic_coordinates = TSNE(
        perplexity=5, random_state=args.seed).fit_transform(topic_vec)
    topics = [{
        'time': min(group_times[i], key=lambda s: datetime.strptime(s, '%a %b %d %H:%M:%S %z %Y')),
        'stopTime': max(group_times[i], key=lambda s: datetime.strptime(s, '%a %b %d %H:%M:%S %z %Y')),
        'tweetCount': args.chunk,
        'vec': [float(v) for v in model.docvecs['twhour{}'.format(i)]],
        'x': float(x),
        'y': float(y)
    } for i, (x, y) in enumerate(topic_coordinates)]
    words = [{'word': w['word'], 'count': w['count'], 'hourlyCount': [group_words[i].get(
        w['word'], 0) for i in range(num_groups)], 'vec': [float(v) for v in model.wv[word]]} for w in words]
    obj = {
        'topics': topics,
        'words': words,
    }
    json.dump(obj, open(args.output, 'w'), ensure_ascii=False)


if __name__ == '__main__':
    main()
