import os
import json
import argparse

import time_convert_func


def get_tweet_by_h(file):
    twi_by_h = [[] for _ in range(24)]

    with open(file, 'r') as reader:
        # jtw = []
        for row in reader:
            obj = json.loads(row)

            created_at_jp = time_convert_func.jptime_format(
                time_convert_func.get_jptime(obj["created_at"]))
            # obj = json.dumps({**obj, **{"created_at_jp": created_at_jp}})
            obj["created_at_jp"] = created_at_jp

            created_hour = time_convert_func.get_hour(obj["created_at"])
            # print(created_hour)
            # text[int(created_hour)] += obj["text"] + "\n"
            twi_by_h[int(created_hour)].append(obj)

    return twi_by_h


def write_tbh_file(w_date, twibh, w_path):
    for i in range(0, 24):
        w_fname = w_date + '_' + "{:0>2d}".format(i) + '.json'
        submit = w_path + '/' + w_fname

        result = twibh[i]

        with open(submit, 'w') as f:
            json.dump(result, f, ensure_ascii=False, indent=4)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('indir')
    parser.add_argument('outdir')
    args = parser.parse_args()

    dirs = os.listdir(args.indir)
    dirs.sort()
    for file_name in dirs:
        date = file_name[6:14]
        tbh = get_tweet_by_h(args.indir + '/' + file_name)
        write_tbh_file(date, tbh, args.outdir)


if __name__ == '__main__':
    main()
