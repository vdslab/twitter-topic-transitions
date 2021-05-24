import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  topics: [],
  words: [],
  dailyCount: [],
  topicClusters: [],
  wordClusters: [],
  selectionRadius: 3,
  selectedTopics: [],
  selectedWords: [],
  minWordCount: 1,
  discoverTopic: false,
};
const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    loadData(state, action) {
      return Object.assign({}, initialState, action.payload);
    },
    updateSelectionRadius(state, action) {
      return Object.assign({}, state, { selectionRadius: action.payload });
    },
    selectTopics(state, action) {
      return Object.assign({}, state, { selectedTopics: action.payload });
    },
    updateMinWordCount(state, action) {
      return Object.assign({}, state, { minWordCount: action.payload });
    },
    toggleDiscoverTopic(state) {
      return Object.assign({}, state, { discoverTopic: !state.discoverTopic });
    },
    selectedWords(state, action) {
      return Object.assign({}, state, { selectedWords: action.payload });
    },
    toggleWord(state, action) {
      const word = action.payload;
      const index = state.selectedWords.indexOf(word);
      const selectedWords = Array.from(state.selectedWords);
      if (index < 0) {
        selectedWords.push(word);
      } else {
        selectedWords.splice(index, 1);
      }
      return Object.assign({}, state, { selectedWords });
    },
  },
});

export default slice;
