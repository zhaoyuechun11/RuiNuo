import { useEffect, useState, useRef } from 'react';
import { BackButton, Card, Table } from '@components';
import { Pagination, Spin } from 'antd';
import { history, connect } from 'umi';
import ColumnUserInfo from './ColumnUserInfo';
// import { DetailModal } from '@common';

import styles from './index.less';

const SearchResult = ({ global, dispatch }) => {
  const [page, setPage] = useState(
    (global.globalSearchParams && global.globalSearchParams.page) || 1,
  );
  const [page_size, setPage_size] = useState(
    (global.globalSearchParams && global.globalSearchParams.page_size) || 20,
  );
  const list = global.globalSearchList.list || [];
  const lackRef = useRef();

  const detailRef = useRef(); // 候选人详情

  useEffect(() => {
  
  }, []);

  useEffect(() => {
    refresh();
  }, [page, page_size]);







  return (
    <Card classNames={styles.searchResult}>
   
    
     
    </Card>
  );
};

function mapStateToProps({ global }) {
  return { global };
}
export default connect(mapStateToProps)(SearchResult);
