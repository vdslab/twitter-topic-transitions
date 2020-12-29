import json
import os


def save_hwc_to_json(d, h, hwc_js):
    w_file_name = d + "_" + h + ".json"

    w_path = './json/dbscan_word_coordinate_by_hour/' + str(d)

    if not os.path.exists(w_path):
        os.makedirs(w_path)

    submit = w_path + '/' + w_file_name

    with open(submit, 'w') as f:
        json.dump(hwc_js, f, ensure_ascii=False, indent=4)


file = "./json/alltime_word_collect_with_dbscan_coordinate.json"

with open(file, 'r') as reader:
    obj = json.load(reader)

    for date_row in obj:
        date = date_row["date"]
        for hour_row in date_row["date_word_collect"]:
            hour = hour_row["hour"]
            hour_word_collect = hour_row["hour_word_collect"]

            hwc_with_coordinate = []

            for word in hour_word_collect:
                if not word.get("color") is None:
                    hwc_with_coordinate.append(word)

            if not hwc_with_coordinate == []:
                save_hwc_to_json(date, hour, hwc_with_coordinate)


# submit = './json/day_word_count.json'
#
# with open(submit, 'w') as f:
#     json.dump(dwc_collect, f, ensure_ascii=False, indent=4)
