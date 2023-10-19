const applicationFormMsg = {
  namespace: 'applicationFormMsg',
  state: {
    queryParams: {},
    pageNum:1,
    originOrderExoprtColumm:[],
    professionExoprtColumm:[]
  },
  effects: {},
  reducers: {
    save(state, { payload: { type, dataSource } }) {
      return {
        ...state,
        [type]: dataSource,
      };
    },
  },
};
export default applicationFormMsg;
