import React , { Component } from 'react';

class circle extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        let color = ["red", "green", "yellow", "pink", "blue"];
        //shade-${color[parseInt(Math.random() * 5)%5]}
        let rObj = (
            <article className={`${this.props.parent}-item shade-${color[parseInt(Math.random() * 5)%5]}`}>
                <h3 className="display-none">Tag Name</h3>
            </article>
        );
        if(this.props.parent === "channel") {
            rObj = (
                <article className={`${this.props.parent}-item basic-card`}>
                    <div role="img" src="" alt="channel-photo" className={`shade-${color[parseInt(Math.random() * 5)%5]}`}/>
                    <h3>Channel Name</h3>
                </article>
            )
        }
        return rObj;
    }
}

export default circle;
