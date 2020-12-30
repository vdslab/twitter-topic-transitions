import json
import os
from argparse import ArgumentParser
from tokenizer import divide_text


def main():
    parser = ArgumentParser()
    parser.add_argument('-o', '--output', dest='output',
                        default='words.csv', help='output filename')
    parser.add_argument('files', nargs='+')
    args = parser.parse_args()

    outpath = os.path.abspath(args.output)
    os.makedirs(os.path.dirname(outpath), exist_ok=True)
    with open(outpath, 'w') as f:
        for filename in args.files:
            for row in open(filename):
                data = json.loads(row)
                f.write(json.dumps({
                    'tags': ['wp' + data['id']],
                    'words': divide_text(data['text']),
                }, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
