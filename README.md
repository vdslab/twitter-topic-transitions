# Visualization of Topic Transitions on Twitter

## Data Preparation

### jawiki corpus

```shell-session
$ curl https://dumps.wikimedia.org/jawiki/latest/jawiki-latest-pages-articles.xml.bz2 -o data/jawiki-latest-pages-articles.xml.bz2
$ wikiextractor --json -o data/wiki_extracted jawiki-latest-pages-articles.xml.bz2
$ python3 scripts/create_wiki_corpus.py -o data/corpus/jawiki.ndjson data/wiki_extracted/**/*
```

### Twitter corpus

```shell-session
$ python3 scripts/create_twitter_corpus.py -o data/corpus/twitter_corvid19.ndjson path/to/twitter/data/*.ndjson
```

### Learning Doc2Vec model

```shell-session
$ python3 scripts/d2v_learn.py --model data/twitter.model --vocabulary-output data/vocabulary.csv data/corpus/*.ndjson
```

### generate json file

```shell-session
$  python3 scripts/create_json.py -m ./data/twitter.model -o public/data.json --corpus=data/corpus/twitter_corvid19.ndjson
```