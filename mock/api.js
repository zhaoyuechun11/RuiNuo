import mockjs from "mockjs"
export default {
  'GET /apiweb/setting/jobLevel/list': mockjs.mock({
    "status_code": 200,
    "time": 1627385810,
    "message": "请求成功!",
    "data": [
      {
        "id": 7611,
        "key": 1,
        "name": "初级",
        "level": 1,
        "enable|1": true,
      },
      {
        "id": 7612,
        "key": 2,
        "name": "中级",
        "level": 2,
        "enable|1": true,
      },
      {
        "id": 7613,
        "key": 3,
        "name": "高级",
        "level": 3,
        "enable|1": true,
      },
      {
        "id": 7614,
        "key": 4,
        "name": "主管",
        "level": 4,
        "enable|1": true,
      },
      {
        "id": 7615,
        "key": 5,
        "name": "总经理",
        "level": 5,
        "enable|1": true,
      },
    ]
  }),

  'GET /apiweb/setting/emailResumeRule': mockjs.mock({
    "status_code": 200,
    "time": 16273858230,
    "message": "请求成功!",
    "data|3": [
      {
        "id|+1": 21324,
        "key|+1": 43905,
        "rules|3": [{
          "left|1": ["position_name", "work_place", "channel"],
          "operator|1": [1, 2],
          "right": string // "[12,34,32] or 产品... "
        }],
        "assigned_position|1": { "id+1": 62522, "name|1": ["运营", "测试"] },
        "createdTime": () => new Date(),
      }
    ]
  })
}