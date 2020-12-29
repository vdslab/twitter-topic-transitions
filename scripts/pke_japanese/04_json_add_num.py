import glob
import json


# target_path = "./json/tweets_by_hours_jp/"
# folder_path = 'json/covid19-tweets'

path = "./json/json_tweets/"

date_dir = glob.glob(path + "*")
date_dir.sort()

tweets_count = 0


for dirs in date_dir:
    if dirs != '.DS_Store':
        files = glob.glob(dirs + "/*.json")
        files.sort()

        obj = []

        for file in files:
            with open(file, 'r') as reader:
                print(file)
                obj = json.load(reader)
                # jtw = []
                if not len(obj) == 0:
                    for row in obj:
                        tweets_count += 1
                        # num_100 = tweets_count % 5
                        print()
                        # twi_time = jptime_format(row["twi_time"])
                        row["twi_no"] = tweets_count

            if not len(obj) == 0:
                with open(file, 'w') as f:
                    json.dump(obj, f, ensure_ascii=False, indent=4)

