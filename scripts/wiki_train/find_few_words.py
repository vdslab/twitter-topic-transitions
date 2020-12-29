import argparse
from collections import defaultdict
import io

# doc_path = '/Users/Victor_Xiao/Documents/LocalPycharmProjects/wiki_train/data/corpus/AA/'
#
# source_file = doc_path + 'wiki_wakati'
# output_file = doc_path + 'few_word_in_wiki'

parser = argparse.ArgumentParser()
parser.add_argument('input')
parser.add_argument('output')
args = parser.parse_args()

words = defaultdict(lambda: 0)
for line in io.open(args.input, "r", encoding="utf-8"):
    print("working on counting...")
    line = line.strip()
    if line == "" or line[0] == "<":
        continue
    for word in line.split(" "):
        words[word] += 1

print("word num : ", len(words))

few_word_num = 0

f = args.output
with io.open(args.output, "w", encoding="utf-8") as f:
    print("writing file...")
    for word in words:
        if words[word] <= 10:
            few_word_num += 1
            f.write(word)
            f.write("\n")

print("few word num : ", few_word_num)
