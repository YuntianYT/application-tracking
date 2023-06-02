import {
  Table,
  Input,
  Popconfirm,
  Form,
  Typography,
  Space,
  Button,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useFirestore, useUser } from 'reactfire';
import { Select } from 'antd';
import dayjs from 'dayjs';
import Link from 'antd/es/typography/Link';
import Highlighter from 'react-highlight-words';
const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  ...restProps
}) => {
  const inputNode =
    dataIndex === 'status' ? (
      <Select>
        <Select.Option value='Applied'>Applied</Select.Option>
        <Select.Option value='Interviewing'>Interviewing</Select.Option>
        <Select.Option value='Offered'>Offered</Select.Option>
        <Select.Option value='Rejected'>Rejected</Select.Option>
      </Select>
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ApplicationTable = () => {
  const { data: user } = useUser();
  const db = useFirestore();
  const docRef = doc(db, 'user', user.email);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    const row = await form.validateFields();
    const newData = [...data].map((item) => {
      const { num, ...rest } = item;
      return { ...rest, date: dayjs().format('YYYY-MM-DD') };
    });
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      setEditingKey('');
      const updateRef = doc(db, 'user', user.email);
      await updateDoc(updateRef, { applications: newData });
    }
  };

  const deleteRecord = async (key) => {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const docData = docSnapshot.data();
      const newArray = docData.applications.filter((item) => item.key !== key);

      await updateDoc(docRef, { applications: newArray });
    }
  };

  const columns = [
    {
      title: 'No.',
      dataIndex: 'num',
      key: 'num',
      width: '5%',
      editable: false,
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      width: '15%',
      ...getColumnSearchProps('companyName'),
      editable: true,
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      width: '40%',
      render: (text) => (
        <Link target='_blank' href={text}>
          {text}
        </Link>
      ),
      editable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      editable: true,
    },
    {
      title: 'Last Update Date',
      dataIndex: 'date',
      key: 'date',
      editable: false,
    },
    {
      title: 'Action',
      key: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title='Sure to cancel?' onConfirm={cancel}>
              <Typography.Link>Cancel</Typography.Link>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Typography.Link
              style={{ marginLeft: '1rem' }}
              onClick={() => {
                deleteRecord(record.key);
              }}
            >
              Delete
            </Typography.Link>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputtype: col.dataIndex === 'num' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(docRef);
      const applications = docSnap.data()?.applications;
      applications?.forEach((application, index) => {
        application.num = index + 1;
      });
      setData(applications);
    };
    const unsubscribe = onSnapshot(docRef, fetchData);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        dataSource={data}
        columns={mergedColumns}
        style={{ height: '59vh' }}
        rowClassName='editable-row'
        scroll={{ y: '50vh' }}
        pagination={{
          pageSize: 20,
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default ApplicationTable;
