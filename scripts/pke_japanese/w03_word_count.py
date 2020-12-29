import json


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


file = "./json/day_word_count.json"

with open(file, 'r') as reader:
    obj = json.load(reader)

    wc_collect = []

    for date_row in obj:
        date = date_row["date"]
        for word in date_row["day_word_count"]:
            if not is_exist(wc_collect, word["word"]):
                wc_collect.append(word)
            else:
                wc_collect = count_sum(wc_collect, word["word"], word["count"])

        wc_collect.sort(key=func, reverse=True)

    print()
submit = './json/alltime_word_count.json'

with open(submit, 'w') as f:
    json.dump(wc_collect, f, ensure_ascii=False, indent=4)
