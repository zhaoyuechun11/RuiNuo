const generalInspectionMag = {
  namespace: 'generalInspectionMag',
  state: {
    singleInstrument: [],
    multiInstrument:[],
    sampleNo:[]
  },
  reducers: {
    save(state, { payload: { type, dataSource } }) {
      return {
        ...state,
        [type]: dataSource,
      };
    },
  },
};
export default generalInspectionMag;
