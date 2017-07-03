import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import { Link } from 'react-router';

import './css/signup.css';

class loginPage extends Component {

    onFetch() {
        this.props.fbGetBasicInfo();
        this.props.fbGetFriendsList();
    }

    onFetchToken() {
        this.props.fbGetSeverToken();
    }

    onLogin() {
        this.props.fbLogin(this.props.fbGetSeverToken);
        this.props.fbGetBasicInfo();
    }

    onLogout() {
        this.props.fbLogout();
    }

    componentWillMount() {
        document.title = "Event Hub | Login";
    }

    render() {

        const isTest = false;
        const basicInfo = (
            <div>
                Basic Info<br />
                {this.props.fb.basic_info.name}<br />
                {this.props.fb.basic_info.id}<br />
                {this.props.fb.basic_info.email}<br />
                <br />
                Friends Using<br />
            {(this.props.fb.user_friends) ? this.props.fb.user_friends.map((item, key) => {
                return <div key={key}>{item.name} {item.id}</div>
            }) : null}
            </div>
        )

        const innerContext = (isTest) ? (
            <section>
                This is for testing purpose<br />
                <button onClick={this.onLogin.bind(this)}>Login</button><br />
                <button onClick={this.onLogout.bind(this)}>Logout</button><br />
                <button onClick={this.onFetch.bind(this)}>Fetch</button><br />
                <button onClick={this.onFetchToken.bind(this)}>Token Fetch</button><br />
                {basicInfo}
            </section>
        ) : (
            <section className="signup-page">
                <atricle className="basic-card-no-glow login-card">
                    <img src="../../resource/images/icon.png" alt="icon" />
                    <button alt="fb-login" onClick={this.onLogin.bind(this)}>
                        <div alt="fb-icon-container">
                            <img src="../../resource/images/fb_icon.svg" alt="fb-icon" />
                        </div>
                        <div>
                            <span>
                                Sign up with Facebook
                            </span>
                        </div>
                    </button>
                    <Link to='/'>
                        Continue as guest
                    </Link>
                </atricle>
                <footer alt="login-footer">
                    <div aria-hidden="true" alt="icon-zone">
                        <img src="../../resource/images/obj_clique_logo.png" alt="spn-icon" />
                    </div>
                </footer>
            </section>
        );

        return innerContext
    }
}

export default autoBind(loginPage, true);
