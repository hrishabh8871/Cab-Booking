// Import Library
import React, { useEffect, useState } from 'react';
import { Spin, Form, Input, Button, Checkbox } from 'antd';
import axios from 'axios';
import { Content } from 'antd/lib/layout/layout';
import { Redirect, Route, Switch } from 'react-router-dom';



class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            otpVerificationScreen: false,
            isCabLogin: false,
            userMobile: null
        };
    }



    async componentDidMount() {
        try {

        } catch (err) {

        }
    }


    onFinish = async (values) => {
        console.log('Success:', values);
        this.setState({
            loading: true
        })
        this.setState({
            userMobile: values['mobile']
        })
        await axios.post("http://localhost:5001/userValidate", {
            mobile: values['mobile'],
            isCabLogin: values['isCabLogin']

        }).then(res => {
            if (res && res.data && res.data.success) {
                this.setState({
                    otpVerificationScreen: true
                })

                if (res.data.isCabDetailsNeedsToRegister) {
                    this.setState({
                        isCabLogin: true
                    })
                }
            }
        }).catch(err => {
            console.log("ERR ---->", err)
        })

        this.setState({
            loading: false
        })
    };

    otpVerification = async (values) => {
        console.log('Success:', values);
        this.setState({
            loading: true
        })
        let postData = {
            mobile: parseInt(this.state.userMobile),
            OTP: parseInt(values['OTP']),
            isCabDetails: this.state.isCabLogin,
            cabDetails: {
                DL: values['DL'] ? values['DL'] : '',
                vehicleReg: values['vehicleNo'] ? values['vehicleNo'] : ''
            }
        }
        await axios.post("http://localhost:5001/otpVerification", postData).then(res => {
            if (res && res.data && res.data.success) {
                console.log("RES ------>", res.data)
                localStorage.setItem('userIDRider', JSON.stringify(res.data))
                this.props.history.push("/home");
            }
        }).catch(err => {
            console.log("ERR ---->", err)
        })

        this.setState({
            loading: false
        })
    };





    render() {

        const { loading, otpVerificationScreen, isCabLogin } = this.state

        return (

            <Content>
                <Spin spinning={loading}>
                    {
                        !otpVerificationScreen ? <Form
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={this.onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Mobile Number"
                                name="mobile"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="isCabLogin"
                                valuePropName="checked"
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Checkbox>Registering With Us As Cab Driver</Checkbox>
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form> : <Form
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={this.otpVerification}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="OTP"
                                name="OTP"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your OTP!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            {
                                isCabLogin && (
                                    <>
                                        <Form.Item
                                            label="Vehicle No"
                                            name="vehicleNo"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your Vehicle No!',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            label="DL"
                                            name="DL"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your DL!',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </>
                                )
                            }

                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Submit
                    </Button>
                            </Form.Item>
                        </Form>
                    }
                </Spin>
            </Content>
        )
    }
}



export default Login