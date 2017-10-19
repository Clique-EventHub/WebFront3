import React , { Component } from 'react';
import { getRandomShade } from '../actions/common';
import { Link } from 'react-router';
import Image from './Image';

class Circle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'shade': getRandomShade()
        }
    }

    render() {
        const props = this.props;

        if(props.parent === "channel") {
            if(props.option) {
                const { name, id } = props.option;
                const picture = props.option.picture || '';
                return (
                    <Link to={`/channel/${id}`}>
                        <article className={`${props.parent}-item basic-card`}>
                            <Image role="img" src={picture} alt="channel-photo" className={this.state.shade}/>
                            <h3>{name}</h3>
                        </article>
                    </Link>
                );
            }
        }
        return (
            <Link to={`/tagpage?keyword=${this.props.tagName}`}>
                <article className={`${props.parent}-item ${this.state.shade}`}>
                    <div className={this.props.tagName.length > 7 ? 'smaller' : this.props.tagName.length > 5 ? 'small' : ''}>{this.props.tagName}</div>
                </article>
            </Link>
        );
    }
}

export default Circle;
