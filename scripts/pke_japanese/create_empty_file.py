import datetime
import os
import json

check_path = './json/dbscan_word_coordinate_by_hour/'

save_path = './json/empty_json/'

start_date = '20191217'
end_date = '20200331'

c_date = start_date


def get_next_date(d):
    time_format = "%Y%m%d"
    time_array = datetime.datetime.strptime(d, time_format)
    time_array += datetime.timedelta(days=1)
    n_d = datetime.datetime.strftime(time_array, "%Y%m%d")
    # print(hour)
    return n_d


def write_empty_json(submit):
    js = []

    with open(submit, 'w') as f:
        json.dump(js, f, ensure_ascii=False, indent=4)


while int(c_date) <= int(end_date):
    # draw_words_with_phour(c_date, c_hour, hour_window)

    for c_hour in range(0, 24):
        path = check_path + str(c_date) + "/"
        if not os.path.exists(path):
            os.makedirs(path)

        f_path = path + str(c_date) + '_' + str(c_hour).zfill(2) + '.json'
        if not os.path.exists(f_path):
            w_path = save_path + str(c_date) + "/"
            if not os.path.exists(w_path):
                os.makedirs(w_path)
            w_path = save_path + str(c_date) + "/" + str(c_date) + '_' + str(c_hour).zfill(2) + '.json'
            write_empty_json(w_path)

    c_date = get_next_date(c_date)
