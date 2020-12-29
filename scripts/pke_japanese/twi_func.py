import MeCab
import re


def get_full_twi(js):
    extended_tweet = js["extended_tweet"]
    full_text = extended_tweet["full_text"]

    return full_text


def get_twi_text(obj):
    if 'extended_tweet' in obj:
        text = get_full_twi(obj)
    else:
        text = obj["text"]

    return text


def format_twi_text(text):
    pattern_url = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')  # 匹配模式

    pattern_sharp = re.compile(r'#(?:[\S])+')

    pattern_at = re.compile(r'@(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')  # 匹配模式

    text = text.replace('\n', ' ')

    tags = pattern_sharp.findall(text)

    text = text.replace('#', '')

    f_text = pattern_url.sub('', text)
    f_text = pattern_at.sub('', f_text)

    return f_text


def re_hosi(text):
    pattern_hosi = re.compile(r'\* ')

    f_text = pattern_hosi.sub('', text)

    return f_text


def wakati_by_mecab(text):
    text = format_twi_text(text)

    tag = MeCab.Tagger('-Owakati -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd')
    tag.parse('')
    no = tag.parseToNode(text)
    w_list = []
    while no:
        feature = no.feature.split(",")
        pos = feature[0]
        if pos in ["名詞", "動詞", "形容詞"]:   # 対象とする品詞
            word = feature[6]
            w_list.append(word)
        # word = no.surface
        # if word not in stopwords:
        #     w_list.append(word)
        no = no.next
    return re_hosi(" ".join(w_list))
