import json

from gensim.models.doc2vec import Doc2Vec

import codecs


d2v_size = 200
d2v_window = 8
time_window = 20

twi_window = [500]

# twi_window = [30, 50, 80, 100]
# twi_window = [200, 300]
twi_window_switch = 0


mo = Doc2Vec.load("./models/hours_twi_study_" + str(d2v_size) + "_w" + str(d2v_window) +
                  "_ws" + str(time_window) + "_with_num(" + str(twi_window)
                  .replace(", ", "_")[1:-1] + ").model")


word_count_file = "./new_alltime_word_count.json"

word_vec = []

with open(word_count_file, 'r') as reader:
    obj = json.load(reader)

    count = 0

    for word_data in obj:
        if count < 300:
            count += 1

            word = word_data["word"]

            wv = mo[word]

            tmp = {"word": word, "count": word_data["count"], "vec": wv.tolist()}
            word_vec.append(tmp)
        else:
            break

print(word_vec)

submit = './vec_json/new_alltime_word_vec_300.json'

with open(submit, 'w') as f:
    json.dump(word_vec, codecs.open(submit, 'w', encoding='utf-8'),
              separators=(',', ':'), sort_keys=True, indent=4, ensure_ascii=False)

