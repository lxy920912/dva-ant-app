import React from 'react'
import axios from 'axios'
import { Form, Icon, Input, Button, Checkbox, Row, DatePicker } from 'antd';
import moment from 'moment';
import TableDatas from './TableDatas';
const FormItem = Form.Item;
const { TextArea } = Input;

class RowForm extends React.Component {
  constructor(props) {
    super(props);
    const path = this.props.match.path;
    this.state = {
      tableStruct: [],
      tableName: '',
      result: 'insert into table success',
      rowData: null,
      route: path.slice(0, path.lastIndexOf('/'))
    };
  }
  async componentDidMount() {
    let tableName = this.props.tableName;
    let rowData = this.props.rowData;
    let tableStruct = this.props.tableStruct;
    this.setState({ tableName, rowData });
  }
  async componentDidUpdate() {
    let tableName = this.props.tableName;
    if (tableName != this.state.tableName) {
      this.setState({
        tableName
      });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const tableName = this.props.tableName;
    const tableStruct = this.props.tableStruct;

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('---***----', tableStruct[0], tableStruct.length);
        for (let i = 0; i < tableStruct.length; i++) {
          if (/^timestamp/.test(tableStruct[i].Type)) {
            // values[tableStruct[i].Field] = values[tableStruct[i].Field].format('YYYY-MM-DD HH:mm:ss');
          }
        }
        switch (this.state.route) {
          case '/addrow': {
            var res = (await axios.post('/table/insetData', {
              tableName,
              values
            })).data;
            if (!res.flag) {
              alert("插入失败：" + res.mgs);
            } else {
              this.props.history.push(`/index/${tableName}`);
              // this.backTableDatas();
            }
            break;
          }
          case '/editrow': {
            const oldData = this.props.rowData;
            const newData = values;
            const res = (await axios.post('/table/editRowData', {
              tableName,
              oldData,
              newData
            }));
            if (!res.data.flag) {
              console.log('--&^8(0^$0%#-----', res);
              alert('修改失败:' + res.data.mgs);
            } else {
              // this.backTableDatas();
              this.props.history.push(`/index/${tableName}`);
            }
            break;
          }
        }
      } else {
        console.log('....', err);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const tableStruct = this.props.tableStruct;
    const rowData = this.props.rowData;
    console.log(this.props);
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const formStyle = {
      marginRight: 10
    };
    return (
      <div>
        <div style={formStyle}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            {
              tableStruct.map((item, index) => {
                if (item.Extra == 'auto_increment' || item.Extra == 'on update CURRENT_TIMESTAMP') {
                  return;
                }
                let dateFormate = "YYYY-MM-DD HH:mm:ss";
                let required = item.Null == 'NO' ? true : false;
                let message = 'please input ' + item.Field;
                let defalutvalue = '';
                if (/^\/table\/edit/.test(this.props.match.url)) {
                  defalutvalue = rowData[item.Field]
                } else {
                  defalutvalue = item.Default;
                }
                let dataTypeInput = <Input />;
                if (/^text/.test(item.Type)) {
                  dataTypeInput = <TextArea rows={4} />
                } if (/^timestamp/.test(item.Type)) {
                  // dataTypeInput = <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                  if (this.state.route == '/editrow') {
                    defalutvalue = moment(defalutvalue, dateFormate);
                  }
                }
                return (
                  <FormItem
                    key={item.Field}
                    {...formItemLayout}
                    label={item.Field}
                  >
                    {
                      getFieldDecorator(item.Field, {
                        rules: [{ required, message }],
                        initialValue: defalutvalue
                      })(
                        dataTypeInput
                      )}
                  </FormItem>
                );
              })
            }
            <Button type="primary" htmlType="submit" className="login-form-button">
              提交
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
const RowData = Form.create()(RowForm);
export default RowData;
