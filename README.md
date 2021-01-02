# Visualization of Topic Transitions on Twitter

## Data Preparation

### Twitter corpus

```shell-session
$ python3 scripts/create_twitter_corpus.py -o data/corpus/twitter_corvid19.ndjson --chunk=400 --window=3 path/to/twitter/data/*.ndjson
```

### Learning Doc2Vec model

```shell-session
$ python3 scripts/d2v_learn.py --model data/twitter.model --vocabulary-output data/vocabulary.csv --vector-size 300 data/corpus/twitter_corvid19.ndjson
```

### generate json file

```shell-session
$ python3 scripts/create_json.py -m ./data/twitter.model -o public/data.json --corpus=data/corpus/twitter_corvid19.ndjson
```

## Development

```shell-session
$ npm ci
$ npm start
```
