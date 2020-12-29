import glob
import json


def count_word(w_list):
    hwc = []

    for w in w_list:
        is_exist = 0

        for row_in_hwc in hwc:
            if w == row_in_hwc["word"]:
                is_exist = 1

                row_in_hwc['count'] = row_in_hwc['count'] + 1
                break

        if is_exist == 0:
            del_word_tag = 1
            n = 1
            for row_in_word_coordinate in word_coordinate:
                if w == row_in_word_coordinate["word"]:
                    del_word_tag = 0
                    x = row_in_word_coordinate["x"]
                    y = row_in_word_coordinate["y"]
                    color = row_in_word_coordinate["color"]
                    total_count = row_in_word_coordinate["count"]
                    tmp = {'word': w, 'count': n, 'total_count': total_count, 'x': x, 'y': y, 'color': color}
                    hwc.append(tmp)
                    break
            if del_word_tag == 1:
                tmp = {'word': w, 'count': n}
                hwc.append(tmp)

    return hwc


word_coordinate_file = "./json/dbscan_word_coordinate.json"
with open(word_coordinate_file, 'r') as reader:
    # print(word_coordinate_file)

    word_coordinate = json.load(reader)
    # print(word_coordinate)


alltime_word_collect = []

path = "./json/json_tweets/"

date_dir = glob.glob(path + "*")
date_dir.sort()

for dirs in date_dir:
    if dirs != '.DS_Store':
        files = glob.glob(dirs + "/*.json")
        files.sort()

        obj = []
        day_word_collect = []

        for file in files:
            with open(file, 'r') as reader:

                print(file)
                obj = json.load(reader)
                if not len(obj) == 0:
                    for row in obj:
                        twi_text = row["twi_text"]
                        twi_mecab = row["mecab_twi"]

                        word_list = twi_mecab.split(' ')

                        hour_word_collect = count_word(word_list)

                        # tweets_count += 1
                        # num_100 = tweets_count % 5
                        print()
                        # twi_time = jptime_format(row["twi_time"])
                        # row["twi_no"] = tweets_count
                    if not len(hour_word_collect) == 0:
                        tmp = {'hour': file[-7:-5], 'hour_word_collect': hour_word_collect}
                        day_word_collect.append(tmp)

        if not len(day_word_collect) == 0:
            tmp = {'date': dirs[-8:], 'date_word_collect': day_word_collect}
            alltime_word_collect.append(tmp)

print(alltime_word_collect)

submit = './json/alltime_word_collect_with_dbscan_coordinate.json'

with open(submit, 'w') as f:
    json.dump(alltime_word_collect, f, ensure_ascii=False, indent=4)
