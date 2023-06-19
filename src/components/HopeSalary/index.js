import React, { Component, Fragment } from 'react';
import style from './index.less';
import { Input, Select, message } from 'antd';
const { Option } = Select;
class HopeSalary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      dataSource2: [],

      salary: '',

      salaryArr: ['', ''],
    };
  }
  // 初始化数据
  initData() {
    const dataSource = ['面议'];
    for (let i = 1; i < 30; i++) {
      dataSource.push(i.toString());
    }
    for (let i = 30; i < 100; i = i + 5) {
      dataSource.push(i.toString());
    }
    for (let i = 100; i <= 260; i = i + 10) {
      dataSource.push(i.toString());
    }
    this.setState(
      {
        dataSource,
        dataSource2: dataSource.slice(1, dataSource.length - 1),
      },
      () => {
        this.show();
      },
    );
  }
  // 选择下限
  onChangeDown(value) {
    let { salaryArr, salary, dataSource } = this.state;
    if (value === '面议') {
      salaryArr = ['面议', ''];
      salary = '面议';
      this.setState({
        salaryArr,
        salary,
      });
    } else {
      if (salaryArr[1] && Number(salaryArr[1]) < value) {
        message.destroy();
        message.warning({
          content: '最小薪资不能大于最大薪资',
          // duration: 0
        });
      } else {
        salaryArr[0] = value;
        const formatArr = salaryArr.map((v) => {
          if (v) {
            return v + 'K';
          }
        });
        salary = formatArr.join('-');

        let dataSource2 = JSON.parse(JSON.stringify(dataSource));
        let index = dataSource2.indexOf(value) == -1 ? 0 : dataSource2.indexOf(value);
        dataSource2 = dataSource2.slice(index);
        setTimeout(() => {
          this.setState({
            salaryArr,
            salary,
            dataSource2,
          });
        }, 100);
      }
    }
    this.props.getSalary(salary);
  }
  // 选择上限
  onChangeUp(value) {
    let { salaryArr, salary } = this.state;
    if (value === '面议') {
      salaryArr = ['面议', ''];
      salary = '面议';
      this.setState({
        salaryArr,
        salary,
      });
    } else {
      if (salaryArr[0] && Number(salaryArr[0]) > value) {
        message.destroy();
        message.warning({
          content: '最大薪资不能小于最小薪资',
          // duration: 0
        });
      } else {
        salaryArr[1] = value;
        const formatArr = salaryArr.map((v) => {
          if (v) {
            return v + 'K';
          }
        });
        salary = formatArr.join('-');
        this.setState(
          {
            salaryArr,
            salary,
          },
          () => {
            let { salaryArr, salary } = this.state;
          },
        );
      }
    }
    this.props.getSalary(salary);
  }

  // 清空薪资
  initEmpty = () => {
    this.setState({
      salaryArr: [],
      salary: '',
    });
  };

  componentDidMount() {
    this.props.hopeSalaryRef && this.props.hopeSalaryRef(this);
    this.initData();
    this.show();
  }
  show() {
    const { expect_salary } = this.props;
    let { salary, dataSource } = this.state;
    if (!salary && expect_salary) {
      salary = expect_salary;
      let salaryArr;
      if (expect_salary == '面议') {
        salaryArr = ['面议', ''];
      } else {
        salaryArr = expect_salary.split('-');
        salaryArr = salaryArr.map((v) => v.substring(0, v.length - 1));
      }
      this.setState({
        salaryArr,
        salary,
      });
    }
    if (expect_salary && !this.state.dataSource2.length) {
      let salaryArr;
      salaryArr = expect_salary.split('-');
      salaryArr = salaryArr.map((v) => v.substring(0, v.length - 1));
      let dataSource2 = JSON.parse(JSON.stringify(dataSource));
      let index = dataSource2.indexOf(salaryArr[0]);

      dataSource2 = dataSource2.slice(index, dataSource2.length - 1);
      this.setState({
        dataSource2,
      });
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {
    const { expect_salary, value } = nextProps;
    let { salary, dataSource } = this.state;
    this.setState({ salary: expect_salary });
    if (expect_salary && value) {
      salary = expect_salary;
      let salaryArr;
      if (value == '面议') {
        salaryArr = ['面议', ''];
      } else {
        salaryArr = value.split('-');

        salaryArr = salaryArr.map((v) => v.substring(0, v.length - 1)); //去除掉一位
      }
      this.setState({
        salaryArr,
        salary,
      });
    } else {
      let salaryArr;
      salary = expect_salary;
      if (!salary && value === '面议') {
        this.setState({
          salaryArr: ['面议', ''],
        });
      } else if (!salary && value) {
        salaryArr = value.split('-');
        salaryArr = salaryArr.map((v) => v.substring(0, v.length - 1));
        this.setState({
          salaryArr,
        });
      } else {
        if (salary) {
          salaryArr = salary.split('-');
          salaryArr = salaryArr.map((v) => v.substring(0, v.length - 1));
          this.setState({
            salaryArr,
          });
        } else {
          this.setState({
            salaryArr: ['', ''],
          });
        }
      }
    }
    // if (!salary && expect_salary) {
    //
    //   salary = expect_salary;
    //   let salaryArr;
    //   if (expect_salary == '面议') {
    //     salaryArr = ['面议', ''];
    //   } else {
    //     salaryArr = expect_salary.split('-');
    //     salaryArr = salaryArr.map((v) => v.substring(0, v.length - 1));
    //   }
    //   this.setState({
    //     salaryArr,
    //     salary,
    //   });
    // }
    // if (expect_salary && !this.state.dataSource2.length) {
    //
    //   let { salary, dataSource } = this.state;
    //   salary = expect_salary;
    //   let salaryArr;
    //   salaryArr = expect_salary.split('-');
    //   salaryArr = salaryArr.map((v) => v.substring(0, v.length - 1));
    //   let dataSource2 = JSON.parse(JSON.stringify(dataSource));
    //   let index = dataSource2.indexOf(salaryArr[0]);

    //   dataSource2 = dataSource2.slice(index, dataSource2.length - 1);
    //   this.setState({
    //     dataSource2,
    //     salary,
    //   });
    // }
  }

  render() {
    const { dataSource, dataSource2, salaryArr } = this.state;

    let { width } = this.props;
    return (
      <Input.Group className={this.props.className}>
        <Select
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          style={{ width: width ? width : 120 }}
          value={salaryArr[0] || undefined}
          onChange={this.onChangeDown.bind(this)}
          allowClear
          placeholder="请选择期望薪资"
        >
          {dataSource.map((v) => (
            <Option key={v} value={v} disabled={salaryArr[1] ? v * 1 > salaryArr[1] * 1 : false}>
              {v !== '面议' ? v + 'K' : v}
            </Option>
            //   <Option key={v} value={v} disabled={ salaryArr[1] ? v*1 > salaryArr[1]*1:false}>
            //   {v !== '面议' ? v + '万' : v}
            // </Option>
          ))}
        </Select>
        {(() => {
          if (salaryArr[0] !== '面议') {
            return <span className={style.word}>至</span>;
          }
        })()}
        {(() => {
          if (salaryArr[0] !== '面议') {
            return (
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                style={{ width: width ? width : 120 }}
                value={salaryArr[1] || undefined}
                onChange={this.onChangeUp.bind(this)}
                allowClear
                placeholder="请选择期望薪资"
              >
                {dataSource2.map((v) => (
                  <Option key={v} value={v}>
                    {v !== '面议' ? v + 'K' : v}
                  </Option>
                ))}
              </Select>
            );
          }
        })()}
      </Input.Group>
    );
  }
}

export default HopeSalary;
