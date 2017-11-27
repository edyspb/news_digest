import React from 'react';
import styled from 'react-emotion';

import { Form, Input, Button, Select, DatePicker, Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;


class NewsDigestForm extends React.Component {

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
            }
        });
    }

    render() {
        const categories = this.props.categories;
        let categories_options = [];
        categories.map(category => {
            categories_options.push(
                <Option key={category.id.toString()}
                        value={category.id.toString()}>{category.name}</Option>);
        });

        const { getFieldDecorator } = this.props.form;

        const rangeConfig = {
            rules: [{
                type: 'array',
                required: true,
                message: 'Выберите интервал времени!'
            }],
        };

        return (
            <Form onSubmit={this.handleSubmit.bind(this)} >
                <FormItem
                    labelCol={{span: 10}}
                    wrapperCol={{span: 4}}
                    label="E-mail"
                    hasFeedback
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email',
                            message: 'Введен неверный E-mail!',
                        }, {
                            required: true,
                            message: 'Введите свой E-mail!',
                        }],
                    })(
                        <Input placeholder="Введите свой E-mail"/>
                    )}
                </FormItem>
                <FormItem
                    labelCol={{span: 10}}
                    wrapperCol={{span: 4}}
                    label="Интервал"
                >
                    {getFieldDecorator('date_interval', rangeConfig)(
                        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{span: 10}}
                    wrapperCol={{span: 4}}
                    label="Категории"
                >
                    {getFieldDecorator('categories', {
                        rules: [{ 
                            required: true,
                            message: 'Выберите интересующие категории!',
                            type: 'array' },
                        ],
                    })(
                        <Select mode="multiple" placeholder="Выберите интересующие категории">
                            {categories_options}
                        </Select>
                        )}
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 12, offset: 10 }}>
                    <Button type="primary" htmlType="submit">Получить</Button>
                </FormItem>
            </Form>
        );
    };
}

module.exports = NewsDigestForm;