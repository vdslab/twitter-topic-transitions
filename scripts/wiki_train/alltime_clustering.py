import json
from matplotlib import pyplot

import numpy as np
import pandas as pd

from sklearn.cluster import DBSCAN
import matplotlib.colors as mcolors

import codecs


file = "./coordinate_json/twi_time_coordinate_200_w8_ws20.json"

# file = "./vec_json/twi_vec_" + str(d2v_size) + "_w" + \
#          str(d2v_window) + "_ws" + str(time_window) + "_tw" + str(twi_window[twi_window_switch]) + ".json"


with open(file, 'r') as reader:
    js = json.load(reader)

# X = [item['vec'] for item in js]
#
# tsne = TSNE(n_components=2, perplexity=30.0, random_state=2434)
#
# result = tsne.fit_transform(X)

# x = [[item['x'] for item in js], [item['y'] for item in js]]

x = []

for item in js:
    x.append([item['x'], item['y']])

# clusters = 50
#
# clf = KMeans(n_clusters=clusters)
# clf.fit(x)  # 分组

eps_list = []
min_samples_list = []

for i in range(5):
    eps_list.append(1+(i*0.2))
    min_samples_list.append(1+i)

eps_list = [0.5 * i for i in range(30, 35)]
min_samples_list = [3]

eps_list = [23]
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
            out_flag = 0
            if labels[i] == -1:
                color = 'red'
                out_flag = 1
            else:
                # color = colors[labels[i]]
                if labels[i] < 949:
                    color = colors[labels[i]]
                else:
                    color = 'purple'

            same_clustering = []

            if not out_flag == 1:
                for j, temp_item in enumerate(js):
                    if labels[j] == labels[i]:
                        if not item["time"] == temp_item["time"]:
                            same_clustering.append(temp_item["time"])

            # js_time = jptime_format(item["twi_time"])
            twi_dict = {"time": item["time"], "x": float(item['x']), "y": float(item['y']),
                        "out_flag": out_flag, "same_clustering": same_clustering}
            word_coordinate_js.append(twi_dict)

            # if item["word"][-2:] == "":#

            # 可视化展示
            pyplot.scatter(item['x'], item['y'], c=color)
            # pyplot.annotate(item["time"], xy=(item['x'], item['y']), fontsize='x-small')

            # pyplot.annotate((str(labels[i]) + item["word"]), xy=(item['x'], item['y']), fontsize='x-small')

        pyplot.title("alltime_map with eps = " + str(eps) + " min_samples = " + str(min_samples))

        few_count = []
        for i in range(1, 5):
            few_count.append({i: stats.count(i)})
        img_info_r = "n_clusters: " + str(n_clusters) + ", outliners: " + str(outliners) + ", biggest: " + str(stats[0])
        img_info_b = "few: " + str(few_count)

        pyplot.text(800, -660, img_info_r, fontsize=10, rotation=-90)
        pyplot.text(-200, -880, img_info_b, fontsize=10, rotation=0)

        save_path = "./word_fig/dbscan/"
        f_name = "eps_" + str(eps) + "_min_" + str(min_samples)
        # pyplot.savefig(save_path + f_name + ".png")

        pyplot.show()

        pyplot.cla()

        submit = "./coordinate_json/twi_time_coordinate_200_w8_ws20_with_clustering.json"

        # json.dump(word_coordinate_js, codecs.open(submit, 'w', encoding='utf-8'),
        #           separators=(',', ':'), sort_keys=True, indent=4, ensure_ascii=False)
