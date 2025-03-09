import React from "react";
import {Avatar, List} from "antd";
import { plugins } from "chart.js";

// const {  Avatar, List  } = antd;
const data = [
    {
      title: "Jane Doe",
      description: "President",
      avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=Andrea",

    },
    {
      title: "John Doe",
      description: "Vice-President",
      avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=Nolan"
    },
    {
      title: "Jane Doe",
      description: "Secretary",
      avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=Ryan"
      
    },
    {
      title: "John Doe",
      description: "Treasurer",
      avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=Mason"
    },
];
const BTCommitteeMembers = () => (
    <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
            <List.Item>
            <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={item.title}
                description={item.description}
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
