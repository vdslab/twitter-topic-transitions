import os
import json

from twi_func import get_twi_text
from twi_func import wakati_by_mecab


def function(twi_time):
    # print(date['created_at_jp'])
    return twi_time['created_at_jp']


def format_json(path, f_name):
    file = path + '/' + str(f_name)

    jtw = []
    with open(file, 'r') as reader:
        twi_info = json.load(reader)
        if twi_info:
            # twi_info.sort(reverse=1)
            twi_info.sort(key=function)

            for obj in twi_info:
                twi_id = obj["id_str"]
                twi_text = get_twi_text(obj)
                mecab_twi = wakati_by_mecab(twi_text)
                u_id = obj["user"]["id_str"]
                twi_time = obj["created_at_jp"]
                twi = {"twi_id": twi_id, "twi_text": twi_text,
                       "mecab_twi": mecab_twi, "u_id": u_id, "twi_time": twi_time}
                jtw.append(twi)

    return jtw


def write_js_file(w_date, w_file_name, w_js):
    w_path = './json/json_tweets/' + str(w_date)

    if not os.path.exists(w_path):
        os.makedirs(w_path)

    submit = w_path + '/' + w_file_name

    result = w_js
    with open(submit, 'w') as f:
        json.dump(result, f, ensure_ascii=False, indent=4)


folder_path = 'json/tweets_by_hours_jp/'
days_dirs = os.listdir(folder_path)
days_dirs.sort()

for date in days_dirs:
    if date != ".DS_Store":
        json_path = folder_path + date
        json_files = os.listdir(folder_path + date)
        json_files.sort()

        for file_name in json_files:
            if date != ".DS_Store":
                js = format_json(json_path, file_name)

                write_js_file(date, file_name, js)
