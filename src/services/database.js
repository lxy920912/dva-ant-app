import request from '../utils/request';
const Root = 'http://10.129.232.19:8363';
export default {
  getTableList() {
    return request(Root + '/table/tableList');
  }
}
