import React, { Ref } from "react";
import { message, 
  Tree, 
  Input, 
  Button,
  Row,
  Col,
  Form,
  Collapse,
  Table,
  Upload,
  Select,
  Modal
  } 
  from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getAction, postAction } from '../../api/manage';
import './index.less';
import { FormInstance } from "rc-field-form";

const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { confirm } = Modal;

const columns = [
  {
    title: '病人id',
    dataIndex: 'patientId',
    key: 'patientId',
  },
  {
    title: '科室名称',
    dataIndex: 'officeName',
    key: 'officeName',
  },
  {
    title: '医生姓名',
    dataIndex: 'doctorName',
    key: 'doctorName',
  },
  {
    title: '身份证号',
    dataIndex: 'idCard',
    key: 'idCard',
  },
  {
    title: '收费项目',
    dataIndex: 'hisName',
    key: 'hisName',
  },
]

interface DataManageState {
  treeData: any,

  dataType: string,

  tableData: any,
  loading: boolean,
  totalCount: number,
  currentPage: number,
  fileKey: string,

  changedName: string
}

// 将除了文件节点之外的 禁用 避免点击
function parseTree(data: any) {
  data.forEach((item: any) => {
    if(item.children !== undefined) {
      item.selectable = false;
      parseTree(item.children);
    }
  })
}

class DataManage extends React.Component<{}, DataManageState> {

  private formRef: any;

  constructor(props: {}) {
    super(props);
    this.formRef = React.createRef<FormInstance>();
    this.state = {
      // mock数据
      treeData: [
        {
          title: 'parent 1',
          key: '0-0',
          children: [
            {
              title: 'parent 1-0',
              key: '0-0-0',
              disabled: true,
              children: [
                {
                  title: 'leaf',
                  key: '0-0-0-0',
                  disableCheckbox: true,
                },
                {
                  title: 'leaf',
                  key: '0-0-0-1',
                },
              ],
            },
            {
              title: 'parent 1-1',
              key: '0-0-1',
              children: [{ title: <span style={{ color: '#1890ff' }}>sss</span>, key: '0-0-1-0' }],
            },
          ],
        },
      ],
      // 数据类型存储
      dataType: 'his',
      // 表格state
      loading: false,
      tableData: [],
      totalCount: 1,
      currentPage: 1,
      // fileKey 用分页时, 传给后端
      fileKey: '',
      // modal confirm 
      changedName: ''
    }
  }

  // componentDidMount() {
  //  // 获取目录
  //   postAction('/api/dataManage/directory', {})
  //     .then((res: any) => {
  //       if(res.success) {
  //         const data = res.result;

  //         this.setState({
  //           treeData: parseTree(data.directory)
  //         });
  //       } else {
  //         message.error(res.message);
  //       }
  //     })
  // }


  getFields = () => {
    return (
      <>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="patientId"
              label='病人id'
              >
              <Input />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="officeName"
              label='科室名称'
              >
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="doctorName"
              label='医生名称'
              >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="idCard"
              label='身份证号'
              >
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="hisName"
              label='收费项目'
              >
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Button type="primary">筛查</Button>
          </Col>
        </Row>
      </>
    )
  }

  // confirm 会一直挂载, 所以不能写在render里
  getConfirm = (fileName: string) => {
    const that = this;
    confirm({
      title: `修改文件${fileName}的文件名 : `,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        /**
         * 用 ref 方式 通过getFieldsvalue获取值, 用ref.onFinish是不行的
         * 通过打印current可以看到具体都有哪些函数
         */
        const values = that.formRef.current.getFieldsValue();
        const { fileKey } = that.state;
        let postBody = {
          fileKey: fileKey,
          changedName: values.inputName
        }
        postAction('/dataManage/directory', postBody)
          .then((res : any) => {
            const fetchData = res.result;
              
            that.setState({
              treeData: fetchData.directory
            });
          })
      },
      content: (
        <Form
          ref={this.formRef}
          >
          <Form.Item
            name="inputName"
            >
            <Input />
          </Form.Item>
        </Form>
      )
    })
  }

  render(): React.ReactNode {
    const { 
      treeData, dataType, 
      loading, totalCount, currentPage,
     } = this.state;

    parseTree(treeData);

    const props = {
      aciton: '/api/dataManage/upload',
      data: {
        fileType: dataType,
        pageNo : 1
      },
      onChange: this.onChange
    }

    return(
      <div className="wrapper">

        <div className="treeSelect">
          <Tree
            defaultExpandAll	
            treeData={treeData}
            onSelect={this.handleSelect}
            onRightClick={this.rightClick}
          />
        </div>

        <div className="listPage">
          <div className="filter"> 
            <Collapse defaultActiveKey={['1']}>
              <Panel header="数据上传" key="1">
                <Form 
                  layout="inline">
                  <Form.Item
                    label="数据类型"
                    >
                    <Select
                      style={{ width: 120 }}
                      onSelect={this.dataSelect}
                      >
                      <Option value="his">His</Option>
                      <Option value="lis">Lis</Option>
                      <Option value="pacs">Pacs</Option>
                      <Option value="emr">电子病历</Option>
                      <Option value="ess">医保</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Upload {...props}>
                      <Button icon={<UploadOutlined />} type="primary">
                        数据上传
                      </Button>
                    </Upload>
                  </Form.Item>
                </Form>
              </Panel>
              <Panel header="筛查条件选择" key="2">
                <Form
                  className="filterForm"
                  onFinish={this.onFinish}
                  >
                  {this.getFields}
                </Form>
              </Panel>
            </Collapse>
          </div>

          <div className="list">
            <Table 
              loading={loading}
              columns={columns}
              pagination={{
                pageSize: 10,
                current: currentPage,
                total: totalCount,
                onChange: this.changePage
              }}
              />
          </div>
        </div>

      </div>

    );
  }

  onFinish = (values: any) => {
    const { fileKey } = this.state;
    const filterData = Object.assign({}, values);
    let postBody = {
      fileKey: fileKey,
      filterCase: filterData,
      pageNo: 1
    }
    this.setState({ loading: true })

    this.getList(postBody);
  }

  changePage = (pageNumber: number) => {

    this.setState({ loading: true, currentPage: pageNumber });

    const { fileKey } = this.state;
    let postBody = {
      fileKey: fileKey,
      pageNo: pageNumber
    }
    this.getList(postBody);
  }

  // 分页 筛选都用到
  getList = (postBody: object) => {
    postAction('/dataManage/upload', postBody)
      .then((res : any) => {
        const data = res.result;

        this.setState({
          tableData: data.list,
        });
      })
      .finally(() => {
        this.setState({
          loading: false
        })
      });
  }

  handleSelect = (selectedKeys: Array<any>) => {
    this.setState({ 
      loading: true
    })
    let postBody = {
      fileKey: selectedKeys[0],
      pageNo: 1
    }
    postAction('/dataManage/upload', postBody)
      .then((res : any) => {
        const data = res.result;

        this.setState({
          tableData: data.list,
          totalCount: data.totalCount,
          fileKey: data.fileKey
        });
      })
      .finally(() => {
        this.setState({
          loading: false
        })
      });
  }

  rightClick = (params: any) => {
    this.getConfirm(params.node.title);
  }

  onChange = (info: any) => {
    if(info.file.status === 'uploading') {
      this.setState({
        loading: true
      });
    } else if(info.file.status === 'done') {
      const res = info.file.response;
      const data = res.result;
      
      this.setState({
        loading: false,
        tableData: data.list,
        totalCount: data.totalCount,
        fileKey: data.fileKey
      });

      // 文件上传完成后更新目录

      getAction('/dataManage/directory')
        .then((res: any) => {
          const fetchData = res.result;
          
          this.setState({
            treeData: fetchData.directory
          });
        })

    } else {
      message.error(info.file.reponse.message);
    }
  }

  dataSelect = (dataType: string) => {
    this.setState({
      dataType: dataType
    });
  }



}

export default DataManage;