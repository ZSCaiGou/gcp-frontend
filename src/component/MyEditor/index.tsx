import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { useState, useEffect } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

function MyEditor({ html, setHtml, excludeKeys = [] }) {
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语// JS 语法

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法
    toolbarConfig.excludeKeys = excludeKeys;

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: "请输入内容...",
        MENU_CONF: {},
    };
    editorConfig.MENU_CONF["uploadImage"] = {
        server: "/api/user-content/picture",
        fieldName: "picture",
        accept: "image/*",
        headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
        },
    };

    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return;
            editor.destroy();
            setEditor(null);
        };
    }, [editor]);

    return (
        <>
            <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={(editor) => setHtml(editor.getHtml())}
                    mode="default"
                    style={{ height: "400px", overflowY: "hidden" }}
                />
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: "0" }}
                />
            </div>
        </>
    );
}

export default MyEditor;
