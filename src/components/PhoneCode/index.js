import { useEffect, useState } from 'react';
import { Select } from 'antd';

const { Option, OptGroup } = Select;
import { getPhoneCodeAPI } from './server';
export default ({ phoneSign = '086', getPhoneCode, optionStyle }) => {
  const [phoneList, setPhoneList] = useState(undefined);
  useEffect(() => {
    getPhoneCodeAPI().then(res => {
      if (res.status_code == 200) {
        let html = res.data.map(d => (
          <OptGroup
            label={d.name} 
            key={d.name}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {d.res.map(c => (
              <Option
                value={c.code}
                key={d.name + c.area + c.code}
                className="flex_between codeList"
                style={optionStyle}
              >
                <div>{c.area}</div>
                <div>{c.code}</div>
              </Option>
            ))}
          </OptGroup>
        ));
        setPhoneList(html);
      }
    });
  }, []);
  const phoneChange = e => {
    getPhoneCode(e);
  };
  return (
    <Select
      value={phoneSign}
      className="select-before"
      onChange={phoneChange}
      style={{ width: 85 }}
      optionLabelProp="value"
      dropdownMatchSelectWidth={false}
      getPopupContainer={(triggerNode) =>
        triggerNode.parentNode
      }
    >
      {phoneList}
    </Select>
  );
};
