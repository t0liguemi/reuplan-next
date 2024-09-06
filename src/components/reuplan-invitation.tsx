import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface ReuplanInvitationProps {
  username?: string;
  userImage?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  invitedByImage?: string;
  inviteLink?: string;
  eventName?: string;
}

export const ReuPlanInvitationMail = ({
  username,
  userImage,
  invitedByUsername,
  invitedByEmail,
  invitedByImage,
  inviteLink,
  eventName,
}: ReuplanInvitationProps) => {
  const previewText = `Invitation to event: "${eventName}"`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-[#FFFFFF] px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={"https://res.cloudinary.com/dr3bsn93t/image/upload/v1725614906/logo_foiedc.png"}
                width="40"
                height="auto"
                alt="Reuplan"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              You have been invited, <strong>{username}</strong>!
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {username}, this is an automated message from ReuPlan.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to the event <strong>{eventName}</strong> on{" "}
              <strong>Reuplan</strong>.
            </Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={userImage}
                    width="64"
                    height="64"
                  />
                </Column>
                <Column align="center">
                  <Img
                      src={"https://res.cloudinary.com/dr3bsn93t/image/upload/v1725614420/vercel-arrow_jm29j5.png"}
                      width="12"
                      height="9"
                      alt="invited you to"
                    />

                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={invitedByImage}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#FA9519] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={inviteLink}
              >
                Join the event!
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for{" "}
              <span className="text-black">{username}</span>. If you were not
              expecting emails from <span className="text-black">ReuPlan</span>,
              you can ignore this email. If you are concerned about your
              email&apos;s safety, please use our contact form as soon as
              possible.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ReuPlanInvitationMail;
