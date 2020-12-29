import json
from matplotlib import pyplot
from sklearn.manifold import TSNE

import numpy as np
import pandas as pd

from sklearn.cluster import DBSCAN
import matplotlib.colors as mcolors

import codecs
import datetime


file = "./vec_json/new_alltime_word_vec_300.json"

# file = "./vec_json/twi_vec_" + str(d2v_size) + "_w" + \
#          str(d2v_window) + "_ws" + str(time_window) + "_tw" + str(twi_window[twi_window_switch]) + ".json"


with open(file, 'r') as reader:
    js = json.load(reader)

X = [item['vec'] for item in js]

tsne = TSNE(n_components=2, perplexity=30.0, random_state=2434)

result = tsne.fit_transform(X)

x = result

# clusters = 50
#
# clf = KMeans(n_clusters=clusters)
# clf.fit(x)  # 分组

eps_list = []
min_samples_list = []

for i in range(5):
    eps_list.append(1+(i*0.2))
    min_samples_list.append(1+i)

eps_list = [1.8]
min_samples_list = [3]

for eps in eps_list:
    for min_samples in min_samples_list:
        clf = DBSCAN(eps=eps, min_samples=min_samples)
        clf.fit(x)

        # centers = clf.cluster_centers_  # 两组数据点的中心点
        labels = clf.labels_  # 每个数据点所属分组
        # print(centers)
        # print(labels)

        print("eps = " + str(eps) + " min_samples = " + str(min_samples))

        n_clusters = len([i for i in set(clf.labels_) if i != -1])
        print("n_clusters: " + str(n_clusters))

        outliners = np.sum(np.where(clf.labels_ == -1, 1, 0))
        print("outliners: " + str(outliners))

        stats = pd.Series([i for i in clf.labels_ if i != -1]).value_counts().values
        # stats = str(pd.Series([i for i in clf.labels_ if i != -1]).value_counts().values)
        print("stats: " + str(stats))
        stats = stats.tolist()

        colors = list(mcolors.XKCD_COLORS.values())

        # # 解决中文显示问题
        pyplot.rcParams['font.sans-serif'] = ['Hiragino Maru Gothic Pro', 'Yu Gothic', 'Meirio', 'Takao', 'IPAexGothic',
                                              'IPAPGothic', 'VL PGothic', 'Noto Sans CJK JP']  # 指定默认字体
        pyplot.rcParams['axes.unicode_minus'] = False  # 解决保存图像是负号'-'显示为方块的问题

        # words = list(m.wv.vocab)

        word_coordinate_js = []

        for i, item in enumerate(js):
            if labels[i] == -1:
                color = 'red'
            else:
                color = colors[4 * labels[i]]

            # js_time = jptime_format(item["twi_time"])
            twi_dict = {"word": item["word"], "count": item["count"], "color": color,
                        "x": float(result[i, 0]), "y": float(result[i, 1])}
            word_coordinate_js.append(twi_dict)

            # if item["word"][-2:] == "":#

            # 可视化展示
            pyplot.scatter(result[i, 0], result[i, 1], c=color)
            pyplot.annotate(item["word"], xy=(result[i, 0], result[i, 1]), fontsize='x-small')

            # pyplot.annotate((str(labels[i]) + item["word"]), xy=(result[i, 0], result[i, 1]), fontsize='x-small')

        pyplot.title("word_map with eps = " + str(eps) + " min_samples = " + str(min_samples))

        few_count = []
        for i in range(1, 5):
            few_count.append({i: stats.count(i)})
        img_info_a = "n_clusters: " + str(n_clusters) + ", outliners: " + str(outliners) + ", biggest: " + str(stats[0])
        img_info_b = "few: " + str(few_count)

        pyplot.text(20.5, -10, img_info_a, fontsize=10, rotation=-90)
        pyplot.text(1, -19.8, img_info_b, fontsize=10, rotation=0)

        save_path = "./word_fig/dbscan/"
        f_name = "eps_" + str(eps) + "_min_" + str(min_samples)
        pyplot.savefig(save_path + f_name + ".png")

        pyplot.show()

        pyplot.cla()

        submit = "./coordinate_json/dbscan_word_coordinate.json"

        json.dump(word_coordinate_js, codecs.open(submit, 'w', encoding='utf-8')
                  , separators=(',', ':'), sort_keys=True, indent=4, ensure_ascii=False)
