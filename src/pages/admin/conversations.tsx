import ConversationService, { IConversationList } from "@/services/ConversationService";
import { truncateString } from "@/services/helper";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Divider, Flex, Input, message } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "@/styles/Conversation.module.scss";

import ConversationCard from "@/components/Conversation/ConversationCard";
import SvgIcons from "@/components/SvgIcons";
import { IConversationData } from "../api/v1/conversation/list";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";
import AppLayout from "@/components/Layouts/AppLayout";

const ConversationPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const { data: user } = useSession();
  const [comment, setComment] = useState<string>("");
  const [allList, setAllList] = useState<IConversationList[]>();
  const [selectedList, setSelectedList] = useState<IConversationData[]>();
  const [conversationLoading, setConversationLoading] = useState<{
    postLoading: boolean;
    replyLoading: boolean;
  }>({
    postLoading: false,
    replyLoading: false,
  });

  const onSelectConversation = (conversationId: number) => {
    ConversationService.getAllConversationById(
      conversationId,
      (result) => {
        setSelectedList(result.comments);
      },
      (error) => {
        message.error(error);
      }
    );
  };

  const onPost = () => {
    setConversationLoading({ postLoading: true, replyLoading: false });
    if (comment) {
      let id = selectedList && selectedList[0].id;
      ConversationService.addConversation(
        String(comment),
        id,
        (result) => {
          result.conversation.parentConversationId
            ? onSelectConversation(Number(result.conversation.parentConversationId))
            : onSelectConversation(result.conversation.id);
          message.success(result.message);
          setComment("");
          setConversationLoading({ postLoading: false, replyLoading: false });
        },
        (error) => {
          message.error(error);
          setConversationLoading({ postLoading: false, replyLoading: false });
        }
      );
    } else {
      message.warning("Type a comment first");
      setConversationLoading({ postLoading: false, replyLoading: false });
    }
  };

  useEffect(() => {
    ConversationService.getAllParentConversation(
      (result) => {
        setAllList(result.conversationList);
        onSelectConversation(result.conversationList[0].id);
      },
      (error) => {
        message.error(error);
      }
    );
  }, []);

  return (
    <AppLayout siteConfig={siteConfig}>
      <Flex className={styles.conversationPageWrapper}>
        <div>
          <div className={styles.selectedListWrapper}>
            {selectedList?.map((list, i) => {
              return (
                <ConversationCard
                  name={list?.name}
                  image={list?.image}
                  comment={list?.comments}
                  user={String(user?.id)}
                  commentUser={list?.authorId}
                  key={i}
                  contentWidth={"500px"}
                />
              );
            })}
          </div>

          <Flex align="center" className={styles.commentInputWrapper}>
            {" "}
            <Input.TextArea
              style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,

                borderBottomLeftRadius: 8,
              }}
              placeholder="Add comment"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  // onEdit(id, editComment);
                }
              }}
              value={comment}
              className={styles.add_conversation_input}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <button className={styles.postBtn} onClick={() => onPost()}>
              <i>{SvgIcons.send}</i>
            </button>
          </Flex>
        </div>
        <div>
          <Flex align="center" justify="space-between" className={styles.refreshWrapper}>
            <div>Converation</div>
            <i
              onClick={() => {
                selectedList && onSelectConversation(selectedList[0].id);
                message.success("Refreshed");
              }}
            >
              {SvgIcons.refresh}
            </i>
          </Flex>
          {allList &&
            allList.map((list, i) => {
              return (
                <div
                  key={i}
                  className={
                    selectedList && selectedList[0].id === list.id
                      ? styles.activeConveration
                      : styles.inActiveConversation
                  }
                >
                  <span></span>
                  <Flex
                    align="center"
                    gap={10}
                    className={styles.listWrapper}
                    onClick={() => onSelectConversation(list.id)}
                  >
                    <Badge
                      color="blue"
                      classNames={{ indicator: styles.badgeIndicator }}
                      showZero={false}
                      dot={!list.isView}
                      style={{ fontSize: 10, paddingTop: 1.5 }}
                      size="small"
                    >
                      <Avatar size={40} src={list.user.image} icon={<UserOutlined />} alt="Profile" />
                    </Badge>

                    <div>
                      <h1>{list.user.name}</h1>
                      <p>{truncateString(String(list.comment), 50)}</p>
                    </div>
                  </Flex>
                </div>
              );
            })}
        </div>
      </Flex>
    </AppLayout>
  );
};
export default ConversationPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};
