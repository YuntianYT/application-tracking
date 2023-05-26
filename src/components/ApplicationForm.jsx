import React from 'react';
import { Form, Input, Button, Select, DatePicker, notification } from 'antd';
import { useFirestore, useUser } from 'reactfire';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
const { Option } = Select;
function ApplicationForm() {
  const [form] = Form.useForm();
  const { data: user } = useUser();
  const db = useFirestore();
  const docRef = doc(db, 'user', user.email);
  const onFinish = async (values) => {
    const documentSnapshot = await getDoc(docRef);
    const applicationObject = {
      key: Date.now().toString(),
      companyName: values.companyName,
      link: values.link,
      status: values.status,
      date: values.date.format('YYYY-MM-DD'),
    };
    if (documentSnapshot.exists()) {
      try {
        await updateDoc(docRef, {
          applications: arrayUnion(applicationObject),
        });
        form.resetFields();
        notification.success({
          message: 'Success',
          description: 'Application added successfully',
          placement: 'top',
        });
      } catch (error) {
        console.error('Update operation failed:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to add application',
          placement: 'top',
        });
      }
    } else {
      try {
        await setDoc(docRef, {
          applications: arrayUnion(applicationObject),
        });
        form.resetFields();
        notification.success({
          message: 'Success',
          description: 'Application added successfully',
          placement: 'top',
        });
      } catch (error) {
        console.error('Update operation failed:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to add application',
          placement: 'top',
        });
      }
    }
  };
  return (
    <Form
      layout='inline'
      form={form}
      initialValues={{
        companyName: '',
        link: '',
        status: 'Applied',
        date: dayjs(),
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name='companyName'
        rules={[{ required: true, message: 'Please input company name' }]}
      >
        <Input placeholder='Company Name' />
      </Form.Item>
      <Form.Item
        name='link'
        rules={[{ required: true, message: 'Please input link of the job' }]}
      >
        <Input placeholder='https://job_link' />
      </Form.Item>
      <Form.Item name='status'>
        <Select placeholder='Status'>
          <Option value='Applied'>Applied</Option>
          <Option value='Interviewing'>Interviewing</Option>
          <Option value='Rejected'>Rejected</Option>
        </Select>
      </Form.Item>
      <Form.Item name='date'>
        <DatePicker placeholder='date' />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}

export default ApplicationForm;
