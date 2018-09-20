import request from '../utils/request';
const Root = 'http://10.129.232.19:8363';
export default {
  getTableList() {
    return request(Root + '/table/tableList');
  },
  getTableDatas(tableName) {
    return request(Root + '/table/data?name=' + tableName);
  },
  getTableStruct(tableName) {
    return request(Root + '/table/struct?name=' + tableName);
  },
  deleteTableRowData(tableName, rowdatas) {
    let datas = {
      tableName,
      rowdatas
    }
    let formData = new FormData();
    formData.append("tableName", tableName);
    formData.append("rowdatas", JSON.stringify(rowdatas));

    var options = {
      method: 'POST',
      body: JSON.stringify(datas),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }
    return request(Root + '/table/deleteRow', options);
  }
}
