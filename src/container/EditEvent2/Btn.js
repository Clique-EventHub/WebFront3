import React, { Component } from 'react';

class Btn extends Component {
    //BtnToggleState
    constructor(props) {
        super(props);
        this.state = {
            'isActive': false,
            'isInit': false
        }
        this.onClick = this.onClick.bind(this);

        if(this.props.isInit) {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    'isInit': true,
                    'isActive': this.props.initialState || false
                })
            }, 0);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(!this.state.isInit && nextProps.isInit) {
            this.setState({
                'isInit': true,
                'isActive': nextProps.initialState || false
            })
        }
    }

    onClick() {
        let tmp = !this.state.isActive;
        this.setState({
            ...this.state,
            'isActive': tmp
        });
        if(typeof(this.props.callback) === "function") this.props.callback(tmp, this.props.text);
    }

    render() {
        if(this.props.text.length === 0) return (<button className={(this.state.isActive) ? this.props.classNameOn : this.props.classNameOff} style={this.props.style}></button>)
        return (
            <button onClick={this.onClick} className={(this.state.isActive) ? this.props.classNameOn : this.props.classNameOff} style={this.props.style}>
                {this.props.text}
            </button>
        );
    }
}

export default Btn;
