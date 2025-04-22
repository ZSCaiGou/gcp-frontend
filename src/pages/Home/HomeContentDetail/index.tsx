import { UserContent, UserContentComment } from "@/Entity/user_content.entity";
import ContentCard from "@/pages/Home/component/ContentCard";
import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import {
    getUserContentById,
    likeContent,
    favoriteContent,
    shareContent,
    addComment,
    likeComment,
    getReplies,
} from "@/api/usercontent.api";
import {
    Button,
    Card,
    Flex,
    Input,
    message,
    Avatar,
    List,
    Popover,
    Dropdown,
    Space,
    Spin,
    Tabs,
} from "antd";
import {
    LikeFilled,
    LikeOutlined,
    StarFilled,
    StarOutlined,
    ShareAltOutlined,
    SendOutlined,
    CaretDownOutlined,
    CaretRightOutlined,
    SortAscendingOutlined,
    EllipsisOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type SortType = "newest" | "oldest" | "hottest";

export default function HomeContentDetail() {
    const { contentId } = useParams<{ contentId: string }>();
    const [userContent, setUserContent] = useState<UserContent | null>(null);
    const [comments, setComments] = useState<UserContentComment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [sortType, setSortType] = useState<SortType>("newest");
    const [actionLoading, setActionLoading] = useState({
        like: false,
        favorite: false,
        share: false,
    });
    const cardRef = useRef<HTMLDivElement>(null);
    const [commentInputWidth, setCommentInputWidth] = useState("");
    useEffect(() => {
        fetchContent();
    }, [contentId, sortType]);
    useEffect(() => {
        if (cardRef.current) {
            console.log(cardRef.current.clientWidth);
            setCommentInputWidth(cardRef.current.clientWidth + "px");
        }
    }, [cardRef]);
    window.onresize = () => {
        if (cardRef.current) {
            setCommentInputWidth(cardRef.current.clientWidth + "px");
        }
    };
    // 获取用户内容
    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await getUserContentById(contentId!);
            setUserContent(res.data);
            setComments(
                res.data?.comments?.map((comment) => ({
                    ...comment,
                    showReplies: false,
                    loadingReplies: false,
                })) || [],
            );
        } catch (err) {
            message.error(err.message);
        } finally {
            setLoading(false);
        }
    };
    // 点赞
    const handleLike = async () => {
        try {
            setActionLoading((prev) => ({ ...prev, like: true }));
            await likeContent(contentId!);
            setUserContent((prev) => ({
                ...prev!,
                isLiked: !prev!.isLiked,
                likeCount: prev!.isLiked
                    ? prev!.likeCount - 1
                    : prev!.likeCount + 1,
            }));
            message.success(userContent?.isLiked ? "取消点赞成功" : "点赞成功");
        } catch (err) {
            message.error(err.message);
        } finally {
            setActionLoading((prev) => ({ ...prev, like: false }));
        }
    };
    // 点赞评论
    const handleCommentLike = async (commentId: string) => {
        try {
            const res = await likeComment(commentId);
            setComments((prev) =>
                prev.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            isLiked: !comment.isLiked,
                            likeCount: comment.isLiked
                                ? comment.likeCount - 1
                                : comment.likeCount + 1,
                        };
                    }
                    return comment;
                }),
            );
        } catch (err) {
            message.error(err.message);
        }
    };
    // 收藏
    const handleFavorite = async () => {
        try {
            setActionLoading((prev) => ({ ...prev, favorite: true }));
            await favoriteContent(contentId!);
            setUserContent((prev) => ({
                ...prev!,
                isFavorited: !prev!.isFavorited,
                favoriteCount: prev!.isFavorited
                    ? prev!.favoriteCount - 1
                    : prev!.favoriteCount + 1,
            }));
            message.success(
                userContent?.isFavorited ? "取消收藏成功" : "收藏成功",
            );
        } catch (err) {
            message.error(err.message);
        } finally {
            setActionLoading((prev) => ({ ...prev, favorite: false }));
        }
    };
    // 分享
    const handleShare = async () => {
        try {
            setActionLoading((prev) => ({ ...prev, share: true }));
            await shareContent(contentId!);
            message.success("分享成功");
        } catch (err) {
            message.error(err.message);
        } finally {
            setActionLoading((prev) => ({ ...prev, share: false }));
        }
    };
    // 评论
    const handleCommentSubmit = async () => {
        if (!commentText.trim()) {
            message.warning("评论内容不能为空");
            return;
        }

        try {
            const res = await addComment(contentId!, commentText, "-1");
            setComments((prev) => [
                {
                    ...res.data,
                    showReplies: false,
                    loadingReplies: false,
                    replies: [],
                },
                ...prev,
            ]);
            setCommentText("");
            message.success("评论成功");
            setUserContent((prev) => ({
                ...prev!,
                commentCount: prev!.commentCount + 1,
            }));
        } catch (err) {
            message.error(err.message);
        }
    };
    // 回复
    const handleReplySubmit = async (commentId: string) => {
        if (!replyText.trim()) {
            message.warning("回复内容不能为空");
            return;
        }
        console.log("parentId:" + commentId);
        try {
            const res = await addComment(contentId!, replyText, commentId);
            console.log("resdata:", res.data);
            setComments((prev) =>
                prev.map((comment) => {
                    if (comment.id === res.data.origin_id) {
                        return {
                            ...comment,
                            replies: [...(comment.replies || []), res.data],
                            reply_count: comment.reply_count + 1,
                        };
                    }
                    return comment;
                }),
            );
            setReplyText("");
            setReplyingTo(null);
            message.success("回复成功");
        } catch (err) {
            message.error(err.message);
        }
    };
    // 展开/收起评论
    const toggleReplies = async (commentId: string) => {
        setComments((prev) =>
            prev.map((comment) => {
                if (comment.id === commentId) {
                    const shouldFetch =
                        !comment.showReplies &&
                        (!comment.replies || comment.replies.length === 0);

                    return {
                        ...comment,
                        showReplies: !comment.showReplies,
                        loadingReplies: shouldFetch
                            ? true
                            : comment.loadingReplies,
                    };
                }
                return comment;
            }),
        );

        const comment = comments.find((c) => c.id === commentId);
        if (
            !comment?.showReplies &&
            (!comment?.replies || comment.replies.length === 0)
        ) {
            try {
                const res = await getReplies(commentId);
                console.log(res.data);
                setComments((prev) =>
                    prev.map((c) => {
                        if (c.id === commentId) {
                            return {
                                ...c,
                                replies: res.data,
                                loadingReplies: false,
                            };
                        }
                        return c;
                    }),
                );
            } catch (err) {
                message.error(err.message);
                setComments((prev) =>
                    prev.map((c) => {
                        if (c.id === commentId) {
                            return {
                                ...c,
                                loadingReplies: false,
                            };
                        }
                        return c;
                    }),
                );
            }
        }
    };
    // 分享选项
    const shareOptions = (
        <div className="p-2">
            <Button type="text" block>
                复制链接
            </Button>
            <Button type="text" block>
                分享到微信
            </Button>
            <Button type="text" block>
                分享到微博
            </Button>
        </div>
    );
    // 排序选项
    const sortItems = [
        {
            key: "newest",
            label: "最新评论",
            icon: <SortAscendingOutlined />,
        },
        {
            key: "oldest",
            label: "最早评论",
            icon: <SortAscendingOutlined />,
        },
        {
            key: "hottest",
            label: "最热评论",
            icon: <LikeFilled />,
        },
    ];
    // 评论操作
    const renderCommentActions = (comment: UserContentComment) => [
        <Button
            key="like"
            type="text"
            size="small"
            icon={
                comment.isLiked ? (
                    <LikeFilled className="text-red-500" />
                ) : (
                    <LikeOutlined />
                )
            }
            onClick={() => handleCommentLike(comment.id)}
        >
            {comment.likeCount}
        </Button>,
        <Button
            key="reply"
            type="text"
            size="small"
            onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
            }
        >
            回复
        </Button>,
        comment.reply_count > 0 && comment.origin_id === comment.id && (
            <Button
                key="toggle-replies"
                type="text"
                size="small"
                onClick={() => toggleReplies(comment.id)}
                icon={
                    comment.showReplies ? (
                        <CaretDownOutlined />
                    ) : (
                        <CaretRightOutlined />
                    )
                }
            >
                {comment.reply_count}条回复
            </Button>
        ),
    ];
    // 渲染评论
    const renderComment = (
        comment: UserContentComment,
        isReply = false,
        replyToName?: string,
    ) => (
        <div
            key={comment.id}
            className={`mb-4 ${isReply ? "ml-10 border-l-2 border-gray-200 pl-4" : ""}`}
        >
            <div className="flex">
                <Avatar src={comment.user_info.avatar_url}>
                    {comment.user_info.nickname.charAt(0)}
                </Avatar>
                <div className="ml-3 flex-1">
                    <div className="flex items-center">
                        <span className="font-medium">
                            {comment.user_info.nickname}
                        </span>
                        {replyToName && (
                            <span className={"ml-2 text-xs text-gray-500"}>
                                <CaretRightOutlined />
                                {replyToName}
                            </span>
                        )}
                        <span className="ml-2 text-xs text-gray-500">
                            {dayjs(comment.create_at).fromNow()}
                        </span>
                    </div>
                    <div className="mt-1">{comment.content}</div>
                    <div className="mt-2">
                        <Space size="middle">
                            {renderCommentActions(comment)}
                        </Space>
                    </div>
                </div>
            </div>

            {replyingTo === comment.id && (
                <div className="mt-3 ml-10 flex">
                    <Input
                        placeholder={`回复 ${comment.user_info.nickname}`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onPressEnter={() => handleReplySubmit(comment.id)}
                    />
                    <Button
                        type="text"
                        icon={<SendOutlined />}
                        onClick={() => handleReplySubmit(comment.id)}
                    />
                </div>
            )}

            {comment.showReplies && (
                <div className="mt-3">
                    {comment.loadingReplies ? (
                        <div className="flex justify-center py-2">
                            <Spin size="small" />
                        </div>
                    ) : (
                        comment.replies?.map((reply) =>
                            renderComment(
                                reply,
                                true,
                                reply.parent_id === reply.origin_id
                                    ? null
                                    : comment.replies.filter(
                                          (to_reply) =>
                                              to_reply.id === reply.parent_id,
                                      )[0].user_info.nickname,
                            ),
                        )
                    )}
                </div>
            )}
        </div>
    );

    return (
        <Flex vertical className="pb-32">
            {userContent && (
                <ContentCard
                    onClick={() => {}}
                    type="detail"
                    userContent={userContent}
                />
            )}

            <Card ref={cardRef} className={"!mt-4 !pb-[2em]"}>
                <Flex justify="space-between" className="px-4 pb-2">
                    <Tabs
                        items={[
                            {
                                key: "comment",
                                label: (
                                    <>
                                        <span className={"font-bold"}>
                                            评论
                                        </span>
                                        <span
                                            className={
                                                "relative top-[-2px] ml-1 text-xs text-gray-500"
                                            }
                                        >
                                            {userContent?.commentCount ||
                                                0}{" "}
                                        </span>
                                    </>
                                ),
                            },
                        ]}
                    ></Tabs>

                    <Dropdown
                        menu={{
                            items: sortItems,
                            selectedKeys: [sortType],
                            onClick: ({ key }) => setSortType(key as SortType),
                        }}
                    >
                        <Button type="text" size="small">
                            <Space>
                                {
                                    sortItems.find(
                                        (item) => item.key === sortType,
                                    )?.label
                                }
                                <CaretDownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                </Flex>

                <List
                    className="px-4"
                    dataSource={comments}
                    loading={loading}
                    renderItem={(comment) => (
                        <List.Item className="!block !border-0 !p-0">
                            {renderComment(comment)}
                        </List.Item>
                    )}
                />
            </Card>

            <Flex
                className="fixed bottom-0 z-10 rounded-[4px] bg-white !p-4"
                align="center"
                justify="space-between"
                style={{
                    width: commentInputWidth,
                }}
            >
                <Input
                    variant="filled"
                    className="!w-2/3"
                    placeholder="写下你的评论..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onPressEnter={handleCommentSubmit}
                />
                <Button
                    type="text"
                    icon={<SendOutlined />}
                    onClick={handleCommentSubmit}
                />

                <Flex gap="middle" className="px-4">
                    <Button
                        type="text"
                        icon={
                            userContent?.isLiked ? (
                                <LikeFilled className="text-red-500" />
                            ) : (
                                <LikeOutlined />
                            )
                        }
                        loading={actionLoading.like}
                        onClick={handleLike}
                    >
                        {userContent?.likeCount || 0}
                    </Button>

                    <Button
                        type="text"
                        icon={
                            userContent?.isFavorited ? (
                                <StarFilled className="text-yellow-500" />
                            ) : (
                                <StarOutlined />
                            )
                        }
                        loading={actionLoading.favorite}
                        onClick={handleFavorite}
                    >
                        {userContent?.favoriteCount || 0}
                    </Button>

                    <Popover content={shareOptions} trigger="click">
                        <Button
                            type="text"
                            icon={<ShareAltOutlined />}
                            loading={actionLoading.share}
                            onClick={handleShare}
                        >
                            分享
                        </Button>
                    </Popover>
                </Flex>
            </Flex>
        </Flex>
    );
}
