import React from 'react'
import { Layout, Menu, Breadcrumb, Icon, Table, Button, Input } from 'antd';
import { Link } from "react-router-dom";
import database from '../services/database'
import tableStyle from '../assets/css/table.css'


const { Header, Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class TableDatas extends React.Component {
  constructor() {
    super();
    this.state = {
      test: 'hello',
      tableDatas: [],
      tableStruct: []
    }
  }
  componentWillReceiveProps = async (nextProps) => {
    const tableName = nextProps.tableName;
    if (tableName == this.props.tableName) {
      return
    }
    let tableDatas = (await database.getTableDatas(tableName)).data;
    let tableStruct = (await database.getTableStruct(tableName)).data;
    this.setState({
      tableDatas,
      tableStruct
    })
  }
  componentDidUpdate = async () => {

  }
  shouldComponentUpdate(nextProps, nextState) {

    return true
  }
  async componentDidMount() {
    let tableName = this.props.tableName;
    let tableDatas = (await database.getTableDatas(tableName)).data;
    let tableStruct = (await database.getTableStruct(tableName)).data;
    this.setState({
      tableDatas,
      tableStruct
    });
  }
  editDatas(text, record, index) {
    alert(text)
    console.log(text)
  }
  handleSearch = (selectedKeys, confirm) => () => {
    this.setState({ searchText: selectedKeys[0] });
  }
  handleReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchText: '' });
  }
  render() {
    const cellStyle = {
      overflow: ' hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2
    }
    const tableName = this.props.tableName;
    let columns = [];
    const tableDatas = this.state.tableDatas;
    const tableStruct = this.state.tableStruct;
    const test = this.state.test;
    for (let i in tableStruct) {
      let col = {};
      col.title = tableStruct[i].Field;
      col.dataIndex = tableStruct[i].Field;
      col.key = tableStruct[i].Field;
      col.filterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="custom-filter-dropdown">
          <Input
            ref={ele => this.searchInput = ele}
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={this.handleSearch(selectedKeys, confirm)}
          />
          <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>Search</Button>
          <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
        </div>
      );
      col.filterIcon = filtered => <Icon type="smile-o" style={{ color: filtered ? '#108ee9' : '#aaa' }} />;
      col.sorter = (a, b) => {
        let flag = a[tableStruct[i].Field] - b[tableStruct[i].Field];
        if (isNaN(flag)) {
          return a[tableStruct[i].Field] > b[tableStruct[i].Field]
        } else {
          return flag
        }
      };
      col.onFilter = (value, record) => {
        try {
          return record[tableStruct[i].Field].toLowerCase().includes(value.toLowerCase());
        } catch (e) {
          return false;
        }
      };
      col.onFilterDropdownVisibleChange = (visible) => {
        if (visible) {
          setTimeout(() => {
            this.searchInput.focus();
          });
        }
      }
      col.render = (text) => {
        return <div style={cellStyle}> {text}</div >
      }
      columns.push(col);
    }
    let col = {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (text, record, index) => {
        let path = `/table/edit/${tableName}`
        return <div>
          <Link to={path}>
            <span className={tableStyle.handleText} href="javascript:;" onClick={() => {
              this.props.setRowData(record);
              let rowData = record;
              let tableStruct = this.state.tableStruct;
              console.log('--------------')
              console.log(rowData);
              this.props.setHomeState({
                rowData,
                tableStruct
              })
            }}>edit</span>
          </Link>
          <a className={tableStyle.handleText} href="javascript:;" onClick={async () => {
            const tableName = this.props.tableName;
            let res = (await database.deleteTableRowData(tableName, record)).data;
            if (res.flag) {
              alert('删除成功');
              let tableDatas = (await database.getTableDatas(tableName)).data;
              this.setState({
                tableDatas
              })
            } else {
              alert(res.msg);
            }
          }}>delete</a>
        </div >
      }

    }
    columns.push(col);
    return <div>
      ${tableName}
      <div>
        <Table
          bordered
          rowKey={record => record[tableStruct[0].Field]}
          dataSource={tableDatas}
          columns={columns}
          scroll={{ x: 1000 }} />
      </div>

    </div>
  }
}
export default TableDatas;
