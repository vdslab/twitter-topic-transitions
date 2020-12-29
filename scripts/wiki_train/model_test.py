import json
import os
import re

import MeCab

from gensim.models.doc2vec import Doc2Vec
from gensim.models.doc2vec import TaggedDocument


import codecs


# num = 0

# for num in model.docvecs:
#     print()


# gen every twi group's vec
def twi_window_collect_vec(model):
    vec_coll = []
    for i in range(1, 226187):
        tag = "tno_"+str(twi_window[twi_window_switch])+"_" + str(i)
        if tag in model.docvecs:
            vec_coll.append({"tno_"+str(twi_window[twi_window_switch]): tag, "vec": model.docvecs[tag].tolist()})

    sub = "./vec_json/twi_vec_" + str(d2v_size) + "_w" + \
          str(d2v_window) + "_ws" + str(time_window) + "_tw" + str(twi_window[twi_window_switch]) + ".json"

    return vec_coll, sub


# gen every twi time group's vec
def time_window_collect_vec(model):
    vec_coll = []

    folder_path = 'data/json_tweets/'
    days_dirs = os.listdir(folder_path)
    days_dirs.sort()

    for date in days_dirs:
        if date != ".DS_Store":
            json_path = folder_path + date
            json_files = os.listdir(folder_path + date)
            json_files.sort()

            for file_name in json_files:
                if date != ".DS_Store":
                    if file_name[0:11] in model.docvecs:
                        vec_coll.append({"twi_time": file_name[0:11], "vec": model.docvecs[file_name[0:11]].tolist()})

    sub = "./vec_json/twi_vec_" + str(d2v_size) + "_w" + \
          str(d2v_window) + "_ws" + str(time_window) + "_new.json"

    return vec_coll, sub


d2v_size = 200
d2v_window = 8
time_window = 24

twi_window = [1, 5, 10]


# twi_window = [30, 50, 80, 100]
# twi_window = [200, 300]
twi_window_switch = 2


mo = Doc2Vec.load("./models/hours_twi_study_" + str(d2v_size) + "_w" + str(d2v_window) +
                  "_ws" + str(time_window) + "_with_num(" + str(twi_window)
                  .replace(", ", "_")[1:-1] + ").model")

# mo = Doc2Vec.load("./models/hours_twi_study_200_w8_ws10_with_num().model")

# mo = Doc2Vec.load("./models/hours_twi_study_" + str(d2v_size) + "_w" +
#                   str(d2v_window) + "_ws" + str(time_window) + ".model")


# vec_list, submit = time_window_collect_vec(mo)

vec_list, submit = twi_window_collect_vec(mo)


json.dump(vec_list, codecs.open(submit, 'w', encoding='utf-8'), separators=(',', ':'), sort_keys=True, indent=4)

print(mo)
