import { Button, Form, Input, Modal, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Game } from "@/Entity/game.entity.ts";
import { getGameTags } from "@/api/game.api.ts";
import { uploadResource } from "@/api/resource.api.ts";

interface UploadResourceModalProps {
    visible: boolean;
    onCancel: () => void;
    onOk: () => void;
    game: Game;
}

interface FormValues {
    name: string;
    version: string;
    type: string;
    gameId: string;
    file: any;
}

export default function UploadResourceModal({
    visible,
    onCancel,
    onOk,
    game,
}: UploadResourceModalProps) {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        console.log(game);
    }, []); // 空数组确保只执行一次，类似 componentDidMount 的效果

    // 提交表单
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("version", values.version);
            formData.append("type", values.type);
            formData.append("gameId", game.id as unknown as string);
            formData.append("file", fileList[0].originFileObj);
            const resource = await uploadResource(formData);
            message.success("上传成功");
            form.resetFields();
            setFileList([]);
            onOk();
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = ()=>{
        form.resetFields();
        setFileList([]);
        onCancel();
    }
    // 上传前校验
    const beforeUpload = (file: File) => {
        const isLt50M = file.size / 1024 / 1024 < 50;
        if (!isLt50M) {
            message.error("文件大小不能超过50MB");
            return Upload.LIST_IGNORE;
        }
        return false;
    };

    // 上传文件变化时的回调
    const handleFileChange = (info: any) => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1); // 只保留一个文件
        setFileList(fileList);
    };

    return (
        <Modal
            title="上传游戏资源"
            open={visible}
            onCancel={handleCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            destroyOnClose
            maskClosable={false}
        >
            <Form form={form} layout="vertical" disabled={loading}>
                <Form.Item name="gameId" label="关联游戏社区">
                    <Input disabled defaultValue={game?.title || ""}></Input>
                </Form.Item>
                <Form.Item
                    name="name"
                    label="资源名称"
                    rules={[{ required: true, message: "请输入资源名称" }]}
                >
                    <Input placeholder="请输入资源名称" />
                </Form.Item>

                <Form.Item
                    name="version"
                    label="版本号"
                    rules={[{ required: true, message: "请输入版本号" }]}
                >
                    <Input placeholder="例如：1.0.0" />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="资源类型"
                    rules={[{ required: true, message: "请选择资源类型" }]}
                >
                    <Select placeholder="请选择资源类型">
                        <Select.Option value="official">官方资源</Select.Option>
                        <Select.Option value="patch">补丁</Select.Option>
                        <Select.Option value="mod">模组</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="file"
                    label="选择文件"
                    rules={[{ required: true, message: "请选择要上传的文件" }]}
                >
                    <Upload
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onChange={handleFileChange}
                        maxCount={1}
                        accept={
                            ".zip,.rar,.7z,.tar,.gz,.bz2,.tgz,.tar.gz,.tar.bz2"
                        }
                    >
                        <Button icon={<UploadOutlined />}>选择文件</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
}
