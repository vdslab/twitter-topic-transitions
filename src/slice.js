import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "app",
  initialState: {
    topics: [],
    words: [],
    topicClusters: [],
    wordClusters: [],
    selectionRadius: 3,
    selectedTopics: [],
    minWordCount: 1,
  },
  reducers: {
    loadData(state, action) {
      return Object.assign({}, state, action.payload);
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
  },
});

export default slice;
