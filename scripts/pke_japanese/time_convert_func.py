import time
import datetime

"""
%a 星期的简写。如 星期三为Web
%A 星期的全写。如 星期三为Wednesday
%b 月份的简写。如4月份为Apr
%B 月份的全写。如4月份为April
%c:  日期时间的字符串表示。（如： 04/07/10 10:43:39）
%d:  日在这个月中的天数（是这个月的第几天）
%f:  微秒（范围[0,999999]）
%H:  小时（24小时制，[0, 23]）
%I:  小时（12小时制，[0, 11]）
%j:  日在年中的天数 [001,366]（是当年的第几天）
%m:  月份（[01,12]）
%M:  分钟（[00,59]）
%p:  AM或者PM
%S:  秒（范围为[00,61]，为什么不是[00, 59]，参考python手册~_~）
%U:  周在当年的周数当年的第几周），星期天作为周的第一天
%w:  今天在这周的天数，范围为[0, 6]，6表示星期天
%W:  周在当年的周数（是当年的第几周），星期一作为周的第一天
%x:  日期字符串（如：04/07/10）
%X:  时间字符串（如：10:43:39）
%y:  2个数字表示的年份
%Y:  4个数字表示的年份
%z:  与utc时间的间隔 （如果是本地时间，返回空字符串）
%Z:  时区名称（如果是本地时间，返回空字符串）
%%:  %% => %
"""


def get_hour(time_str):
    time_format = "%a %b %d %H:%M:%S +0000 %Y"
    time_array = datetime.datetime.strptime(time_str, time_format)
    time_array += datetime.timedelta(hours=9)
    hour = datetime.datetime.strftime(time_array, "%H")
    # print(hour)
    return hour


def get_hour_jp(time_str):
    time_format = "%a %b %d %H:%M:%S +0900 %Y"
    time_array = time.strptime(time_str, time_format)
    hour = time.strftime("%H", time_array)
    # print(hour)
    return hour


def get_jptime_format(time_str):
    time_format = "%a %b %d %H:%M:%S +0000 %Y"
    # time_array = time.strptime(time_str, time_format)

    # time_format = "%Y%m%d"
    time_array = datetime.datetime.strptime(time_str, time_format)
    time_array += datetime.timedelta(hours=9)
    new_time = datetime.datetime.strftime(time_array, "%Y/%m/%d-%H:%M:%S")

    # hour = time.strftime("%H", time_array)
    # print(new_time)
    return new_time


def get_jptime(time_str):
    time_format = "%a %b %d %H:%M:%S +0000 %Y"
    # time_array = time.strptime(time_str, time_format)

    # time_format = "%Y%m%d"
    time_array = datetime.datetime.strptime(time_str, time_format)
    time_array += datetime.timedelta(hours=9)
    jp_time = datetime.datetime.strftime(time_array, "%a %b %d %H:%M:%S +0900 %Y")

    # hour = time.strftime("%H", time_array)
    # print(new_time)
    return jp_time


def g_time_to_jp(time_str):
    time_format = "%Y%m%d_%H.json"
    # time_array = time.strptime(time_str, time_format)

    # time_format = "%Y%m%d"
    time_array = datetime.datetime.strptime(time_str, time_format)
    # time_array += datetime.timedelta(hours=9)

    date = datetime.datetime.strftime(time_array, "%Y%m%d")
    jp_time_name = datetime.datetime.strftime(time_array, "%Y%m%d_%H.json")

    # hour = time.strftime("%H", time_array)
    # print(new_time)
    return date, jp_time_name


def jptime_format(time_str):
    time_format = "%a %b %d %H:%M:%S +0900 %Y"
    # time_array = time.strptime(time_str, time_format)

    # time_format = "%Y%m%d"
    time_array = datetime.datetime.strptime(time_str, time_format)
    # time_array += datetime.timedelta(hours=9)
    jp_time = datetime.datetime.strftime(time_array, "%Y-%m-%dT%H:%M:%S")
    # 2020-03-30T23:11:32

    # hour = time.strftime("%H", time_array)
    # print(new_time)
    return jp_time

# text = "Sun Mar 22 15:00:53 +0000 2020"
#
# time = get_jptime(text)
#
# print(time)

# time_fm = "%a %b %d %H:%M:%S +0000 %Y"
#
# timeArray = time.strptime(text, time_fm)
# otherStyleTime = time.strftime("%Y/%m/%d %H:%M:%S", timeArray)
# print(otherStyleTime)
#
# hour = time.strftime("%H", timeArray)
# print(hour)
#
# # 转换为时间戳
# timeStamp = int(time.mktime(timeArray))
# print(timeStamp)

# print(time.localtime(time.time()))
