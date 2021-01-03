import json
import math
import re
from argparse import ArgumentParser
from datetime import datetime, timedelta, timezone
from itertools import count
from gensim.models.doc2vec import Doc2Vec
from sklearn.manifold import TSNE

datetime_format = '%a %b %d %H:%M:%S %z %Y'
pattern_date = re.compile(r'[0-9]+月[0-9]+日|[0-9]/|[0-9]')
pattern_number = re.compile(r'[0-9]+[人本年月日]')


def main():
    parser = ArgumentParser()
    parser.add_argument('-c', '--corpus', dest='corpus', help='corpus path')
    parser.add_argument('-m', '--model', dest='model', help='model path')
    parser.add_argument('-o', '--output', dest='output', help='output path')
    parser.add_argument('-t', '--topn', dest='topn', default=10,
                        type=int, help='take top n keyphrases per topic')
    parser.add_argument('-l', '--limit', dest='limit', default=300,
                        type=int, help='maximum number of keyphrases')
    parser.add_argument('--seed', dest='seed', default=0,
                        type=int, help='random seed')
    parser.add_argument('--topic-perplexity',
                        dest='topic_perplexity', default=30, type=float)
    parser.add_argument('--word-perplexity',
                        dest='word_perplexity', default=30, type=float)
    args = parser.parse_args()

    model = Doc2Vec.load(args.model)

    corpus = [json.loads(row.strip()) for row in open(args.corpus)]
    num_groups = max(t['group_id'] for t in corpus) + 1

    group_times = [[] for _ in range(num_groups)]
    for t in corpus:
        g = t['group_id']
        group_times[g].append(t['created_at'])

    target_words = set()
    for t in corpus:
        for word in t['words']:
            if word['pos'] not in ['名詞']:
                continue
            word = word['base']
            if len(word) <= 1:
                continue
            if pattern_date.match(word):
                continue
            if pattern_number.match(word):
                continue
            if word.lower().startswith('http'):
                continue
            target_words.add(word)

    tf = [{w: 0 for w in target_words} for _ in range(num_groups)]
    idf = {w: set() for w in target_words}
    for t in corpus:
        g = t['group_id']
        for word in t['words']:
            word = word['base']
            if word in target_words:
                tf[g][word] += 1
                idf[word].add(g)
    for word in idf:
        idf[word] = math.log(num_groups / len(idf[word]))

    keyphrase = {w: 0 for w in target_words}
    for g in range(num_groups):
        sum_tf = sum(c for c in tf[g].values())
        words = [(c / sum_tf * idf[w], w)
                 for w, c in tf[g].items()]
        words.sort(key=lambda row: row[0], reverse=True)
        for (_, w) in words[:args.topn]:
            keyphrase[w] += 1
    words = [w for w in target_words if keyphrase[w] >= 1]
    words.sort(key=lambda w: keyphrase[w], reverse=True)
    words = words[:args.limit]

    topic_coordinates = TSNE(perplexity=args.topic_perplexity, random_state=args.seed)\
        .fit_transform([model.docvecs['twhour{}'.format(i)] for i in range(num_groups)])
    topics = [{
        'id': i,
        'time': min(group_times[i], key=lambda s: datetime.strptime(s, datetime_format)),
        'stopTime': max(group_times[i], key=lambda s: datetime.strptime(s, datetime_format)),
        'tweetCount': len(group_times),
        'x': float(x),
        'y': float(y)
    } for i, (x, y) in enumerate(topic_coordinates)]

    word_coordinates = TSNE(perplexity=args.word_perplexity, random_state=args.seed)\
        .fit_transform([model.wv[w] for w in words])
    words = [{
        'id': i,
        'word': w,
        'count': sum(tf[g].get(w, 0) for g in range(num_groups)),
        'topicCount': [tf[g].get(w, 0) for g in range(num_groups)],
        'x': float(x),
        'y': float(y),
    } for i, (w, (x, y)) in enumerate(zip(words, word_coordinates))]

    word_index = {w['word']: i for i, w in enumerate(words)}
    min_datetime = datetime.strptime(topics[0]['time'], datetime_format)
    min_datetime = datetime(min_datetime.year, min_datetime.month,
                            min_datetime.day, tzinfo=min_datetime.tzinfo)
    max_datetime = datetime.strptime(topics[-1]['stopTime'], datetime_format)
    max_datetime = datetime(max_datetime.year, max_datetime.month,
                            max_datetime.day, tzinfo=max_datetime.tzinfo)
    times = [min_datetime + timedelta(days=i)
             for i in range((max_datetime - min_datetime).days + 1)]
    times = [{'time': t.strftime(datetime_format), 'tweetCount': 0, 'words': [0 for _ in range(len(words))]}
             for t in times]
    for t in corpus:
        d = datetime.strptime(t['created_at'], datetime_format)
        i = (d - min_datetime).days
        times[i]['tweetCount'] += 1
        for word in t['words']:
            word = word['base']
            if word in word_index:
                times[i]['words'][word_index[word]] += 1

    obj = {
        'topics': topics,
        'words': words,
        'dailyCount': times,
    }
    json.dump(obj, open(args.output, 'w'), ensure_ascii=False)


if __name__ == '__main__':
    main()
