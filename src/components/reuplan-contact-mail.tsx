import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Tailwind,
  } from "@react-email/components";
  import * as React from "react";
  
  interface ReuplanInvitationProps {
    name: string;
    message: string;
    email: string;
  }
  
  export const ReuplanContactMail = ({
name,
message,
email
  }: ReuplanInvitationProps) => {
    const previewText = `Reuplan: Issue from ${name}`;
  
    return (
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Tailwind>
          <Body className="mx-auto my-auto bg-[#FFFFFF] px-2 font-sans">
            <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">

              <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
                User <strong>{name}</strong> ({email}) has contacted Reuplan!
              </Heading>
              <Text className="text-[14px] leading-[24px] text-black">
                {message}
              </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  
  export default ReuplanContactMail;
  