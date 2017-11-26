import React from 'react';
import styled from 'react-emotion';

import { Form, Layout } from 'antd';
const { Header,  Content } = Layout;

import 'antd/dist/antd.css';

import NewsDigestForm from './NewsDigestForm';


const HeaderCaption = styled('span') `
    color: white;
    font-family: cursive;
    font-size: larger;
`;

const ResultLabel = styled('p')`
    margin-top: 10%;
    text-align: center;
    font-size: 15px
`;

const APP_WAIT_STATE = 'wait';
const APP_SUCCESS_STATE = 'success';
const APP_ERROR_STATE = 'error';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            app_state: APP_WAIT_STATE

        };
    };

    componentDidMount() {
        fetch("/api/category/")
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Getting categories error.");
        })
        .then(categories => {
            this.setState({categories});
        })
        .catch(error => {
            this.setState({app_state: APP_ERROR_STATE});
        });
    };

    getNewsDigest(params) {
        const payload = {
            email: params.email,
            date_from: params.date_interval[0].unix(),
            date_to: params.date_interval[1].unix(),
            categories: params.categories.map(val => Number(val))
        };
        
        fetch("/api/digest/", {
            method: "POST",
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                this.setState({app_state: APP_SUCCESS_STATE});
            } else {
                throw new Error("Getting digest error.");
            }
        })
        .catch(error => {
            this.setState({app_state: APP_ERROR_STATE});
        })
    };

    render() {
        const WrapperNewsDigestForm = Form.create()(NewsDigestForm);

        return (
                <Layout>
                    <Header>
                        <HeaderCaption>Дайджест новостей с сайта lenta.ru</HeaderCaption>
                    </Header>
                    <Layout style={{ background: '#fff' }}>
                        <Content style={{ background: '#fff', padding: '0 50px', marginTop: 64 }}>
                        {this.state.app_state == APP_WAIT_STATE &&
                            <WrapperNewsDigestForm
                                categories={this.state.categories}
                                onSubmit={this.getNewsDigest.bind(this)} />
                        }
                        {this.state.app_state == APP_SUCCESS_STATE &&
                            <ResultLabel>Готово! Дайджест будет выслан на указаный e-mail.</ResultLabel>
                        }
                        {this.state.app_state == APP_ERROR_STATE &&
                            <ResultLabel>Возникла ошибка. Поворите попытку позже.</ResultLabel>
                        }
                        </Content>
                    </Layout>
                </Layout>
        );
    };
}

module.exports = App;