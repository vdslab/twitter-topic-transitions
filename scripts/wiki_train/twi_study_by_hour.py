import gensim
import smart_open
import os
import json
import time
import datetime

from gensim.models.doc2vec import Doc2Vec
from gensim.models.doc2vec import TaggedDocument

trainings_twi = []

d2v_size = 200
d2v_window = 8
time_window = 10

twi_window = [50, 60]


def get_hour_jp(time_str, window):
    hours = []

    time_format = "%Y%m%d_%H"
    time_array = time.strptime(time_str, time_format)
    # hour_now
    hours.append(time.strftime("%Y%m%d_%H", time_array))

    time_array = datetime.datetime.strptime(time_str, time_format)

    for i in range(1, window + 1):
        time_array_b = time_array - datetime.timedelta(hours=i)
        hours.append(datetime.datetime.strftime(time_array_b, "%Y%m%d_%H"))

        time_array_a = time_array + datetime.timedelta(hours=i)
        hours.append(datetime.datetime.strftime(time_array_a, "%Y%m%d_%H"))

    # print(hour)
    # hours.sort()
    return hours


def study_and_save(wiki):
    # print(strs)

    # print(list(enumerate(strs.split(' '))))

    print("getting wiki texts...")

    trainings_wiki = [TaggedDocument(words=data.split(), tags=['wiki{}'.format(i)]) for i, data in enumerate(wiki)]

    # # for i, data in enumerate(twi_by_h):
    # print("getting tweets texts...")

    # trainings_twi = [TaggedDocument(words=data["one_hour_twi"].split(), tags=[data["twi_time"], ])
    #                  for i, data in enumerate(twi_by_h)]

    # print(trainings_twi)

    print("study started...")

    # トレーニング（パラメータについては後日）
    m = Doc2Vec(documents=trainings_twi + trainings_wiki, dm=1,
                vector_size=d2v_size, window=d2v_window, min_count=10, workers=4)

    # !!twi,wiki順序変わった
    # m = Doc2Vec(documents=trainings_wiki + trainings_twi, dm=1,
    #             vector_size=d2v_size, window=d2v_window, min_count=10, workers=4)

    # モデルのセーブ
    m.save("./models/hours_twi_study_" + str(d2v_size) + "_w" + str(d2v_window) +
           "_ws" + str(time_window) + "_with_num(" + str(twi_window).replace(", ", "_")[1:-1] + ").model")


def get_twi_by_file(path, f_name):
    file = path + '/' + str(f_name)

    with open(file, 'r') as reader:
        twi_info = json.load(reader)
        if twi_info:
            for obj in twi_info:
                # mecab_twi = obj["mecab_twi"]

                # twi_text = get_twi_text(obj)
                # mecab_twi = wakati_by_mecab(twi_text)
                # u_id = obj["user"]["id_str"]
                # twi_time = obj["created_at_jp"]
                # twi = {"twi_id": twi_id, "twi_text": twi_text,
                #        "mecab_twi": mecab_twi, "u_id": u_id, "twi_time": twi_time}
                # jtw.append(twi)

                # +- n hours, list
                tag = get_hour_jp(f_name[0:11], time_window)
                tag.append("tid_" + obj["twi_id"])

                tweets_count = obj["twi_no"]

                # +-　group_size(j)
                for i in twi_window:
                    for j in range(-i, i+1):
                        if int(tweets_count + j) > 0:
                            tag.append("tno_" + str(i) + "_"+str(int(tweets_count + j)))

                # tag.append("tno_300_"+str(int((tweets_count - 1) / 300) + 1))
                # tag.append("tno_350_"+str(int((tweets_count - 1) / 350) + 1))
                # tag.append("tno_400_"+str(int((tweets_count - 1) / 400) + 1))

                trainings_twi.append(TaggedDocument(words=obj["mecab_twi"].split(), tags=tag))

    # if f_name == "20200330_12.json":
    #     print()
    # return file_twi, twi_id


wiki_file = open('/Users/Victor_Xiao/Documents/LocalPycharmProjects/wiki_train/data/corpus/AA/cuted_wiki', 'r')
# twi_file = open('/Users/Victor_Xiao/Documents/LocalPycharmProjects/wiki_train/data/corpus/AA'
#                 '/study_data_twi_with_wecab.txt', 'r')

folder_path = 'data/json_tweets/'
days_dirs = os.listdir(folder_path)
days_dirs.sort()


twi_collect = []

print("getting tweets texts...")
for date in days_dirs:
    if date != ".DS_Store":
        json_path = folder_path + date
        json_files = os.listdir(folder_path + date)
        json_files.sort()

        for file_name in json_files:
            if date != ".DS_Store":
                get_twi_by_file(json_path, file_name)

                # one_hour_twi = get_twi_by_file(json_path, file_name)
                # if not one_hour_twi == "":
                #     twi_collect.append({"twi_time": file_name[0:11], "one_hour_twi": one_hour_twi})
                #
                # write_js_file(date, file_name, js)

study_and_save(wiki_file)

# model = gensim.models.doc2vec.Doc2Vec(size=400, min_count=10, iter=55)
#
# model.build_vocab(train_corpus)
# model.train(train_corpus, total_examples=model.corpus_count, epochs=model.iter)
#
# model.save(args.save_model)
