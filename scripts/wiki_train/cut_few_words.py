import argparse
import re
import io

parser = argparse.ArgumentParser()
parser.add_argument('input')
parser.add_argument('few_words')
parser.add_argument('output')
args = parser.parse_args()

few_words = set()
for line in io.open(args.few_words, "r", encoding="utf-8"):
    dst = re.sub(r'([\[\](){}\\*+.?^$\-|])', r'\\\1', line.strip())
    if dst in ("", "「", "」", "、", "。", "（", "）"):
        continue
    few_words.add(dst)

f = io.open(args.output, "w", encoding="utf-8")
for line in io.open(args.input, "r", encoding="utf-8"):
    if line.strip() == "" or line[0] == "<":
        continue
    found = False
    words = line.strip().split(" ")
    if len(words) <= 2:
        continue
    for word in words:
        if word in few_words:
            found = True
            break
    if found:
        continue
    f.write(line)
f.close()
