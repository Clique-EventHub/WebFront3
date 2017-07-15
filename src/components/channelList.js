import React from 'react';
import Circle from './circle';

function checkFormat(item) {
    return (item && typeof(item.name) === 'string' && typeof(item.id) === 'string' ) ? true : false;
}

const channelList = (props) => {
    const parent = "channel";
    return (
        <section className="channelList">
            {
                props.channelList.map((item, index) => {
                    if(checkFormat(item)) return <Circle key={index} parent={parent} option={item} />
                    else return null;
                })
            }
        </section>
    );
}


//Channel List format
// {
//     'name': [String],
//     'id': [String],
//     'picture': [String]
// }
//

channelList.defaultProps = {
    channelList: [{
        'name': 'Channel Name Test',
        'id': 'Nonesensical',
    }, {
        'name': 'Channel Name Test 2',
        'id': 'Nonesensical',
    }, {
        'name': 'Channel Name Test 3',
        'id': 'Nonesensical',
    }, {
        'name': 'Channel Name Test 4',
        'id': 'Nonesensical',
    }, {
        'name': 'Channel Name Test 5',
        'id': 'Nonesensical',
    }]
}

export default channelList;
