/*
*    React Component: PictureUpload
*    Props :
*    {
*        'text': <String>,
*        'isInit': <Boolean>,
*        'srcs': [<Strings>],
*        'showFilesNumber': [Boolean],
*        'persistentImg': [Boolean]
*    }
*/

import React, { Component } from 'react';
import './style/PictureUpload.css';

// function objModStr(obj,is, value) {
//     if (typeof is == 'string')
//         return objModStr(obj,is.split('.'), value);
//     else if (is.length == 1 && value!==undefined)
//         return obj[is[0]] = value;
//     else if (is.length == 0)
//         return obj;
//     else
//         return objModStr(obj[is[0]],is.slice(1), value);
// }

class PictureUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'isInit': false,
            'pictures': [],
            'text': this.props.text || "Upload",
            'initValues': []
        }
        this.onSelectedPoster = this.onSelectedPoster.bind(this);
        this.removeImg = this.removeImg.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.isInit !== nextProps.isInit && nextProps.isInit === true) {
            new Promise((resolve, reject) => resolve(true)).then(() => {
                this.setState({
                    ...this.state,
                    'isInit': true,
                    'pictures': nextProps.srcs,
                    'initValues': nextProps.srcs
                })
            }).then(() => {
                const div = this.refs["preview-image"];
                nextProps.srcs.forEach((url, index) => {
                    const child = div.children[index];
                    if(child) {
                        child.style.backgroundImage = `url('${url}')`;
                    }
                })
            })
        }
    }

    onSelectedPoster() {
        const input = this.refs["files"];

        this.setState({
            ...this.state,
            'pictures': (this.props.persistentImg) ? this.state.initValues : []
        });

        if(input.files) {
            let _this = this;
            for(let i = 0; i < input.files.length; i++) {
                let index = Number(i);
                if(input.files[index]) {
                    let reader = new FileReader();

                    reader.onload = function(e) {
                        _this.setState({
                            ..._this.state,
                            'pictures': _this.state.pictures.concat(e.target.result)
                        });
                    }
                    reader.readAsDataURL(input.files[index]);
                }
            }
        }
    }

    removeImg(index) {
        const pics = this.state.pictures;
        const init = this.state.initValues;
        this.setState({
            ...this.state,
            'pictures': pics.slice(0, index).concat(pics.slice(index+1, pics.length)),
            'initValues': (index < init.length) ? init.slice(0, index).concat(init.slice(index+1, init.length)) : init
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.pictures.length === this.state.pictures.length) {
            let isSame = true;
            for(let i = 0;  i < nextState.pictures.length && isSame; i++) {
                isSame = (nextState.pictures[i].slice(0,200) === this.state.pictures[i].slice(0,200));
            }
            return !isSame;
        }
        return true;
    }

    componentDidUpdate() {
        if(this.state.isInit) {
            const div = this.refs["preview-image"];
            this.state.pictures.forEach((item, index) => {
                let child = div.children[index];
                child.style.backgroundImage = `url('${item}')`;
            })

            if(typeof(this.props.onUpdate) === "function") {
                const input = this.refs["files"];
                if(this.state.pictures.length > 0) this.props.onUpdate(this.state.pictures, input.files);
                else this.props.onUpdate(this.state.pictures, null);
            }
        }
    }

    render() {
        return (
            <div className="PictureUpload">
                <label className="fileContainer">
                    <div>{(this.props.showFilesNumber && this.state.pictures.length > 0) ? `${this.state.pictures.length} files` : this.state.text }</div>
                    <input type="file" ref="files" onChange={this.onSelectedPoster} className="fileInput" accept="image/*" multiple={this.props.isMultiple} />
                </label>
                <div ref="preview-image" className="PreviewImage-Container">
                    {
                        this.state.pictures.map((item, index) => {
                            return (
                                <div data-alt="preview-image" key={index}>
                                    <span onClick={() => { this.removeImg(index); }} />
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

PictureUpload.defaultProps = {
    'text': null,
    'isInit': true,
    'srcs': [],
    'showFilesNumber': true,
    'persistentImg': true,
    'onUpdate': (pictures) => console.log(pictures),
    'isMultiple': false
}

export default PictureUpload;
