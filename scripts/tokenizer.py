import MeCab


mecab = MeCab.Tagger(
    '-d /usr/lib/x86_64-linux-gnu/mecab/dic/mecab-ipadic-neologd')
mecab.parse('')


def parse(text):
    node = mecab.parseToNode(text)
    while node:
        yield [node.surface] + node.feature.split(',')
        node = node.next


def divide_text(text):
    return [{'base': node[7], 'pos': node[1]} for node in parse(text) if node[7] != '*']
