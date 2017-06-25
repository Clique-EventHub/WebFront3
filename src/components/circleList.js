import React , { Component } from 'react';
import Circle from './circle';
import $ from 'jquery';

class circleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prev: false,
            width: $(window).width(),
            height: $(window).height()
        }
        this.centerGrid = this.centerGrid.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    updateDimensions() {
        let parentSelector = `section[content=${this.props.parent}]`;
        let wrapperSelector = `section.${this.props.parent}List`;
        let itemSelector = `article.${this.props.parent}-item`;

        this.setState({ ...(this.state), width: $(window).width(), height: $(window).height()});
        this.centerGrid($(parentSelector), $(wrapperSelector), $(itemSelector), 0.9);
    }

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount() {
        let parentSelector = `section[content=${this.props.parent}]`;
        let wrapperSelector = `section.${this.props.parent}List`;
        let itemSelector = `article.${this.props.parent}-item`;

        this.centerGrid($(parentSelector), $(wrapperSelector), $(itemSelector), 0.9);
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    centerGrid(container, wrapper, item, ratio) {
        var winWidth = container.innerWidth();
        var itemWidth = item.outerWidth(true);
        var maxItem = (item.length < Math.floor(ratio*winWidth/itemWidth)) ? item.length : Math.floor(ratio*winWidth/itemWidth);
        if($(window).width() <= 768) {
            maxItem = (maxItem < 4) ? maxItem : 4;
            this.setState({
                ...this.state,
                pre: true
            });
        }
        maxItem = ($(window).width() > 768 && maxItem > 4) ? 4 : maxItem;
        if(this.state.prev && $(window).width() > 768) {
            maxItem = 2;
            this.setState({
                ...this.state,
                pre: false
            });
        }
        wrapper.css('width', maxItem*itemWidth);
    }

    render() {
        let wrapperClass = `${this.props.parent}List`;
        return (
            <section className={wrapperClass}>
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
                <Circle parent={this.props.parent} />
            </section>
        );
    }
}

export default circleList;
