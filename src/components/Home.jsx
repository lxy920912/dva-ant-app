import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import database from '../services/database'

import TableDatas from './TableDatas'
import RowData from './RowData'

const { Header, Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      currentTable: null,
      tableList: [],
      tableStruct: [],
      tableName: '',
      tableDatas: [],
      collapsed: false,
      rowData: null
    };
  }
  setHomeState = (state) => {
    this.setState(state);
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  setTableStruct = (tableStruct) => {
    this.setState({
      tableStruct
    })
  }
  setRowData = (rowData) => {
    this.setState({
      rowData
    })
  }
  componentDidMount = async () => {
    const tableList = (await database.getTableList()).data;
    const currentTable = tableList[0];
    this.setState({
      tableList,
      currentTable
    })
  }
  componentWillReceiveProps = async (nextProps) => {
    const tableName = nextProps.tableName;
    this.setState({
      tableName
    })
  }
  componentDidUpdate = async () => {

  }
  render() {
    let tableList = this.state.tableList;
    let tableListNav = [];
    let tableStruct = this.state.tableStruct;
    let rowData = this.state.rowData;
    let tableName = this.props.match.params.tableName;

    if (tableList == null || tableList.length <= 0) {
      return <div></div>;
    }
    // console.log(tableList);
    tableList.map((item, index) => {
      tableListNav.push(<Menu.Item key={index}>
        <Link to={`/table/list/${item.Name}`} >{item.Name}</Link>
      </Menu.Item>)
    })
    return (
      <Layout style={{ height: '100%' }}>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={250} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['0']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu key="sub1" defaultSelectedKeys={['0']} title={<span><Icon type="user" />中间页统计</span>}>
                {tableListNav}
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280, height: '100%', overflow: 'scroll' }}>
              <Route path='/table/list/:tableName' component={props => {
                return <TableDatas tableName={tableName} setRowData={this.setRowData} setTableStruct={this.setTableStruct}
                  setHomeState={this.setHomeState}></TableDatas>
              }}>
              </Route>
              <Route path='/table/edit/:tableName' component={props => {
                return <RowData
                  {...props}
                  tableStruct={tableStruct}
                  tableName={tableName}
                  rowData={rowData}
                />
              }}
              ></Route>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default Home;
