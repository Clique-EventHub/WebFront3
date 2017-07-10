import React, { Component } from 'react';
import SearchBox from '../components/searchBox';
import Bubble from '../components/Bubble';
import ProfilePopUp from './profilePopup';
import { Link } from 'react-router';
import SearchResult from './searchResult';
import autoBind from '../hoc/autoBind';
import axios from 'axios';
import { getCookie } from '../actions/common';
import { hostname } from '../actions/index';
import $ from 'jquery';

class topNavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'searchTerm': '',
            'name': "Sign in / Sign up",
            'picture': "../../resource/images/dummyProfile.png",
            'isSearchActive': false
        }

        this.onUpdateSearch = this.onUpdateSearch.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onButtonToggle = this.onButtonToggle.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.onSearchToggleState = this.onSearchToggleState.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    onWindowResize() {
        let _this = this;
        if($(window).width() > 768) {
            if($(".content-move-active").length) {
                $(".content-move-active").removeClass("content-move-active").addClass("content-move-inactive");
            }

        } else {
            if($('.profile-menu-active').length) $('.profile-menu-active').removeClass('profile-menu-active').addClass('profile-menu-inactive');
            if($('.tags-menu-active').length) $('.tags-menu-active').removeClass('tags-menu-active').addClass('tags-menu-inactive');
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.onWindowResize);
        this.onWindowResize();

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        let _this = this;

        axios.get(`${hostname}user`, config).then((data) => {
            console.log("get top nav bar!!!");
            console.log(JSON.stringify(data.data.firstName));
            _this.setState({
                'name': data.data.firstName,
                'picture': data.data.picture
            })
        }, (error) => {
            console.log("get tnb error");
        });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    // componentDidUpdate() {
    //     console.log(this.state);
    // }

    onSearchToggleState(value) {
        let tmp = (typeof(value) === "boolean") ? value : !this.state.isSearchActive;

        this.props.searched_item_handler(!this.props.pages.searched_item);
        if(this.props.pages.is_item_shown) {
            // this.props.hide_pop_item();
            this.props.blur_bg();
        }

        else {
            if(tmp) {
                //SearchBox Active
                if(!this.props.pages.is_blur) this.props.blur_bg();
            } else {
                this.props.unblur_bg();
            }
        }

        this.blurModal();
        if(tmp) $('.search-box-container').fadeIn(200);
        else $('.search-box-container').fadeOut(200);

        this.setState({
            ...this.state,
            isSearchActive: tmp
        });
    }

    blurModal() {
        // if($('.modal-container').hasClass('blur')) {
        //     $('.modal-container').removeClass('blur');
        // } else {
        //     $('.modal-container').addClass('blur');
        // }
    }

    onUpdateSearch(select, optional) {
        let term = "";
        if(select === "first") {
            term = this.refs.first.value;
        } else if(typeof(optional) !== "undefined" && optional !== null) {
            term = optional.value;
        }

        if(!this.state.isSearchActive && term.length > 0) {
            this.onSearchToggleState(true);
        }

        this.setState({
            ...(this.state),
            'searchTerm': term
        });
    }

    onButtonToggle() {
        if($(".content-move-inactive").length) {
            $(".content-move-inactive").removeClass("content-move-inactive").addClass("content-move-active");
            if($('.search-box-container').css('display') === "block") {
                $('.search-box-container').fadeToggle(200);
                this.props.unblur_bg();
            }
        }
        else {
            $(".content-move-active").removeClass("content-move-active").addClass("content-move-inactive");
        }
    }

    onToggleProfile() {
        if($('.profile-menu-active').length === 0) {
            $('.profile-menu-inactive').removeClass('profile-menu-inactive').addClass('profile-menu-active');
            if($('.tags-menu-active').length) {
                $('.tags-menu-active').removeClass('tags-menu-active').addClass('tags-menu-inactive');
            }
        } else {
            $('.profile-menu-active').removeClass('profile-menu-active').addClass('profile-menu-inactive');
        }
    }

    onToggleTags() {
        if($('.tags-menu-active').length === 0) {
            $('.tags-menu-inactive').removeClass('tags-menu-inactive').addClass('tags-menu-active');
            if($('.profile-menu-active').length) {
                $('.profile-menu-active').removeClass('profile-menu-active').addClass('profile-menu-inactive');
            }
        } else {
            $('.tags-menu-active').removeClass('tags-menu-active').addClass('tags-menu-inactive');
        }
    }

    onToggle() {
        if(this.state.isSearchActive) {
            this.props.display_pop_item();
            // if(!this.props.pages.is_blur) this.props.blur_bg();
            this.setState({
                ...this.state,
                'isSearchActive': false,
                searchTerm: ''
            })
        } else {
            this.props.toggle_pop_item();
        }
    }

    onSubmit(e) {
        e.preventDefault();
        return false;
    }

    onKeyPress(e) {
        if(e.key === "Escape") {
            if(!this.props.pages.is_item_shown) this.props.unblur_bg();
            this.setState({
                ...this.state,
                'isSearchActive': false
            });
        }
    }

    render() {
        return (
            <nav aria-hidden="false" role="top-nav">
                <button className="outline square-round toggle" onClick={this.onButtonToggle}>
                    <i className="fa fa-bars" aria-hidden="true"></i>
                </button>
                <section className="flex-left toggle-not" content="left-group" aria-hidden="true">
                    <Link to="/calendar">
                        <button className="invisible" onClick={this.onToggleTags}>
                            <img aria-hidden="false" src="../resource/images/bubble.svg" role="tags-icon" alt="bubble-icon"/>
                        </button>
                    </Link>
                    <div aria-hidden="true" className="vr"></div>
                    <form onSubmit={this.onSubmit}>
                        <i className="fa fa-search" aria-hidden="true"></i>
                        <input className="invisible" type="text" placeholder="Search" ref="first" onChange={() => { this.onUpdateSearch("first");}} onClick={()=> {this.onSearchToggleState(true);}} value={this.state.searchTerm} onClick={this.onSearchToggleState} onKeyDown={this.onKeyPress}></input>
                    </form>
                </section>
                <Link to="/" className="flex-center" onClick={() => {if(this.pages.is_blur) this.props.toggle_pop_item()}}>
                    <img src="../../resource/images/icon.png" alt="icon" />
                </Link>
                <button aria-hidden="false" className="flex-right toggle-not invisible" role="profile-button" onClick={this.onToggleProfile}>
                    <div>
                        {this.state.name}
                    </div>
                    <img src={this.state.picture} alt="profile"/>
                </button>
                <button className="flex-right toggle outline square-round" onClick={() => { this.onSearchToggleState()}}>
                    <i className="fa fa-search" aria-hidden="true"></i>
                </button>
                <div className={`toggle no-pos ${(this.state.searchTerm.length > 0 && this.state.isSearchActive) ? '' : 'display-none'}`}>
                    <SearchBox onUpdateSearch={this.onUpdateSearch} searchTerm={this.state.searchTerm} onSubmit={this.onSubmit} />
                    <SearchResult noBg={true} className={(this.state.searchTerm.length > 0 && this.state.isSearchActive) ? '' : 'display-none'} keyword={this.state.searchTerm} onToggle={() => {this.onToggle();}} onSetItem={this.props.set_pop_up_item} />
                </div>
                <div className={`toggle-not no-pos ${(this.state.searchTerm.length > 0 && this.state.isSearchActive) ? '' : 'display-none'}`}>
                    <SearchResult className={(this.state.searchTerm.length > 0 && this.state.isSearchActive) ? '' : 'display-none'} keyword={this.state.searchTerm} onToggle={() => {this.onToggle();}} onSetItem={this.props.set_pop_up_item} />
                </div>
                <div className="profile-menu-inactive">
                    <ProfilePopUp />
                </div>
                <div className="tags-menu-inactive">
                    <Bubble />
                </div>
            </nav>
        );
    }
}

export default autoBind(topNavBar, false);
