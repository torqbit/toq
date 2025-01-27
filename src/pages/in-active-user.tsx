import React from "react";
import { Button, Result, Space } from "antd";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const InActiveErrorPage = (props: any) => {
  const { data: session } = useSession();
  const router = useRouter();
  React.useEffect(() => {
    if (session && session?.isActive) {
      router.push("/academy");
    }
  }, [session]);

  return (
    <div className="in-active-user-page">
      <Result
        status="warning"
        title="Sorry you are no longer active user"
        extra={
          <Space>
            <Button
              type="primary"
              onClick={() => {
                signOut({ callbackUrl: "/" });
              }}
            >
              Go Back
            </Button>

            <Button type="default" onClick={() => signOut({ callbackUrl: "/" })}>
              SignOut
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default InActiveErrorPage;
