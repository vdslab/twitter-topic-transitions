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
    parser.add_argument('-m', '--model', dest='model',
                        default='twitter.model', help='model output filename')
    parser.add_argument('--vector-size', dest='vector_size',
                        default=100, type=int, help='vector size')
    parser.add_argument('--window', dest='window', default=5, type=int)
    parser.add_argument('--epochs', dest='epochs', default=10, type=int)
    parser.add_argument('--min-count', dest='min_count', default=0, type=int)
    parser.add_argument('--seed', dest='seed', default=0,
                        type=int, help='random seed')
    parser.add_argument('files', nargs='+')
    args = parser.parse_args()

    print('loading documents')
    documents = list(load_documents(*args.files))
    print('start learning')
    model = Doc2Vec(documents, seed=args.seed, vector_size=args.vector_size,
                    window=args.window, epochs=args.epochs, min_count=args.min_count, workers=4)

    print('writing results')
    model.save(args.model)
    print('finish')


if __name__ == '__main__':
    main()
