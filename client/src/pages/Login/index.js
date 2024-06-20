import React, { useEffect } from 'react'
import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom';
import Divider from "../../components/Divider";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';
import ReactGA from 'react-ga';

const rules = [
  {
    required: true,
    message: "required",
  },
];
function Login() {
  useEffect(() => {
    ReactGA.initialize('G-HTDE4VD4KG');
    // To record a page view
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true))
      const response = await LoginUser(values);
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = '/';
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error.message);
    }
  };
  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     navigate=("/");
  //   }
  // }, [navigate]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/"); // Call the function to navigate to "/"
    }
  }, [navigate]); // Add 'navigate' to the dependency array to avoid the eslint warning
  

  return (
    <div
      className='h-screen bg-primary flex justify-center items-center'
    >
      <div className='bg-white p-5 rounded w-[450px]'>
        <h1 className='text-primary text-xl'>Deal&Steal-LOGIN FORM</h1>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={rules}>
            <Input placeholder='Email' />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={rules}>
            <Input type="password" placeholder='Password' />
          </Form.Item>
          <Button type='primary' htmlType='submit' block className='mt-2'>Login</Button>
          <div className='mt-5 text-center'>
            <span className='text-grey-500'>
              Don't have an account?<Link to="/Register">Register</Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login