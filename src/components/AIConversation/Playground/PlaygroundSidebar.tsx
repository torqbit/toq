import React, { FC, useEffect, useState } from "react";
import { Affix, Button, Divider, Flex, Form, FormInstance, Input, message, Select, Slider, Tag } from "antd";

import { PageSiteConfig } from "@/services/siteConstant";
import { capitalize, compareObject } from "@/lib/utils";

import { aiAgent } from "@prisma/client";
import SupportClientService from "@/services/client/tenant/SupportClientService";
import appConstant from "@/services/appConstant";
import { AgentResonse } from "@/pages/ai-assistant/[agentId]";

const PlaygroundSidebar: FC<{
  siteConfig: PageSiteConfig;
  setName: (value: string) => void;
  form: FormInstance;
  agent?: AgentResonse;
}> = ({ siteConfig, form, setName, agent }) => {
  const [tempValue, setTempValue] = useState<number>(agent?.temperature || 0.1);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextMessageHolder] = message.useMessage();
  const { TextArea } = Input;
  useEffect(() => {
    if (agent?.temperature) {
      setTempValue(agent.temperature);
    }
  }, [agent?.temperature]);
  const updateAiAgent = () => {
    try {
      setLoading(true);

      SupportClientService.updateAiAgent(
        { ...form.getFieldsValue(), temperature: tempValue, agentId: agent?.id },
        (result) => {
          messageApi.success(result);
          setLoading(false);
        },
        (error) => {
          messageApi.error(error);
          setLoading(false);
        }
      );
    } catch (error) {
      messageApi.error(`${error}`);
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={updateAiAgent}
      style={{
        height: "100%",
        backgroundColor: "var(--bg-primary)",
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
      }}
    >
      {contextMessageHolder}
      <div style={{ padding: 20, width: 320 }}>
        <Button loading={loading} style={{ width: "100%" }} onClick={() => form.submit()} type="primary">
          Save to agent
        </Button>
        <Divider style={{ width: "100%", margin: " 0 px 0px 10px 0" }} />
        <Flex style={{ width: "100%" }} vertical gap={10}>
          <Form.Item name={"name"} label="Assistant Name">
            <Input placeholder="Add a name" onChange={(v) => setName(v.currentTarget.value)} />
          </Form.Item>
        </Flex>
        <Divider style={{ width: "100%", margin: " 0 px 0px 10px 0" }} />

        <Flex style={{ width: "100%" }} vertical gap={10}>
          <Form.Item label="Model" name={"model"}>
            <Select style={{ width: "100%" }} placeholder="Select a model" onSelect={() => {}}>
              {appConstant.availableModels.map((c, i) => {
                return (
                  <Select.Option key={i} value={`${c}`}>
                    {c}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Flex>
        <Divider style={{ width: "100%", margin: " 0 px 0px 10px 0" }} />
        <Flex style={{ width: "100%" }} vertical gap={5}>
          <div>
            <Form.Item name={"temperature"}>
              <Flex align="center" style={{ width: "100%" }} justify="space-between">
                <div>Temperature</div>
                <div>{tempValue} </div>
              </Flex>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={tempValue}
                onChange={(v) => {
                  setTempValue(v);
                }}
                tooltip={{ formatter: (val) => (val ? val.toFixed(1) : 0) }}
              />
              <Flex align="center" style={{ width: "100%", marginTop: -10 }} justify="space-between">
                <div style={{ fontSize: 12 }}>Reserved</div>
                <div style={{ fontSize: 12 }}>Creative </div>
              </Flex>
            </Form.Item>
          </div>
        </Flex>
        <Divider style={{ width: "100%", margin: " 0 px 0px 10px 0" }} />
        <Flex vertical gap={10}>
          <Form.Item label="Assistant Instructions" name="agentPrompt">
            <TextArea placeholder="Add instructions for your Ai agent" rows={6} />
          </Form.Item>
        </Flex>
      </div>
    </Form>
  );
};
export default PlaygroundSidebar;
