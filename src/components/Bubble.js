import React, { Component } from 'react';
import './style/bubble.css'

const number_of_child = 5;
//23118902

class Bubble extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isClick: false,
        }
    }

    onClickHandler() {
        if(!this.state.isClick) { //is now clicked
            this.setState({
                ...(this.state),
                isClick: true
            });
            this.refs.appendage.style.opacity = "1";
        }
        else {
            this.setState({
                ...(this.state),
                isClick: false
            });
            this.refs.appendage.style.opacity = "0";
        }
    }

    render() {

        const child = [];
        const angle = 360/number_of_child;
        const color = ["red", "green", "yellow", "blue", "pink"]

        for(var i = 0; i < number_of_child; i++) {
            const classNameChild = "child-bubble shade-" + color[i%color.length];
            child.push(
                <div className="child-bubble-container" key={i} style={{'transform': `translate(-50%) rotateZ(${i*angle}deg)`}}>
                    <div className={classNameChild} style={{'transform': `translateY(-50%) translateX(-50%) rotateZ(-${i*angle}deg)`}}>
                        A
                    </div>
                </div>
            );
        }

        return (
            <div className="Bubble">
                <div className="main-bubble" ref="main-bubble" onClick={this.onClickHandler.bind(this)} >
                    +
                </div>
                    <div ref="appendage" style={{'opacity': '0', 'transition': '0.2s'}}>
                        {child.map((item) => {
                            return item
                        })}
                    </div>
            </div>
        );
    }
}

export default Bubble;
