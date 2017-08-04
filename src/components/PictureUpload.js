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
            'initValues': [],
            'mapPictures': {}
        }
        //Problem is picture in input files is not in the same order as pictures
        //So instead of using index as only reference, use mapPicture object to map between files instead
        //And then use that map in place of pictures <In case of using only pictures -> need to implement more logic>

        this.onSelectedPoster = this.onSelectedPoster.bind(this);
        this.removeImg = this.removeImg.bind(this);
        this.renderImage = this.renderImage.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.isInit !== nextProps.isInit && nextProps.isInit === true) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    'isInit': true,
                    'pictures': nextProps.srcs,
                    'initValues': nextProps.srcs
                }
            }, () => {
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
            'pictures': (this.props.persistentImg) ? this.state.initValues : [],
            'mapPictures': {}
        }, () => {
            if(input.files) {
                let _this = this;
                for(let i = 0; i < input.files.length; i++) {
                    let index = Number(i);
                    if(input.files[index]) {
                        let reader = new FileReader();

                        reader.onload = function(e) {
                            _this.setState((prevState) => {
                                let new_map = { ...prevState.mapPictures };
                                new_map[index] = {
                                    pic: e.target.result,
                                    file: input.files[index]
                                }
                                if(!_this.props.persistentImg) {
                                    return {
                                        ...prevState,
                                        'mapPictures': new_map,
                                        'pictures': [],
                                        'initValues': []
                                    }
                                }
                                return {
                                    ...prevState,
                                    'mapPictures': new_map
                                }
                            }, () => {
                                _this.forceUpdate()
                            })
                        }
                        reader.readAsDataURL(input.files[index]);
                    }
                }
            }
        });
    }

    removeImg(index, isFile) {
        const pics = this.state.pictures;
        const init = this.state.initValues;
        let nextPics = pics.slice(0, index).concat(pics.slice(index+1, pics.length));
        let nextInit = (!isFile && index < init.length) ? init.slice(0, index).concat(init.slice(index+1, init.length)) : init
        let new_map = { ...this.state.mapPictures };
        if(isFile) {
            delete new_map[index - nextInit.length];
        }

        console.log(nextPics, nextInit, new_map);

        this.setState({
            ...this.state,
            'pictures': nextPics,
            'initValues':nextInit,
            'mapPictures': new_map
        }, () => {
            this.forceUpdate();
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

    renderImage() {
        if(this.state.isInit) {
            const div = this.refs["preview-image"];
            this.state.pictures.forEach((item, index) => {
                let child = div.children[index];
                child.style.backgroundImage = `url('${item}')`;
            })
            Object.keys(this.state.mapPictures).forEach((item, index) => {
                let child = div.children[index + this.state.pictures.length];
                child.style.backgroundImage = `url('${this.state.mapPictures[item].pic}')`;
            })
        }
    }

    componentDidUpdate() {
        if(this.state.isInit) {
            this.renderImage();

            if(typeof(this.props.onUpdate) === "function") {
                const input = this.refs["files"];
                const files = [];
                Object.keys(this.state.mapPictures).forEach((key) => {
                    files.push(this.state.mapPictures[key].file);
                })
                let pictures = [].concat(this.state.pictures);
                pictures = pictures.concat(Object.keys(this.state.mapPictures).map((item) => this.state.mapPictures[item].pic));
                this.props.onUpdate(pictures, files);
            }
        }
    }

    render() {
        return (
            <div className="PictureUpload" style={this.props.style}>
                <label className="fileContainer">
                    <div>{(this.props.showFilesNumber && ((this.state.pictures.length + Object.keys(this.state.mapPictures).length) > 0)) ? `${this.state.pictures.length + Object.keys(this.state.mapPictures).length} files` : this.state.text }</div>
                    <input
                        type="file"
                        ref="files"
                        onChange={this.onSelectedPoster}
                        className="fileInput"
                        accept="image/*"
                        multiple={this.props.isMultiple}
                        onClick={(event)=> {
                            event.target.value = null
                        }}
                    />
                </label>
                <div ref="preview-image" className="PreviewImage-Container">
                    {
                        this.state.pictures.map((item, index) => {
                            return (
                                <div data-alt="preview-image" key={index}>
                                    <span onClick={() => { this.removeImg(index, false); }} />
                                </div>
                            );
                        })
                    }
                    {
                        Object.keys(this.state.mapPictures).map((item, index) => {
                            return (
                                <div data-alt="preview-image" key={parseInt(item, 10) + this.state.pictures.length}>
                                    <span onClick={() => { this.removeImg(parseInt(item, 10) + this.state.pictures.length, true); }} />
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
    'onUpdate': (pictures, fileInput) => console.log(pictures, fileInput),
    'isMultiple': false
}

export default PictureUpload;
