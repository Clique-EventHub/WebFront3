import React, { Component } from 'react';

class EditDiv extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'isEdit': false,
            'text': (this.props.defaultText) ? this.props.defaultText : 'No Text'
        }
        this.onSetEdit = this.onSetEdit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSetEdit(bool) {
        if(typeof(bool) !== "boolean") return;
        this.setState({
            ...this.state,
            'isEdit': bool
        });
    }

    onChange() {
        this.setState({
            ...this.state,
            'text': ((this.refs["me"].value.length > 0) ? (this.refs["me"].value) : 'No text')
        });
    }

    render() {
        if(this.state.isEdit) {
            return (
                <div className={(this.props.classOnEdit) ? (this.props.classOnEdit) : ''} onMouseLeave={() => {this.onSetEdit(false)}}>
                    <input type="text" ref="me" onChange={this.onChange} onClick={() => {this.onSetEdit(true)}} value={this.state.text} />
                </div>
            );
        }
        return (
            <div onMouseEnter={() => {this.onSetEdit(true)}} className={(this.props.classOnLeave) ? (this.props.classOnLeave) : ''} >
                {this.state.text}
            </div>
        );
    }
}

export default EditDiv;
