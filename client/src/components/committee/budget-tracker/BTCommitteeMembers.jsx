import React from "react";
import {Avatar, List} from "antd";
import { plugins } from "chart.js";

// const {  Avatar, List  } = antd;
const data = [
    {
      title: 'President',
    },
    {
      title: 'Vice-President',
    },
    {
      title: 'Secretary',
    },
    {
      title: 'Treasurer',
    },
];
const BTCommitteeMembers = () => (
    <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
            <List.Item>
            <List.Item.Meta
                avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                title={<a href="https://ant.design">{item.title}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
            </List.Item>
        )}
        />
    );
    // const options = {
    //     plugins: {

    //     }
    // }


export default BTCommitteeMembers;
