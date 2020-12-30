import csv
import json
from argparse import ArgumentParser
from gensim.models.doc2vec import Doc2Vec
from gensim.models.doc2vec import TaggedDocument


def load_documents(*filenames):
    for filename in filenames:
        with open(filename) as f:
            for row in f:
                obj = json.loads(row.strip())
                yield TaggedDocument(words=[w['base'] for w in obj['words']], tags=obj['tags'])


def main():
    parser = ArgumentParser()
    parser.add_argument('--model', dest='model',
                        default='twitter.model', help='model output filename')
    parser.add_argument('--seed', dest='seed',
                        default=0, type=int, help='random seed')
    parser.add_argument('--vocabulary-output', dest='vocabulary',
                        default='vocabulary.csv', help='model filename')
    parser.add_argument('files', nargs='+')
    args = parser.parse_args()

    documents = list(load_documents(*args.files))
    model = Doc2Vec(documents, seed=args.seed, workers=16)
    model.save(args.model)

    vocabulary = {}
    for doc in documents:
        for word in doc.words:
            if word not in vocabulary:
                vocabulary[word] = 0
            vocabulary[word] += 1
    vocabulary_writer = csv.writer(open(args.vocabulary, 'w'))
    items = list(vocabulary.items())
    items.sort(key=lambda v: v[1], reverse=True)
    for k, v in items:
        vocabulary_writer.writerow([k, v])


if __name__ == '__main__':
    main()
