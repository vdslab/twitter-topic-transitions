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


file = "./json/alltime_word_collect.json"

with open(file, 'r') as reader:
    obj = json.load(reader)

    dwc_collect = []

    for date_row in obj:
        date = date_row["date"]
        day_word_count = []
        for hour_row in date_row["date_word_collect"]:
            hour = hour_row["hour"]
            hour_word_collect = hour_row["hour_word_collect"]
            for word in hour_word_collect:
                if not is_exist(day_word_count, word["word"]):
                    day_word_count.append(word)
                else:
                    day_word_count = count_sum(day_word_count, word["word"], word["count"])
        day_word_count.sort(key=func, reverse=True)
        tmp = {'date': date, 'day_word_count': day_word_count}
        dwc_collect.append(tmp)

submit = './json/day_word_count.json'

with open(submit, 'w') as f:
    json.dump(dwc_collect, f, ensure_ascii=False, indent=4)
