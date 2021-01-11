# Visualization of Topic Transitions on Twitter

A demo is available at: https://vdslab.github.io/twitter-topic-transitions/.

## Prerequirements

```shell-session
$ pip install -r requirements.txt
$ npm ci
```

## Data Preparation

### Twitter corpus

For better visualization, we recommend setting the number of topics (= number of tweets / chunk size) to thousands.

```shell-session
$ python3 scripts/create_twitter_corpus.py -o data/corpus/twitter.ndjson --chunk=400 --window=3 path/to/twitter/data/*.ndjson
```

### Learning Doc2Vec model

```shell-session
$ python3 scripts/d2v_learn.py --model data/twitter.model --vector-size 300 data/corpus/twitter.ndjson
```

### generate json file

```shell-session
$ python3 scripts/create_json.py -m ./data/twitter.model -o public/data.json --corpus=data/corpus/twitter.ndjson
```

## Development

```shell-session
$ npm start
```
