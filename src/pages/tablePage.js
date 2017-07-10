import React , { Component } from 'react';
import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';
import './css/tablePage.css';

class tablePage extends Component {

    render() {

        return (
            <div className="table-page">
            <section className="table-top">
                <div className="table-name">
                    <h1>EVENTNAME</h1>
                </div>
                <div className="table-search">
                    <form>
                        <div><i className="fa fa-search" aria-hidden="true"></i></div>
                        <input type="text" placeholder="Search" ref="first"></input>
                    </form>
                </div>
            </section>
            <section className="table-center">
                <div className="table-main">
                    <table>
                        <thead>
                            <tr>
                                <th>NO.</th>
                                <th>/</th>
                                <th>STUDENT ID</th>
                                <th>NAME</th>
                                <th>SURNAME</th>
                                <th>NICKNAME</th>
                                <th>FALCULTY</th>
                                <th>TEL</th>
                                <th>LINE ID</th>
                                <th>FACEBOOK</th>
                                <th>EMAIL</th>
                                <th>MEDICAL PROBLEM</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>x</td>
                                <td>5830129021</td>
                                <td>Sam</td>
                                <td>Saeddht</td>
                                <td>Samy</td>
                                <td>Engineering</td>
                                <td>0899809988</td>
                                <td>sam_sdt</td>
                                <td>Sam Saeddht</td>
                                <td>sam_sdt@gmail.com</td>
                                <td>กินของราคาถูกไม่เป็น</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>/</td>
                                <td>5830129021</td>
                                <td>Sam</td>
                                <td>Saeddht</td>
                                <td>Samy</td>
                                <td>Engineering</td>
                                <td>0899809988</td>
                                <td>sam_sdt</td>
                                <td>Sam Saeddht</td>
                                <td>sam_sdt@gmail.com</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>x</td>
                                <td>5830129021</td>
                                <td>Sam</td>
                                <td>Saeddht</td>
                                <td>Samy</td>
                                <td>Engineering</td>
                                <td>0899809988</td>
                                <td>sam_sdt</td>
                                <td>Sam Saeddht</td>
                                <td>sam_sdt@gmail.com</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>/</td>
                                <td>5830129021</td>
                                <td>Sam</td>
                                <td>Saeddht</td>
                                <td>Samy</td>
                                <td>Engineering</td>
                                <td>0899809988</td>
                                <td>sam_sdt</td>
                                <td>Sam Saeddht</td>
                                <td>sam_sdt@gmail.com</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>/</td>
                                <td>5830129021</td>
                                <td>Sam</td>
                                <td>Saeddht</td>
                                <td>Samy</td>
                                <td>Engineering</td>
                                <td>0899809988</td>
                                <td>sam_sdt</td>
                                <td>Sam Saeddht</td>
                                <td>sam_sdt@gmail.com</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>6</td>
                                <td>/</td>
                                <td>5830129021</td>
                                <td>Sam</td>
                                <td>Saeddht</td>
                                <td>Samy</td>
                                <td>Engineering</td>
                                <td>0899809988</td>
                                <td>sam_sdt</td>
                                <td>Sam Saeddht</td>
                                <td>sam_sdt@gmail.com</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>7</td>
                                <td>x</td>
                                <td>5830129021</td>
                                <td>Sam</td>
                                <td>Saeddht</td>
                                <td>Samy</td>
                                <td>Engineering</td>
                                <td>0899809988</td>
                                <td>sam_sdt</td>
                                <td>Sam Saeddht</td>
                                <td>sam_sdt@gmail.com</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>8</td>
                                <td>x</td>
                                <td>5830129021</td>
                                <td>Sam</td>
                                <td>Saeddht</td>
                                <td>Samy</td>
                                <td>Engineering</td>
                                <td>0899809988</td>
                                <td>sam_sdt</td>
                                <td>Sam Saeddht</td>
                                <td>sam_sdt@gmail.com</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>9</td>
                                <td>x</td>
                                <td>5830129021</td>
                                <td>Sam</td>
                                <td>Saeddht</td>
                                <td>Samy</td>
                                <td>Engineering</td>
                                <td>0899809988</td>
                                <td>sam_sdt</td>
                                <td>Sam Saeddht</td>
                                <td>sam_sdt@gmail.com</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>10</td>
                                <td>/</td>
                                <td>5830129021</td>
                                <td>Sam</td>
                                <td>Saeddht</td>
                                <td>Samy</td>
                                <td>Engineering</td>
                                <td>0899809988</td>
                                <td>sam_sdt</td>
                                <td>Sam Saeddht</td>
                                <td>sam_sdt@gmail.com</td>
                                <td>-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <section className="table-bottom">
                <div className="table-add">
                    <table>
                        <tr>
                            <td><button className="invisible">ADD</button></td>
                            <form><input type="text" placeholder="" ref="first"></input></form>
                        </tr>
                    </table>
                    <button>IMPORT LIST</button>
                </div>
                <div className="table-button">
                    <button>APPROVE</button>
                    <button>Send Message</button>
                    <button>PRINT</button>
                    <button>GOOGLE SHEET</button>
                </div>
            </section>
            </div>
        );
    }
}


export default normalPage(pages(tablePage, true));
