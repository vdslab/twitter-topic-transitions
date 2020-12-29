import json
import MeCab


def func(count):
    # print(count['count'])
    return count['count']


def is_exist(word_list, w):
    for row_in_wl in word_list:
        if w == row_in_wl["word"]:
            return True

    return False


def count_sum(word_list, w, c):
    for row_in_wl in word_list:
        if w == row_in_wl["word"]:
            row_in_wl["count"] = row_in_wl["count"] + c

    return word_list


def is_noneed_mecab(text):
    if text == "*":
        return True
    elif text == "in":
        return True
    elif text == "AT":
        return True

    is_noneed = False
    tag = MeCab.Tagger('-Owakati -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd')
    tag.parse('')
    no = tag.parseToNode(text)
    while no:
        feature = no.feature.split(",")
        pos = feature[0]
        if pos in ["動詞", '助詞']:  # 対象とする品詞
            is_noneed = True
        no = no.next

    return is_noneed


file = "./json/alltime_word_count.json"

new_word_count = []

with open(file, 'r') as reader:
    obj = json.load(reader)

    for word_data in obj:
        word = word_data["word"]
        count = word_data["count"]

        if not is_noneed_mecab(word):
            tmp = {"word": word, "count": count}
            new_word_count.append(tmp)
            print()

        # date = date_row["date"]
        # for word in date_row["day_word_count"]:
        #     if not is_exist(wc_collect, word["word"]):
        #         wc_collect.append(word)
        #     else:
        #         wc_collect = count_sum(wc_collect, word["word"], word["count"])

    new_word_count.sort(key=func, reverse=True)

    print()

submit = './json/new_alltime_word_count.json'

with open(submit, 'w') as f:
    json.dump(new_word_count, f, ensure_ascii=False, indent=4)
