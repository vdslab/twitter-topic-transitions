import argparse
import json
from gensim.models.doc2vec import Doc2Vec


# gen every twi group's vec
def twi_window_collect_vec(model):
    vec_coll = []
    for i in range(1, 226187):
        tag = "tno_"+str(twi_window[twi_window_switch])+"_" + str(i)
        if tag in model.docvecs:
            vec_coll.append(
                {"tno_"+str(twi_window[twi_window_switch]): tag, "vec": model.docvecs[tag].tolist()})

    return vec_coll


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-m', '--model', dest='model', help='model path')
    parser.add_argument('-o', '--output', dest='output', help='output path')
    parser.add_argument('--start', dest='start',
                        default='201912010000', help='start date')
    parser.add_argument('--stop', dest='stop',
                        default='202004010000', help='stop date')
    parser.add_argument('--window', dest='window',
                        default=24 * 7, help='window max', type=int)
    args = parser.parse_args()

    model = Doc2Vec.load(args.model)
    vec_list = twi_window_collect_vec(model)
    json.dump(vec_list, open(args.output, 'w'), ensure_ascii=False)


if __name__ == '__main__':
    main()
