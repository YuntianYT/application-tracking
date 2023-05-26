import { Table, Input, Popconfirm, Form, Typography } from 'antd';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useFirestore, useUser } from 'reactfire';
import { Select } from 'antd';
import dayjs from 'dayjs';
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
      editable: false,
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      editable: true,
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
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
  }, [docRef]);

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
        rowClassName='editable-row'
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default ApplicationTable;
