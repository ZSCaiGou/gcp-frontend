import { Flex, Input } from "antd";
import { useState } from "react";

export  function SearchBar() {
    const { Search } = Input;
    const [searchPopBoxVisible, setSearchPopBoxVisible] = useState(false);
    const handleSearch = (value: string, event,{source }:{source:"clear"|"input"}) => {
        // 清楚搜索框内容时不触发搜索
        if(source === "clear"){
            return;
        }
        // TODO: 触发搜索事件
    };
    return (
        <>
            <Flex justify={"center"} align={"middle"}>
                <Search
                    onFocus={() => setSearchPopBoxVisible(true)}
                    onBlur={() => setSearchPopBoxVisible(false)}
                    placeholder={"搜索"}
                    onSearch={handleSearch}
                    className={""}
                    size={"large"}
                    enterButton
                    allowClear
                ></Search>
            </Flex>

        </>
    );
}
