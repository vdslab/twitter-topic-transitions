import os

import time_convert_func

path = "./json/tweets_by_hours/"
target_path = "./json/tweets_by_hours_jp/"

# folder_path = 'json/covid19-tweets'
dirs = os.listdir(path)
dirs.sort()

print(dirs)

for file_name in dirs:
    if file_name != '.DS_Store':
        date, n_file_name = time_convert_func.g_time_to_jp(file_name)
        if not os.path.exists(target_path + date):
            os.makedirs(target_path + date)

        # 找到老的文件所在的位置
        old_file = os.path.join(path, file_name)
        print("old_file is {}".format(old_file))
        # 指定新文件的位置，如果没有使用这个方法，则新文件名生成在本项目的目录中
        new_file = os.path.join(target_path + date, n_file_name)
        print("File will be renamed as:{}".format(new_file))
        os.rename(old_file, new_file)
        print("修改后的文件名是:{}".format(n_file_name))
