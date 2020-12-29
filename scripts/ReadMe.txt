# ReadMe

## Japanese Wiki process:
	Using argparse:
	1. Run "wiki_train/find_few_words.py" file. 
	2. Run "wiki_train/cut_few_words.py" to delete few words from wiki.
## format twitter files:
	1. Run "pke_japanese/01_separate_tweets_by_time.py".
	2. Run "pke_japanese/02_rename_file.py".
	3. Run "pke_japanese/03_get_study_json.py".
	4. Run "pke_japanese/04_json_add_num.py".
## Study the model:
	1. Run "wiki_train/twi_study_by_hour.py".
## Get Projection View Json:
	1. Run "wiki_train/model_test.py" to get hours' vector.
	2. Run "wiki_train/dimension_reduce_and_draw.py" get coordinate json.
	3. Run "wiki_train/alltime_clustering.py".
	3. Go JS for visualize.
## Get Word Bubble View Json:
	1. Run the past version of "pke_japanese/w01_word_collect.py" to get "alltime_word_collect.json" which words no coordinate and cluster info.
	2. Run "pke_japanese/w02_day_word_count.py".
	3. Run "pke_japanese/w03_word_count.py".
	4. Run "pke_japanese/w04_word_select_test.py".
	5. Run "wiki_train/word_vec.py" get top 300 words and their vector.
	6. Run "wiki_train/word_dimension_reduce_and_draw.py".
	7. Run "pke_japanese/w01_word_collect.py".
	8. Run "pke_japanese/w05_save_word_coordinate_by_hour.py".
	9. Run "pke_japanese/create_empty_file.py".
	10. Go JS for visualize.
## Vis On JS:
	See "https://github.com/victorXTD/tweets".