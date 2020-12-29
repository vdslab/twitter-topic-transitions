import json
from matplotlib import pyplot
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA

import codecs
import datetime

d2v_size = 200
d2v_window = 8
time_window = 24

# twi_window = [30, 50, 80, 100]

twi_window = [1, 5, 10]
twi_window_switch = 2


def jptime_format(time_str):
    time_format = "%Y%m%d_%H"
    # time_array = time.strptime(time_str, time_format)

    # time_format = "%Y%m%d"
    time_array = datetime.datetime.strptime(time_str, time_format)
    # time_array += datetime.timedelta(hours=9)
    jp_time = datetime.datetime.strftime(time_array, "%Y-%m-%dT%H:00:00")
    # 2020-03-30T23:11:32

    # hour = time.strftime("%H", time_array)
    # print(new_time)
    return jp_time


def reduce_points(ori_js, ori_x, reduce_size):
    new_x = []
    new_js = []
    for j in range(len(X)):
        if (j + 50) % reduce_size == 0:
            new_js.append(ori_js[j])
            new_x.append(ori_x[j])

    return new_js, new_x


# pca = PCA(n_components=2)
# result = pca.fit_transform(X)


file = "./vec_json/twi_vec_" + str(d2v_size) + "_w" + \
         str(d2v_window) + "_ws" + str(time_window) + "_new.json"

# file = "./vec_json/twi_vec_" + str(d2v_size) + "_w" + \
#          str(d2v_window) + "_ws" + str(time_window) + "_tw" + str(twi_window[twi_window_switch]) + ".json"


with open(file, 'r') as reader:
    js = json.load(reader)

X = [item['vec'] for item in js]

tsne = TSNE(n_components=2, perplexity=30.0)

# use when X is too big(ori_size>3000)
# js, X = reduce_points(js, X, 50)

result = tsne.fit_transform(X)


# # 解决中文显示问题
pyplot.rcParams['font.sans-serif'] = ['Hiragino Maru Gothic Pro', 'Yu Gothic', 'Meirio', 'Takao', 'IPAexGothic',
                                      'IPAPGothic', 'VL PGothic', 'Noto Sans CJK JP']  # 指定默认字体
pyplot.rcParams['axes.unicode_minus'] = False  # 解决保存图像是负号'-'显示为方块的问题
#
# # 可视化展示
pyplot.scatter(result[:, 0], result[:, 1])
# words = list(m.wv.vocab)

coordinate_js = []

for i, item in enumerate(js):
    # if int(item["tno_" +
    #             str(twi_window[twi_window_switch])][(5 + len(str(twi_window[twi_window_switch]))):]) % 50 == 0:
    #     pyplot.annotate(item["tno_"+str(twi_window[twi_window_switch])], xy=(result[i, 0], result[i, 1]))

    js_time = jptime_format(item["twi_time"])
    twi_dict = {"time": js_time, "x": int(result[i, 0]*10), "y": int(result[i, 1]*10)}
    coordinate_js.append(twi_dict)
    if item["twi_time"][-2:] == "12":
        pyplot.annotate(item["twi_time"][4:8], xy=(result[i, 0], result[i, 1]))


submit = "./coordinate_json/twi_time_coordinate_" + str(d2v_size) + "_w" + \
         str(d2v_window) + "_ws" + str(time_window) + "_new.json"

# submit = "./coordinate_json/twi_time_coordinate_" + str(d2v_size) + "_w" + \
#          str(d2v_window) + "_ws" + str(time_window) + "_tw" + str(twi_window[twi_window_switch]) + ".json"

pyplot.title(submit[35:-5])
pyplot.show()

# json.dump(coordinate_js, codecs.open(submit, 'w', encoding='utf-8'), separators=(',', ':'), sort_keys=True, indent=4)
