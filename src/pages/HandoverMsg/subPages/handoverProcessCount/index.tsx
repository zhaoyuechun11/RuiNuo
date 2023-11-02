import React, { useState } from 'react';
import MixColLine from './components/MixColLine';
import { Form, Input, message, Tabs, Select, Table, DatePicker, Card } from 'antd';
import { Button, Icon } from '@/components';
import { getData } from './helpers';
import { chartsConfig } from './constant';
const { RangePicker } = DatePicker;
const { Option } = Select;
const data = [
  {
    id: 145006545423331962,
    x_field: '\u5b59\u68a6\u6f47',
    count: {
      position:
        '\u6027\u80fd\u6d4b\u8bd5\u4e13\u5bb6,\u6d4b\u8bd5\u804c\u4f4d\u5220\u9664,\u5ba2\u670d\u4e13\u5458,\u5439\u5439\u98ce,\u5220\u9664\u804c\u4f4dA,snx',
      interviewer_name: '\u5b59\u68a6\u6f47',
      shared_count: 7,
      feedback_count: 2,
      pass_count: 0,
      refuse_count: 2,
      feedback_rate: 28.57,
      pass_rate: 0,
      refuse_rate: 28.57,
      avg_feedback_rate: '1.05',
    },
  },
  {
    id: 1121493352101821295,
    x_field: '\u9a6c\u68a6\u6708',
    count: {
      position:
        '\u6570\u5b57\u7269\u6d41Web\u6d4b\u8bd5,lcl_cs_job,Pcc,\u4fdd\u5b89\u4e00\u53f7,\u6d4b\u8bd5\u5de5\u7a0b\u5e08,\u7f8e\u5de5,\u6d4b\u8bd5-22,\u9ad8\u7ea7\u67b6\u6784\u5e08,\u4ea7\u54c1\u7ecf\u7406,SEM\u4e13\u5458(J10003)\u3010\u91cd\u5e86\u3011,\u5185\u63a8\u804c\u4f4dkathy,\u524d\u7aef\u67b6\u6784\u5e08,php,\u4ea7\u54c1\u7ecf\u7406\u3010\u91cd\u5e86\u3011,C\u7aef\u4ea7\u54c1\u7ecf\u7406,\u9500\u552e,\u4f1a\u8ba1\u4e8b\u52a1\u5e08\u603b\u5ba1\u5e08,\u6d4b\u8bd5-k,TTH\u8fd0\u7ef4,\u65e0\u80fd\u72c2\u6012,\u65e9\u6559\u8001\u5e08,\u9ad8\u7ea7/\u8d44\u6df1\u6d4b\u8bd5\u5de5\u7a0b\u5e08,\u6d4b\u8bd5,Java,\u82af\u7247\u9ad8\u7ea7\u5de5\u827a\u5de5\u7a0b\u5e084,\u82af\u7247\u9ad8\u7ea7\u5de5\u827a\u5de5\u7a0b\u5e081,jjj,\u5ba2\u670d\u4e3b\u7ba1',
      interviewer_name: '\u9a6c\u68a6\u6708',
      shared_count: 35,
      feedback_count: 27,
      pass_count: 17,
      refuse_count: 4,
      feedback_rate: 77.140000000000001,
      pass_rate: 48.57,
      refuse_rate: 11.43,
      avg_feedback_rate: '109.12',
    },
  },
  {
    id: 131209301529096624,
    x_field: '\u738b\u5149\u660e',
    count: {
      position:
        "\u7a7a\u4e2d\u4e58\u52a1\u5458/\u7a7a\u59d0/\u7a7a\u5c11,\u9762\u6599\u5f00\u53d1\u3010\u4e0a\u6d77\u3011,12,wwwrttyuui44,kathy's position,\u521a\u597d\u7b26\u5408,\u5927\u7ea2\u8272,\u5ba2\u670d,CEO\u3010\u5317\u4eac\u3011,CEO\u9996\u5e2d\u8fd0\u8425\u5b98\u3010\u5317\u4eac\u3011,\u4f60\u731c\u731c\u8fd9\u662f\u5565,\u7535\u996d\u9505,\u6d4b\u8bd5\u5de5\u7a0b\u5e08,\u767d\u6c99\u6d4b,\u90fd\u8bf4\u5565,Java,\u9500\u552e\u4e2d\u5fc3\u603b\u7ecf\u7406\uff08\u533b\u7f8eCEO\uff09\u3010\u5317\u4eac\u3011,\u4e30\u5bcc\u7684\u4e2a,\u6570\u636e\u4ed3\u5e93\u5de5\u7a0b\u5e08,\u4ea7\u54c1\u7ecf\u7406,php\u5f00\u53d1,\u4ea7\u54c1\u52a9\u7406,qianduan,\u8f6f\u4ef6\u9879\u76ee\u7ecf\u7406\u3010\u91cd\u5e86\u3011,\u6e05\u6d01\u5de5,\u8fd0\u8425\u652f\u6301\u4ea7\u54c1\u5206\u6790,PHP/GO\u7814\u53d1\u5de5\u7a0b\u5e08(\u4e1a\u52a1\u4e2d\u53f0\u4f53\u7cfb),\u524d\u7aef\u5f00\u53d1\u5de5\u7a0b\u5e08,\u804c\u4f4d\u6d4b\u8bd5 \u7fdf\u6653\u5e731,wtt-yj,\u7535\u9500\u4e13\u5458,React\u5de5\u7a0b\u5e08,\u629b\u5149\u5de5\u7a0b\u5e08,PHP,\u8fd0\u7ef4\u5de5\u7a0b\u5e084,\u7f8e\u5de5,\u5ba2\u670d\u4e13\u5458\u3010\u91cd\u3011,123123123,SEM\u4e13\u5458\u3010\u91cd\u5e86\u30112,flutter\u79fb\u52a8\u7aef,TTH\u8fd0\u7ef4,\u98de\u884c\u5458,\u9500\u552e\uff08\u5e7f\u897f\uff09,\u9887\u5177,\u8fc7\u4e2a\u5e74\u54275r5,Manager Web Analytics,Ah\u6d4b\u8bd5\u4e3b\u7ba1,\u6cd5\u5f8b\u4ea7\u54c1\u8fd0\u84251,a\u55f7\u55f7111,\u9ad8A002,\u5408\u540c\u7269\u6d41\u4e1a\u52a1\u53d1\u5c55\u7ecf\u7406  Contract Logistics ,\u548b\u5730\u65b9,\u8d22\u52a1\u7ecf\u7406,\u58eb\u5927\u592b\u53d1\u5c04\u70b9,\u9700\u6c42\u6d4b\u8bd52,\u7a7a\u4e58\u7a7a\u5c11\u7a7a\u4fdd111,flutter\u79fb\u52a8\u7aef\u5f00\u53d1\u5de5\u7a0b\u5e08\u3010\u91cd\u5e86\u3011,\u8c6a\u534e,\u573a\u5730\u7ba1\u7406\u9ad8\u7ea7\u4e1a\u52a1\u4e3b\u7ba1\u5c97\uff08\u6781\u9650\u73af\u5883\u6d4b\u8bd5\u4e2d\u5fc3\uff09,PHP\u57f9\u8bad\u8bb2\u5e08,\u96c0\u7b3c,\u4fdd\u6d01,\u8001\u91d1\u8ba9\u6211\u8bd5\u4e00\u4e0b,\u5c0f\u4e5d\u6d4b\u8bd5\u4e13\u7528,\u5bb6\u5c45\u4e1a\u52a1\u8d1f\u8d23\u4eba(J10058)\u3010\u91cd\u5e86\u3011",
      interviewer_name: '\u738b\u5149\u660e',
      shared_count: 187,
      feedback_count: 72,
      pass_count: 36,
      refuse_count: 17,
      feedback_rate: 38.5,
      pass_rate: 19.25,
      refuse_rate: 9.0899999999999999,
      avg_feedback_rate: '9.23',
    },
  },
  {
    id: '054366216829096624',
    x_field: 'Ken \u738b\u5149\u660e',
    count: {
      position:
        '\u7a7a\u4e2d\u4e58\u52a1\u5458/\u7a7a\u59d0/\u7a7a\u5c11,\u6d4b\u8bd5,\u9762\u8bd5\u8f6e\u6b21\u4e13\u7528\u804c\u4f4d,\u7535\u996d\u9505,\u6d4b\u8bd5\u5de5\u7a0b\u5e08,\u5ba2\u670d,CEO\u3010\u5317\u4eac\u3011,CEO\u9996\u5e2d\u8fd0\u8425\u5b98\u3010\u5317\u4eac\u3011,Java,\u9500\u552e\u4e2d\u5fc3\u603b\u7ecf\u7406\uff08\u533b\u7f8eCEO\uff09\u3010\u5317\u4eac\u3011,\u4f60\u731c\u731c\u8fd9\u662f\u5565,\u4e30\u5bcc\u7684\u4e2a,\u6570\u636e\u4ed3\u5e93\u5de5\u7a0b\u5e08,\u4ea7\u54c1\u7ecf\u7406,php\u5f00\u53d1,PHP/GO\u7814\u53d1\u5de5\u7a0b\u5e08(\u4e1a\u52a1\u4e2d\u53f0\u4f53\u7cfb),\u524d\u7aef\u5f00\u53d1\u5de5\u7a0b\u5e08,\u804c\u4f4d\u6d4b\u8bd5 \u7fdf\u6653\u5e731,wtt-yj,\u7535\u9500\u4e13\u5458,React\u5de5\u7a0b\u5e08,\u629b\u5149\u5de5\u7a0b\u5e08,PHP,flutter\u79fb\u52a8\u7aef,\u98de\u884c\u5458,\u9887\u5177,Manager Web Analytics,\u5408\u540c\u7269\u6d41\u4e1a\u52a1\u53d1\u5c55\u7ecf\u7406  Contract Logistics ,\u548b\u5730\u65b9,\u4f4f\u5bb6\u4fdd\u59c6,\u6025\u554a\u5e08\u5085,\u8d75\u795e\u5668,EQPHP\u57f9\u8bad\u8bb2\u5e081,hg,\u65e0\u80fd\u72c2\u6012',
      interviewer_name: 'Ken \u738b\u5149\u660e',
      shared_count: 51,
      feedback_count: 10,
      pass_count: 6,
      refuse_count: 4,
      feedback_rate: 19.609999999999999,
      pass_rate: 11.76,
      refuse_rate: 7.8399999999999999,
      avg_feedback_rate: '10.46',
    },
  },
  {
    id: '060447185521778466',
    x_field: '\u5434\u8273\u6d01',
    count: {
      position:
        '\u6d4b\u8bd5\u5de5\u7a0b\u5e08,PHP,lcl_cs_job,\u65b0\u7684\u5c97\u4f4d,\u6d4b\u8bd5\u5f00\u53d1,\u6d4b\u8bd5,\u5434\u8273\u6d01\u5de5\u4f5c\u53f0\u521b\u5efa\u5c97\u4f4d,\u4ea7\u54c1\u52a9\u7406,\u804c\u4f4d\u5408\u5e76,\u5ba2\u670d\u4e13\u5458,\u6d4b\u8bd5-11,22\u7b49\u7b49\u7b49,\u7a7a\u4e2d\u4e58\u52a1\u5458/\u7a7a\u59d0/\u7a7a\u5c11,WEB\u524d\u7aef\u5de5\u7a0b\u5e08,wwwrttyuui44,\u5ba2\u670d\u4e3b\u7ba1,\u603b\u88c1\u52a9\u7406/\u603b\u7ecf\u7406\u52a9\u7406         \u7ecf\u7406\u52a9\u7406/\u79d8\u4e66 \u529e\u4e8b\u5904,\u5927\u7ea2\u8272,\u4f60\u731c\u731c\u8fd9\u662f\u5565,APP\u63a8\u5e7f,wtt-yj,SEM\u4e13\u5458(J10003)\u3010\u91cd\u5e86\u3011,\u524d\u7aef\u67b6\u6784\u5e08,\u6d4b\u8bd5\u804c\u4f4d\u9762\u8bd5,Python,\u4ea7\u54c1\u7b56\u7565\u7ecf\u7406,\u65e0\u80fd\u72c2\u6012,\u9ad8\u7ea7/\u8d44\u6df1\u6d4b\u8bd5\u5de5\u7a0b\u5e08,Java,\u5408\u540c\u7269\u6d41\u4e1a\u52a1\u53d1\u5c55\u7ecf\u7406  Contract Logistics ,\u82af\u7247\u9ad8\u7ea7\u5de5\u827a\u5de5\u7a0b\u5e084,\u9700\u6c42\u6d4b\u8bd52,wt,\u552e\u524d\u4ea7\u54c1\u652f\u6301\u7ecf\u7406,\u524d\u7aef\u5f00\u53d1,\u7ea2\u85af,\u4e0b\u4e00,\u8c6a\u534e',
      interviewer_name: '\u5434\u8273\u6d01',
      shared_count: 50,
      feedback_count: 22,
      pass_count: 12,
      refuse_count: 8,
      feedback_rate: 44,
      pass_rate: 24,
      refuse_rate: 16,
      avg_feedback_rate: '0.22',
    },
  },
  {
    id: '062865503437892840',
    x_field: '\u9648\u7075\u7075',
    count: {
      position:
        '\u6d4b\u8bd5\u5de5\u7a0b\u5e08,PHP,lcl_cs_job,\u65b0\u7684\u5c97\u4f4d,\u6d4b\u8bd5\u5f00\u53d1,\u5434\u8273\u6d01\u5de5\u4f5c\u53f0\u521b\u5efa\u5c97\u4f4d,\u4ea7\u54c1\u52a9\u7406,\u5ba2\u670d\u4e13\u5458,22\u7b49\u7b49\u7b49,\u6d4b\u8bd5,\u6d4b\u8bd5\u7ecf\u7406(\u4e13\u5bb6)',
      interviewer_name: '\u9648\u7075\u7075',
      shared_count: 12,
      feedback_count: 2,
      pass_count: 1,
      refuse_count: 0,
      feedback_rate: 16.670000000000002,
      pass_rate: 8.3300000000000001,
      refuse_rate: 0,
      avg_feedback_rate: '1.89',
    },
  },
  {
    id: 1755645020999701,
    x_field: '\u7b71\u4e66',
    count: {
      position: '\u6d4b\u8bd5\u5de5\u7a0b\u5e08,PHP,lcl_cs_job,\u6d4b\u8bd5\u5f00\u53d1',
      interviewer_name: '\u7b71\u4e66',
      shared_count: 4,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: '010468461120243427',
    x_field: '\u5c0f\u660e',
    count: {
      position:
        '\u6d4b\u8bd5\u5de5\u7a0b\u5e08,\u7f8e\u5de5,php\u5de5\u7a0b\u5e08,\u4ea7\u54c1\u7ecf\u7406,\u6d4b\u8bd5,\u6d4b\u8bd5\u5c0f\u7a0b\u5e8f,\u7269\u63a7\u5de5\u7a0b\u5e08',
      interviewer_name: '\u5c0f\u660e',
      shared_count: 8,
      feedback_count: 5,
      pass_count: 1,
      refuse_count: 4,
      feedback_rate: 62.5,
      pass_rate: 12.5,
      refuse_rate: 50,
      avg_feedback_rate: '0.01',
    },
  },
  {
    id: '086363492924997351',
    x_field: '\u6234\u660e\u6d01',
    count: {
      position:
        '\u6d4b\u8bd5\u5de5\u7a0b\u5e08,\u9ad8\u7ea7web\u5b89\u5168\u5de5\u7a0b\u5e08,\u4e92\u8054\u7f51\u91d1\u878d,\u524d\u7aef\u5f00\u53d1\u5de5\u7a0b\u5e08,\u7a7a\u4e2d\u4e58\u52a1\u5458/\u7a7a\u59d0/\u7a7a\u5c11,\u89c6\u89c9\u8bbe\u8ba1\u5e08\uff08UI\uff09,\u884c\u653f\u52a9\u7406\u8ddf\u5355,\u98d2\u98d2\u5927,\u767d\u6c99\u6d4b,\u90fd\u8bf4\u5565,\u7ed9\u5bf9\u65b9\u7ed9\u623f\u8d37,\u963f\u65af\u987f,\u5408\u540c\u7269\u6d41\u4e1a\u52a1\u53d1\u5c55\u7ecf\u7406  Contract Logistics ',
      interviewer_name: '\u6234\u660e\u6d01',
      shared_count: 22,
      feedback_count: 10,
      pass_count: 7,
      refuse_count: 1,
      feedback_rate: 45.450000000000003,
      pass_rate: 31.82,
      refuse_rate: 4.5499999999999998,
      avg_feedback_rate: '0.59',
    },
  },
  {
    id: '01183928660823849134',
    x_field: '\u5c39\u8fb0\u5065',
    count: {
      position:
        '\u5ea7\u6905\u5b9e\u9a8c\u5de5\u7a0b\u5e08,\u629b\u5149\u5de5\u7a0b\u5e08,\u81ea\u52a8\u9a7e\u9a76\u8f66\u8f86\u6d4b\u8bd5\u5de5\u7a0b\u5e08,\u5434\u8273\u6d01\u5de5\u4f5c\u53f0\u521b\u5efa\u5c97\u4f4d,\u4ea7\u54c1\u52a9\u7406,\u5ba2\u670d\u4e13\u5458,22\u7b49\u7b49\u7b49,\u9500\u552e\u7ecf\u74061,\u7ed9\u5bf9\u65b9\u7ed9\u623f\u8d37,\u9762\u8bd5\u8f6e\u6b21\u4e13\u7528\u804c\u4f4d,\u6570\u636e\u4ed3\u5e93\u5de5\u7a0b\u5e08,wtt-yj,\u5ba2\u670d\u603b\u76d1',
      interviewer_name: '\u5c39\u8fb0\u5065',
      shared_count: 20,
      feedback_count: 7,
      pass_count: 5,
      refuse_count: 2,
      feedback_rate: 35,
      pass_rate: 25,
      refuse_rate: 10,
      avg_feedback_rate: '3.75',
    },
  },
  {
    id: '084728412630261491',
    x_field: '\u77f3\u5c0f\u53ef',
    count: {
      position:
        '\u5ba2\u670d\u52a9\u7406,\u6d4b\u8bd5,\u554a\u554a\u554a\u554a,\u6d4b\u8bd5-11,dada,hYna,\u6d4b\u8bd5\u5f00\u53d1,123\u6d4b\u8bd5,\u8be6\u7ec6\u5730\u5740:\u6768\u6d66\u533a,\u7ed9\u5bf9\u65b9\u7ed9\u623f\u8d37,134,123\u53ef\u522b,PHP,\u4ea7\u54c1\u52a9\u7406,\u4f53\u9a8c\u5458,\u56fe\u7247 test,\u6df1\u5ea6\u5b66\u4e60\u7b97\u6cd5\u5de5\u7a0b\u5e08,CEO\uff08\u5feb\u6d88\u3001\u7535\u5546\u3001\u98df\u54c1\u3001\u4fdd\u5065\u884c\u4e1a\u80cc\u666f\uff09\u3010\u4e0a\u6d77\u3011',
      interviewer_name: '\u77f3\u5c0f\u53ef',
      shared_count: 37,
      feedback_count: 17,
      pass_count: 17,
      refuse_count: 0,
      feedback_rate: 45.950000000000003,
      pass_rate: 45.950000000000003,
      refuse_rate: 0,
      avg_feedback_rate: '31.19',
    },
  },
  {
    id: '01115403474526054575',
    x_field: 'ken \u674e\u4e00\u51e1',
    count: {
      position:
        '\u6d4b\u8bd5,\u5439\u5439\u98ce,\u7279\u8272\u53a8\u5e08,\u897f\u53a8\u53a8\u5e08,\u98de\u884c\u5458\u4e00\u53f7,\u6027\u80fd\u6d4b\u8bd5\u4e13\u5bb6,PHP\u57f9\u8bad\u8bb2\u5e08,\u8f66\u7ad9\u98de\u673a\u573a\u5730\u94c1\u7ad9\u9a7e\u9a76\u5458\u5546\u52a1\u53f8\u673a\u3010\u4e0a\u6d77\u3011,\u91cd\u4e2d\u4e4b\u91cd,\u53a8\u5e08 \u53a8\u5de5\u3010\u5317\u4eac\u3011,\u730e\u5934--\u98de\u884c\u5458,\u98d2\u98d2\u5927,\u6253\u91ce,\u98de\u673a\u573a\u706b\u8f66\u7ad9\u63a5\u9001\u5546\u52a1\u53f8\u673a\u5305\u4f4f\u3010\u4e0a\u6d77\u3011,\u767d\u6c99\u6d4b,\u90fd\u8bf4\u5565',
      interviewer_name: 'ken \u674e\u4e00\u51e1',
      shared_count: 23,
      feedback_count: 8,
      pass_count: 8,
      refuse_count: 0,
      feedback_rate: 34.780000000000001,
      pass_rate: 34.780000000000001,
      refuse_rate: 0,
      avg_feedback_rate: '0.07',
    },
  },
  {
    id: 193300616824047613,
    x_field: '\u5f20\u4e3a\u5fd7',
    count: {
      position: '\u7279\u8272\u53a8\u5e08,php\u5de5\u7a0b\u5e08',
      interviewer_name: '\u5f20\u4e3a\u5fd7',
      shared_count: 2,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: '042144364232082282',
    x_field: '\u7f57\u5bcc\u661f',
    count: {
      position: 'PHP',
      interviewer_name: '\u7f57\u5bcc\u661f',
      shared_count: 1,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: '27022843372102615945',
    x_field: 'Allen \u59da\u5e05\u78ca',
    count: {
      position:
        '\u6d4b\u8bd5,\u6768\u6811\u6797\u6d4b\u8bd5,\u521a\u597d\u7b26\u5408,\u767d\u6c99\u6d4b,\u90fd\u8bf4\u5565',
      interviewer_name: 'Allen \u59da\u5e05\u78ca',
      shared_count: 8,
      feedback_count: 4,
      pass_count: 3,
      refuse_count: 1,
      feedback_rate: 50,
      pass_rate: 37.5,
      refuse_rate: 12.5,
      avg_feedback_rate: '0.01',
    },
  },
  {
    id: 263964061247550,
    x_field: '\u98ce\u884c',
    count: {
      position:
        '\u5439\u5439\u98ce,\u98de\u884c\u5458\u4e8c\u53f7,\u9762\u5305\u5e08,\u6d4b\u8bd5\u5f00\u53d1\u3010\u6d77\u6dc0\u533a\u3011,\u5ba2\u670d\u4e13\u5458,\u804c\u4f4d\u9080\u8bf7-\u540c\u610f,\u6837\u8863\u5de5\u52a9\u7406/\u4e13\u5458\u3010\u4e1c\u57ce\u533a\u3011,\u53a8\u5e08 \u53a8\u5de5\u3010\u5317\u4eac\u3011,\u91cd\u4e2d\u4e4b\u91cd,\u6d4b\u8bd5\u804c\u4f4d\u534f\u4f5c\u80052,\u4ea7\u54c1\u7ecf\u7406,\u6d4b\u8bd5\u5de5\u7a0b\u5e08,\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u3010\u91cd\u5e86\u3011,\u6d4b\u8bd51111,\u6d4b\u8bd5\u804c\u4f4d,\u5ba2\u670d\u4e13\u5458\u3010\u4e0a\u6d77\u3011,\u7a7a/\u7a7a\u5c11,\u5f00\u53d1,\u7a7a\u4e58\u7a7a\u5c11\u7a7a\u4fdd111,\u9ad8\u7ea7\u7ba1\u7406\u804c\u4f4d,\u4ed3\u5e93\u7ba1\u7406\u54582,Java,\u6d4b\u8bd5,EQPHP\u57f9\u8bad\u8bb2\u5e081,\u4f4f\u5bb6\u4fdd\u59c6,\u9ad8\u7ea7\u6d77\u5916\u8fd0\u8425\uff08\u6e38\u620f\uff09\u3010\u5929\u6cb3\u533a\u3011',
      interviewer_name: '\u98ce\u884c',
      shared_count: 52,
      feedback_count: 14,
      pass_count: 10,
      refuse_count: 4,
      feedback_rate: 26.920000000000002,
      pass_rate: 19.23,
      refuse_rate: 7.6900000000000004,
      avg_feedback_rate: '10.42',
    },
  },
  {
    id: 594839263626166144,
    x_field: '\u674e\u5c0f\u51e1',
    count: {
      position:
        '\u6d4b\u8bd5-22,\u65a4\u65a4\u8ba1\u8f83,\u591a\u5c11\u554a,\u629b\u5149\u5de5\u7a0b\u5e08,\u91cd\u4e2d\u4e4b\u91cd,\u53a8\u5e08 \u53a8\u5de5\u3010\u5317\u4eac\u3011,\u738b\u724c\u98de\u884c\u5458,PHP,\u98d2\u98d2\u5927',
      interviewer_name: '\u674e\u5c0f\u51e1',
      shared_count: 24,
      feedback_count: 4,
      pass_count: 3,
      refuse_count: 1,
      feedback_rate: 16.670000000000002,
      pass_rate: 12.5,
      refuse_rate: 4.1699999999999999,
      avg_feedback_rate: '0.03',
    },
  },
  {
    id: '03441944231214397',
    x_field: '\u9676\u4f73',
    count: {
      position:
        '\u91cd\u4e2d\u4e4b\u91cd,\u730e\u5934--\u98de\u884c\u5458,\u6d4b\u8bd5,\u5ba2\u670d\u603b\u76d1,UI\u8bbe\u8ba1\u5e08,\u8bbe\u8ba1',
      interviewer_name: '\u9676\u4f73',
      shared_count: 7,
      feedback_count: 4,
      pass_count: 2,
      refuse_count: 1,
      feedback_rate: 57.140000000000001,
      pass_rate: 28.57,
      refuse_rate: 14.289999999999999,
      avg_feedback_rate: '77.03',
    },
  },
  {
    id: 21224721361136112,
    x_field: '\u8c46\u5976',
    count: {
      position:
        '\u53a8\u5e08 \u53a8\u5de5\u3010\u5317\u4eac\u3011,\u4ea7\u54c1VP,\u6768\u6811\u6797\u6d4b\u8bd5,\u767d\u6c99\u6d4b,\u90fd\u8bf4\u5565',
      interviewer_name: '\u8c46\u5976',
      shared_count: 8,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: 1315515827645664,
    x_field: '\u4e54\u5df4',
    count: {
      position:
        '\u603b\u88c1\u52a9\u7406/\u603b\u7ecf\u7406\u52a9\u7406         \u7ecf\u7406\u52a9\u7406/\u79d8\u4e66 \u529e\u4e8b\u5904,\u6d4b\u8bd5\u5185\u8d38,\u738b\u4f01\u9e45\u65e0\u7fa4\u6076\u8da3\u5473\u800c\u6211\u5374\u6076\u8da3\u5473\u800c\u6211\u5374\u4eba\u60f9\u6211\u60f9\u6211\u8ba4\u4e3a\u60f9\u6211\u60f9\u6211\u73a9\u513f\u4e8c,WEB\u524d\u7aef\u5de5\u7a0b\u5e08,\u671d\u9633\u5267\u573a,\u98d2\u98d2\u5927,\u5468\u9ed1\u9e2d\u5e97\u957f,\u4ea7\u54c1VP,\u4f60\u731c\u731c\u8fd9\u662f\u5565,abc,89898989,\u5ba2\u670d\u4e3b\u7ba1,\u9762\u8bd5\u8f6e\u6b21\u4e13\u7528\u804c\u4f4d,dsaddd,\u767d\u6c99\u6d4b,\u90fd\u8bf4\u5565',
      interviewer_name: '\u4e54\u5df4',
      shared_count: 20,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: 2256623264691456,
    x_field: '\u5468\u5468',
    count: {
      position: 'PHP,\u9762\u8bd5\u8f6e\u6b21\u4e13\u7528\u804c\u4f4d',
      interviewer_name: '\u5468\u5468',
      shared_count: 2,
      feedback_count: 1,
      pass_count: 1,
      refuse_count: 0,
      feedback_rate: 50,
      pass_rate: 50,
      refuse_rate: 0,
      avg_feedback_rate: '0.03',
    },
  },
  {
    id: 2154122712767650,
    x_field: '\u5c0f\u90d1',
    count: {
      position:
        'PHP,CEO\u3010\u5317\u4eac\u3011,\u5d4c\u5165\u5f0f\u786c\u4ef6\u5de5\u7a0b\u5e08-DTU,HRB1,4.5.3\u4e13\u7528\u6d4b\u8bd5\u804c\u4f4d,123123123',
      interviewer_name: '\u5c0f\u90d1',
      shared_count: 6,
      feedback_count: 3,
      pass_count: 3,
      refuse_count: 0,
      feedback_rate: 50,
      pass_rate: 50,
      refuse_rate: 0,
      avg_feedback_rate: '0.23',
    },
  },
  {
    id: '0153651325736128',
    x_field: '\u59dc\u59dc',
    count: {
      position:
        '\u6d4b\u8bd5\u5c97\u4f4d,PHP\u3010\u5317\u4eac\u30111,\u6d4b\u8bd5,\u629b\u5149\u5de5\u7a0b\u5e08,\u4ea7\u54c1\u7ecf\u7406,NPI\u5de5\u7a0b\u5e08,\u4f60\u731c\u731c\u8fd9\u662f\u5565,\u9762\u8bd5\u8f6e\u6b21\u4e13\u7528\u804c\u4f4d,CEO\u9996\u5e2d\u8fd0\u8425\u5b98\u3010\u5317\u4eac\u3011',
      interviewer_name: '\u59dc\u59dc',
      shared_count: 15,
      feedback_count: 1,
      pass_count: 1,
      refuse_count: 0,
      feedback_rate: 6.6699999999999999,
      pass_rate: 6.6699999999999999,
      refuse_rate: 0,
      avg_feedback_rate: '0.03',
    },
  },
  {
    id: 16172846369076751,
    x_field: '\u738b\u5149\u660e\u6d4b\u8bd5\u8d26\u53f7',
    count: {
      position: '\u98d2\u98d2\u5927',
      interviewer_name: '\u738b\u5149\u660e\u6d4b\u8bd5\u8d26\u53f7',
      shared_count: 1,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: 241668285132294559,
    x_field: '\u7fdf\u6653\u5e73',
    count: {
      position:
        '\u5ba2\u670d\u4e3b\u7ba1,\u81ea\u5b9a\u4e49choo4,\u4ea7\u54c1\u52a9\u7406,\u9887\u5177,\u6d4b\u8bd5\u5de5\u7a0b\u5e08',
      interviewer_name: '\u7fdf\u6653\u5e73',
      shared_count: 7,
      feedback_count: 2,
      pass_count: 2,
      refuse_count: 0,
      feedback_rate: 28.57,
      pass_rate: 28.57,
      refuse_rate: 0,
      avg_feedback_rate: '0.03',
    },
  },
  {
    id: '035904511435644498',
    x_field: '\u8d75\u6708\u6625',
    count: {
      position:
        'kathy\u6d4b\u8bd5\u5c97,\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u3010\u91cd\u5e86\u3011,\u5ba2\u670d\u603b\u76d1,\u524d\u7aef\u5f00\u53d1,PHP,Python,php\u5927\u4f6c,123123123,HC,\u9500\u552e\uff08\u5e7f\u897f\uff09,IT\u7cfb\u7edf\u96c6\u6210\u9500\u552e\u7ecf\u7406@,\u6d4b\u8bd5\u804c\u4f4d101,\u653e\u725b\u5a03,\u9879\u76ee\u4e3b\u7ba1\uff08\u9879\u76ee\u8001\u5e08\u4e3b\u7ba1\uff09,sdf,Ah\u6d4b\u8bd5\u4e3b\u7ba1,\u6cd5\u5f8b\u4ea7\u54c1\u8fd0\u84251,\u548b\u5730\u65b9,\u5408\u540c\u7269\u6d41\u4e1a\u52a1\u53d1\u5c55\u7ecf\u7406  Contract Logistics ,\u7ea2\u85af,Manager Web Analytics',
      interviewer_name: '\u8d75\u6708\u6625',
      shared_count: 33,
      feedback_count: 24,
      pass_count: 23,
      refuse_count: 1,
      feedback_rate: 72.730000000000004,
      pass_rate: 69.700000000000003,
      refuse_rate: 3.0299999999999998,
      avg_feedback_rate: '3.76',
    },
  },
  {
    id: 142937455920927918,
    x_field: '\u5218\u57f9\u826f',
    count: {
      position: 'CEO\u3010\u5317\u4eac\u3011',
      interviewer_name: '\u5218\u57f9\u826f',
      shared_count: 1,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: 1215585657729594,
    x_field: '\u590f\u5929',
    count: {
      position: '\u4f60\u731c\u731c\u8fd9\u662f\u5565,123123123',
      interviewer_name: '\u590f\u5929',
      shared_count: 2,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: 212536155426769365,
    x_field: '\u6881\u82f1\u5065',
    count: {
      position:
        '\u9762\u8bd5\u8f6e\u6b21\u4e13\u7528\u804c\u4f4d,\u8fd0\u8425\u652f\u6301\u4ea7\u54c1\u5206\u6790',
      interviewer_name: '\u6881\u82f1\u5065',
      shared_count: 2,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: '02251209324629096624',
    x_field: '\u5927\u5149\u660e',
    count: {
      position:
        '\u4e30\u5bcc\u7684\u4e2a,\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u3010\u91cd\u5e86\u3011,\u804c\u4f4d\u6d4b\u8bd5 \u7fdf\u6653\u5e731,\u996e\u6599\u4ea7\u54c1\u7ecf\u7406\u3010\u4e0a\u6d77\u3011,\u5b89\u88c5\u5de5\u7a0b\u5e08,\u8d44\u8d28\u4e13\u5458\u3010\u6d4e\u5357\u3011,\u9500\u552e\u7ecf\u7406,\u524d\u7aef\u5f00\u53d1,2,\u5c0f\u4e5d\u6d4b\u8bd5\u4e13\u7528,PHP\u57f9\u8bad\u8bb2\u5e08,\u96c0\u7b3c,\u573a\u5730\u7ba1\u7406\u9ad8\u7ea7\u4e1a\u52a1\u4e3b\u7ba1\u5c97\uff08\u6781\u9650\u73af\u5883\u6d4b\u8bd5\u4e2d\u5fc3\uff09',
      interviewer_name: '\u5927\u5149\u660e',
      shared_count: 18,
      feedback_count: 4,
      pass_count: 4,
      refuse_count: 0,
      feedback_rate: 22.219999999999999,
      pass_rate: 22.219999999999999,
      refuse_rate: 0,
      avg_feedback_rate: '1.34',
    },
  },
  {
    id: '02251230636526135953',
    x_field: '\u5b87\u5947',
    count: {
      position:
        '\u4e30\u5bcc\u7684\u4e2a,\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u3010\u91cd\u5e86\u3011,\u804c\u4f4d\u6d4b\u8bd5 \u7fdf\u6653\u5e731,\u996e\u6599\u4ea7\u54c1\u7ecf\u7406\u3010\u4e0a\u6d77\u3011,\u5b89\u88c5\u5de5\u7a0b\u5e08,\u8d44\u8d28\u4e13\u5458\u3010\u6d4e\u5357\u3011,\u9500\u552e\u7ecf\u7406,\u524d\u7aef\u5f00\u53d1,\u4fdd\u6d01',
      interviewer_name: '\u5b87\u5947',
      shared_count: 12,
      feedback_count: 2,
      pass_count: 2,
      refuse_count: 0,
      feedback_rate: 16.670000000000002,
      pass_rate: 16.670000000000002,
      refuse_rate: 0,
      avg_feedback_rate: '1.54',
    },
  },
  {
    id: '022512306365749216',
    x_field: '\u5b87\u5947',
    count: {
      position:
        '\u4e30\u5bcc\u7684\u4e2a,\u8fd0\u7ef4\u5de5\u7a0b\u5e084,\u6d4b\u8bd5\u5de5\u7a0b\u5e08,\u963f\u65af\u987f,\u58eb\u5927\u592b\u53d1\u5c04\u70b9,\u96c0\u7b3c',
      interviewer_name: '\u5b87\u5947',
      shared_count: 19,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: '01266934374136905456',
    x_field: '\u91d1\u7ecd\u658c',
    count: {
      position: '\u6d4b\u8bd5\u5de5\u7a0b\u5e08,\u9ad8A002,\u4f4f\u5bb6\u4fdd\u59c6',
      interviewer_name: '\u91d1\u7ecd\u658c',
      shared_count: 3,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: 185941330826135953,
    x_field: '\u6731\u5b87\u5947',
    count: {
      position:
        '\u9500\u552e\u603b\u76d1,\u7a7a\u4e58\u7a7a\u5c11\u7a7a\u4fdd111,\u8bbe\u8ba1,\u524d\u7aefttt',
      interviewer_name: '\u6731\u5b87\u5947',
      shared_count: 4,
      feedback_count: 1,
      pass_count: 1,
      refuse_count: 0,
      feedback_rate: 25,
      pass_rate: 25,
      refuse_rate: 0,
      avg_feedback_rate: '1.61',
    },
  },
  {
    id: 232538324436391373,
    x_field: '\u90ed\u5a01\u5a01',
    count: {
      position:
        '\u81ea\u5b9a\u4e49choo4,SEM\u4e13\u5458(J10003)\u3010\u91cd\u5e86\u3011,wtt-yj,\u6e05\u6d01\u5de5,\u6d4b\u8bd5\u5927\u4f6c',
      interviewer_name: '\u90ed\u5a01\u5a01',
      shared_count: 6,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: '0634203169768702',
    x_field: '\u5c0f\u94ed',
    count: {
      position: '\u8fd0\u7ef4\u5de5\u7a0b\u5e08\u3010\u91cd\u5e86\u3011',
      interviewer_name: '\u5c0f\u94ed',
      shared_count: 2,
      feedback_count: 2,
      pass_count: 1,
      refuse_count: 1,
      feedback_rate: 100,
      pass_rate: 50,
      refuse_rate: 50,
      avg_feedback_rate: '0.01',
    },
  },
  {
    id: '011038294949100526',
    x_field: 'elu',
    count: {
      position:
        'React\u5de5\u7a0b\u5e08,\u81ea\u5b9a\u4e49choo4,\u524d\u7aef\u5f00\u53d1,\u4ea7\u54c1\u7ecf\u7406\u3010\u4e0a\u6d77\u3011,\u5408\u540c\u7269\u6d41\u4e1a\u52a1\u53d1\u5c55\u7ecf\u7406  Contract Logistics ,EQPHP\u57f9\u8bad\u8bb2\u5e081',
      interviewer_name: 'elu',
      shared_count: 6,
      feedback_count: 4,
      pass_count: 3,
      refuse_count: 1,
      feedback_rate: 66.670000000000002,
      pass_rate: 50,
      refuse_rate: 16.670000000000002,
      avg_feedback_rate: '0.07',
    },
  },
  {
    id: '05436621681655764328',
    x_field: 'Aellon \u5149\u660e\u4f7f\u8005',
    count: {
      position: '\u9ad8\u7ea7\u7ba1\u7406\u804c\u4f4d,\u6d4b\u8bd5\u5c97\u4f4d',
      interviewer_name: 'Aellon \u5149\u660e\u4f7f\u8005',
      shared_count: 2,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: '01081141606633398423',
    x_field: '\u845b\u6674\u5cf0',
    count: {
      position:
        '\u5ba2\u6237\u5c0f\u59d0\u59d0,php\u5927\u4f6c,Java,\u82af\u7247\u9ad8\u7ea7\u5de5\u827a\u5de5\u7a0b\u5e084',
      interviewer_name: '\u845b\u6674\u5cf0',
      shared_count: 5,
      feedback_count: 4,
      pass_count: 1,
      refuse_count: 3,
      feedback_rate: 80,
      pass_rate: 20,
      refuse_rate: 60,
      avg_feedback_rate: '12.43',
    },
  },
  {
    id: '02251209324622604108',
    x_field: '\u5927\u5149\u660e',
    count: {
      position: '\u7f8e\u5de5,\u9700\u6c42\u6d4b\u8bd52,\u4fdd\u6d01',
      interviewer_name: '\u5927\u5149\u660e',
      shared_count: 3,
      feedback_count: 3,
      pass_count: 2,
      refuse_count: 1,
      feedback_rate: 100,
      pass_rate: 66.670000000000002,
      refuse_rate: 33.329999999999998,
      avg_feedback_rate: '0.01',
    },
  },
  {
    id: 233705026963353322,
    x_field: 'Allen',
    count: {
      position: '\u4ea7\u54c1\u7ecf\u7406\u3010\u4e0a\u6d77\u3011',
      interviewer_name: 'Allen',
      shared_count: 1,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: 1215594700845789,
    x_field: '\u6731\u68ee',
    count: {
      position: '\u7537\u58eb\u7ef4\u751f\u7d20\uff08\u9500\u552e\u5458\uff09,\u9002\u6d4b2205',
      interviewer_name: '\u6731\u68ee',
      shared_count: 3,
      feedback_count: 3,
      pass_count: 3,
      refuse_count: 0,
      feedback_rate: 100,
      pass_rate: 100,
      refuse_rate: 0,
      avg_feedback_rate: '0.02',
    },
  },
  {
    id: 102645202538185786,
    x_field: '\u987e\u4f73\u9b4f',
    count: {
      position:
        '\u7537\u58eb\u7ef4\u751f\u7d20\uff08\u9500\u552e\u5458\uff09,\u5c0f\u987e\u6d4b\u8bd5\u5c97\u4f4d,\u9887\u5177,\u573a\u5730\u7ba1\u7406\u9ad8\u7ea7\u4e1a\u52a1\u4e3b\u7ba1\u5c97\uff08\u6781\u9650\u73af\u5883\u6d4b\u8bd5\u4e2d\u5fc3\uff09,\u5bb6\u5c45\u4e1a\u52a1\u8d1f\u8d23\u4eba(J10058)\u3010\u91cd\u5e86\u3011',
      interviewer_name: '\u987e\u4f73\u9b4f',
      shared_count: 8,
      feedback_count: 6,
      pass_count: 3,
      refuse_count: 3,
      feedback_rate: 75,
      pass_rate: 37.5,
      refuse_rate: 37.5,
      avg_feedback_rate: '0.08',
    },
  },
  {
    id: '035453314821501266',
    x_field: '\u5e08\u592a',
    count: {
      position: '123123123',
      interviewer_name: '\u5e08\u592a',
      shared_count: 1,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: 16069627165949767,
    x_field: '\u9ad8\u626c\u626c',
    count: {
      position: '123123123,\u82af\u7247\u9ad8\u7ea7\u5de5\u827a\u5de5\u7a0b\u5e084',
      interviewer_name: '\u9ad8\u626c\u626c',
      shared_count: 2,
      feedback_count: 1,
      pass_count: 0,
      refuse_count: 1,
      feedback_rate: 50,
      pass_rate: 0,
      refuse_rate: 50,
      avg_feedback_rate: '23.26',
    },
  },
  {
    id: 1627369230598174,
    x_field: '\u5468\u52a0\u745c',
    count: {
      position: '123123123',
      interviewer_name: '\u5468\u52a0\u745c',
      shared_count: 1,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: 'manager4794',
    x_field: '\u8c22\u4f73\u5065',
    count: {
      position: '123123123',
      interviewer_name: '\u8c22\u4f73\u5065',
      shared_count: 1,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: 16315290879132196,
    x_field: 'aaa',
    count: {
      position: '\u5408\u540c\u7269\u6d41\u4e1a\u52a1\u53d1\u5c55\u7ecf\u7406  Contract Logistics ',
      interviewer_name: 'aaa',
      shared_count: 1,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: 225362015426038262,
    x_field: '\u6731\u4f69\u534e',
    count: {
      position: '\u548b\u5730\u65b9',
      interviewer_name: '\u6731\u4f69\u534e',
      shared_count: 1,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: '091309392024137377',
    x_field: '\u5f20\u5929\u6b8a',
    count: {
      position: '\u5408\u540c\u7269\u6d41\u4e1a\u52a1\u53d1\u5c55\u7ecf\u7406  Contract Logistics ',
      interviewer_name: '\u5f20\u5929\u6b8a',
      shared_count: 1,
      feedback_count: 1,
      pass_count: 1,
      refuse_count: 0,
      feedback_rate: 100,
      pass_rate: 100,
      refuse_rate: 0,
      avg_feedback_rate: '1.64',
    },
  },
  {
    id: 270341455529159595,
    x_field: '\u73ed\u4e1c\u4e9a',
    count: {
      position: '\u65e0\u80fd\u72c2\u6012,EQPHP\u57f9\u8bad\u8bb2\u5e081',
      interviewer_name: '\u73ed\u4e1c\u4e9a',
      shared_count: 2,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: 'wofk-XCwAASLKrDCvH8ghNyY500ERLmQ',
    x_field: 'wofk-XCwAASLKrDCvH8ghNyY500ERLmQ',
    count: {
      position:
        '\u65b0\u51a0\u80ba\u708e\u68c0\u6d4b\u8bd5\u5242\u76d2\u5546\u52a1\u6280\u672f\u5de5\u7a0b\u5e08',
      interviewer_name: 'wofk-XCwAASLKrDCvH8ghNyY500ERLmQ',
      shared_count: 1,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: '\u738b\u5149\u660e',
    x_field: '\u738b\u5149\u660e',
    count: {
      position: '\u9700\u6c42\u6d4b\u8bd52,\u6d4b\u8bd5',
      interviewer_name: '\u738b\u5149\u660e',
      shared_count: 2,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: '\u98ce\u884c',
    x_field: '\u98ce\u884c',
    count: {
      position: 'katherine',
      interviewer_name: '\u98ce\u884c',
      shared_count: 1,
      feedback_count: 0,
      pass_count: 0,
      refuse_count: 0,
      feedback_rate: 0,
      pass_rate: 0,
      refuse_rate: 0,
      avg_feedback_rate: 0,
    },
  },
  {
    id: '0224575410061180991',
    x_field: '\u91d1\u5cf0',
    count: {
      position:
        '\u524d\u7aef\u5f00\u53d1,\u573a\u5730\u7ba1\u7406\u9ad8\u7ea7\u4e1a\u52a1\u4e3b\u7ba1\u5c97\uff08\u6781\u9650\u73af\u5883\u6d4b\u8bd5\u4e2d\u5fc3\uff09',
      interviewer_name: '\u91d1\u5cf0',
      shared_count: 6,
      feedback_count: 3,
      pass_count: 2,
      refuse_count: 0,
      feedback_rate: 50,
      pass_rate: 33.329999999999998,
      refuse_rate: 0,
      avg_feedback_rate: '6.77',
    },
  },
];
const processState = [
  {
    name: '未处理',
    id: 1,
  },
  {
    name: '处理中',
    id: 2,
  },
  {
    name: '处理完成',
    id: 3,
  },
  {
    name: '确认完成',
    id: 4,
  },
];
const HandoverProcessCount = () => {
  const [resumeChartData, setResumeChartData] = useState(data);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const handleSearch = (changedValues: any, allValues: undefined) => {
    const values = {
      pageNum,
      pageSize,
      ...allValues,
    };
    // getList(values);
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '提交人',
      dataIndex: 'age',
      key: 'age',
      align: 'center',
    },
    {
      title: '提交部门',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '处理类型',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '处理部门',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '条码',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '交接内容',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '反馈内容',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '送检单位',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
  ];
  const renderForm = () => {
    return (
      <Form onValuesChange={handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Form.Item name="preReceiveDateStart">
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={['完成开始时间', '完成结束时间']}
          />
        </Form.Item>
      </Form>
    );
  };
  const pageChange = (pageNum: any, pageSize: any) => {
    setPageNum(pageNum);
    pageSize(pageSize);
  };
  return (
    <>
      {renderForm()}
      <Table
        dataSource={[]}
        columns={columns}
        scroll={{ x: 'max-content' }}
        size="small"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total,
          onChange: pageChange,
          showTotal: (count: number, range: [number, number]) => `共 ${count} 条`,
        }}
      />
      <Card title="处理统计">
        <MixColLine
          lineData={getData(
            resumeChartData,
            'line',
            'resume',
            'name',
            chartsConfig['resume'].lineKeys,
          )}
          columnData={getData(resumeChartData, 'column', 'resume', 'name')}
          xField={chartsConfig['resume'].xField}
          yField={chartsConfig['resume'].yField}
        />
      </Card>
    </>
  );
};
export default HandoverProcessCount;
