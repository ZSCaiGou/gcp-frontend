import { Flex, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";

export  function SearchBar() {
    const { Search } = Input;
    const navigate = useNavigate();
    const [searchPopBoxVisible, setSearchPopBoxVisible] = useState(false);
    const handleSearch = (value: string, event,{source }:{source:"clear"|"input"}) => {
        // 清楚搜索框内容时不触发搜索
        if(source === "clear"){
            return;
        }
        if(value.length === 0){
            return;
        }
        navigate(`/home/home-search?search=${value}`);
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
