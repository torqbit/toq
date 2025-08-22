import { Button, Card, Drawer, Flex, Form, Radio } from "antd";
import { FC, ReactNode, useState } from "react";
import { PageSiteConfig } from "@/services/siteConstant";
import { capitalize } from "@/lib/utils";
import SvgIcons from "@/components/SvgIcons";
import { useAppContext } from "@/components/ContextApi/AppContext";
import ConfigFormLayout from "../Configuration/ConfigFormLayout";
import ConfigForm from "../Configuration/ConfigForm";
import EmbedSteps from "./Playground/EmbedSteps";
import { getPlatformEmbedInstructions } from "./Playground/EmbedInstructionsMethod";

const PlatformCard: FC<{
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  handleSelect: (value: string) => void;
  selected: boolean;
}> = ({ icon, title, id, description, handleSelect, selected }) => {
  return (
    <Card
      style={{ cursor: "pointer", border: 0, borderRadius: 8, width: 400 }}
      onClick={() => {
        handleSelect(id);
      }}
      styles={{ body: { padding: 10, borderRadius: 8 } }}
      classNames={{
        body: `p-0 border-[1px]  ${!selected ? "border-[var(--border-color)]" : "border-[var(--btn-primary)]"} hover:border-[var(--btn-primary)]`,
      }}
    >
      <Flex gap={10}>
        {icon}
        <div>
          <div className="text-[0.9rem] font-[600] text-[var(--font-primary)]">{title}</div>
          <div>{description}</div>
        </div>
      </Flex>
    </Card>
  );
};

const EmbedChat: FC<{ siteConfig: PageSiteConfig; agentId: string; embedPath: string }> = ({
  siteConfig,
  agentId,
  embedPath,
}) => {
  const [selectedPlatform, setPlatform] = useState<string>();
  const [form] = Form.useForm();
  const { globalState } = useAppContext();
  const chatPosition = [
    { label: "Bottom Right", value: "bottom-right" },
    { label: "Bottom Left", value: "bottom-left" },
  ];
  const [isDrawer, setDrawer] = useState<boolean>(false);
  const iconStyle = { fontSize: 25, lineHeight: 0, color: "var(--font-secondary" };
  const [selectedPostion, setSelectedPostion] = useState<string>();
  const platformCategories = [
    {
      label: "Docs",
      children: [
        {
          id: "docusaurus",
          icon: <i style={iconStyle}>{SvgIcons.docusaurus}</i>,
          title: "Docusaurus",
          description: "A modern static site generator for documentation built with React.",
        },
        {
          id: "nextra",
          icon: <i style={iconStyle}>{SvgIcons.nextra}</i>,

          title: "Nextra",
          description: "Simple, markdown-based site generator built on Next.js.",
        },
        {
          id: "mintlify",
          icon: <i style={iconStyle}>{SvgIcons.mintlify}</i>,

          title: "Mintlify",
          description: "Developer-first documentation platform with analytics and search.",
        },
        {
          id: "readthedocs",
          icon: <i style={iconStyle}>{SvgIcons.readthedocs}</i>,
          title: "Read the Docs",
          description: "Hosted platform for building and publishing Sphinx/MkDocs docs.",
        },
      ],
    },
  ];

  return (
    <section>
      <ConfigFormLayout
        formTitle={"Embed Chat"}
        width="var(--main-content-width)"
        extraContent={
          <Button
            type="primary"
            disabled={!selectedPlatform || !selectedPostion}
            onClick={() => {
              setDrawer(true);
            }}
          >
            Show Instructions
          </Button>
        }
      >
        <Form form={form}>
          <ConfigForm
            title="Choose Position"
            description="Choose chat window position"
            divider
            input={
              <Form.Item name="position" rules={[{ required: true }]}>
                <Flex align="center" gap={10}>
                  {chatPosition.map((postion, i) => {
                    return (
                      <Radio
                        onChange={(v) => {
                          if (postion.value == selectedPostion) {
                            setSelectedPostion(undefined);
                          } else {
                            setSelectedPostion(postion.value);
                          }
                        }}
                        checked={postion.value == selectedPostion}
                        key={i}
                      >
                        {postion.label}
                      </Radio>
                    );
                  })}
                </Flex>
              </Form.Item>
            }
          />
          <ConfigForm
            title="Choose Platform"
            description="Choose a platform to embed on"
            layout="vertical"
            input={
              <Flex vertical gap={20}>
                {platformCategories.map((c, i) => {
                  return (
                    <Flex vertical gap={10} key={i}>
                      <div className="text-[1rem] font-[600] text-[var(--font-primary)]">{c.label}</div>
                      <div className="grid grid-cols-2 w-fit gap-[20px]">
                        {c.children.map((children, i) => {
                          return (
                            <PlatformCard
                              key={i}
                              id={children.id}
                              icon={children.icon}
                              title={children.title}
                              description={children.description}
                              handleSelect={() => {
                                if (children.id == selectedPlatform) {
                                  setPlatform(undefined);
                                } else {
                                  setPlatform(children.id);
                                }
                              }}
                              selected={children.id == selectedPlatform}
                            />
                          );
                        })}
                      </div>
                    </Flex>
                  );
                })}
              </Flex>
            }
          />
        </Form>
      </ConfigFormLayout>
      <Drawer
        title={<h4 style={{ marginBottom: 0 }}>Embeding Instructions for {capitalize(`${selectedPlatform}`)}</h4>}
        width={850}
        open={isDrawer}
        onClose={() => setDrawer(false)}
      >
        <EmbedSteps
          steps={getPlatformEmbedInstructions({
            agentId: agentId,
            position: `${selectedPostion}`,
            platform: `${selectedPlatform}`,
            embedPath: embedPath,
          })}
        />
      </Drawer>
    </section>
  );
};

export default EmbedChat;
