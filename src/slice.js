import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "app",
  initialState: {
    topics: [],
    words: [],
    topicClusters: [],
    wordClusters: [],
    selectedTopic: null,
    minWordCount: 1,
  },
  reducers: {
    loadData(state, action) {
      return Object.assign({}, state, action.payload);
    },
    selectTopic(state, action) {
      return Object.assign({}, state, { selectedTopic: action.payload });
    },
    updateMinWordCount(state, action) {
      return Object.assign({}, state, { minWordCount: action.payload });
    },
  },
});

export default slice;
