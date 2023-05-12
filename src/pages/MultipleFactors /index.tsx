import styled from "styled-components";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
import { Devices } from "../../configs/data/test";
import { Computer } from "../../assets/icon";
import { TextBlue } from "../Overview/overview.css";
import CustomTextInput from "../../components/TextField";
const breakpoint = createBreakpoint(base.breakpoints);

const MultipleFactors = () => {
  return (
    <ContainerMultipleFactors>
      <HeaderText>Verify your login</HeaderText>
      <SubHeaderText>Verify with one of the following to access your account</SubHeaderText>
      <ContainerBackgroundCard>
        <TextHeaderCard>Device (s)</TextHeaderCard>
        <SubHeaderText>
          Login to <strong>allaccess.one</strong> from any of the following devices to complete the security verification.
        </SubHeaderText>
        {Devices.map(device => (
          <ConatainerDevice>
            <GroupLeftItemDevice>
              <Computer />
              <ContainerText>
                <NameText> {device.name}</NameText>
                <IpText>IP: {device.ip}</IpText>
              </ContainerText>
            </GroupLeftItemDevice>
            <NameText>Reference ID: {device.id}</NameText>
          </ConatainerDevice>
        ))}
      </ContainerBackgroundCard>
      <ContainerBackgroundCard>
        <TextHeaderCard>Backup Passphrase</TextHeaderCard>
        <SubHeaderText>Make sure you have your 24 words recovery phrase, then click below to begin the recovery process.</SubHeaderText>
        <TextBlue>Passphrase (24 words)</TextBlue>
        <CustomTextInput fullWidth size='small' styleTextField='default' placeholder='correct horse batterry ...'></CustomTextInput>
      </ContainerBackgroundCard>
    </ContainerMultipleFactors>
  );
};

export default MultipleFactors;

export const ContainerMultipleFactors = styled.div`
  text-align: center;
  align-items: center;
  margin-top: 5vh;
`;
export const HeaderText = styled.div`
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  color: ${props => props.theme.colors.neutrals.gray1000};
`;
export const SubHeaderText = styled.div`
  margin-top: 20px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${props => props.theme.colors.neutrals.gray600};
`;
export const NameText = styled.div`
  ${breakpoint("xs")`
        font-weight: 400px;
        font-size: 13px;
    `}
  ${breakpoint("sm")`
        font-weight: 400px;
        font-size: 16px;
    `}
`;
export const IpText = styled.div`
  font-weight: 400;

  color: ${props => props.theme.colors.neutrals.gray500};
  ${breakpoint("xs")`
        font-size: 10px;
    `}
  ${breakpoint("sm")`
        font-size: 12px;
    `}
`;
export const TextHeaderCard = styled.div`
  color: ${props => props.theme.colors.neutrals.gray800};
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
`;
export const ContainerBackgroundCard = styled.div`
  border-radius: 8px;
  padding: 32px;
  text-align: left;
  border: 2px solid ${props => props.theme.colors.neutrals.gray200};
  ${breakpoint("xs")`
        margin-left: auto;
        margin-right: auto;
        width: 80%;
    `}
  ${breakpoint("sm")`
        width: 60%;
    `}
     ${breakpoint("md")`
        width: 50%;
    `}
     ${breakpoint("lg")`
        width: 35%;
    `}
    margin-top: 5vh;
`;
export const ConatainerDevice = styled.div`
  padding: 10px 10px;
  border-radius: 8px;
  border: 2px solid ${props => props.theme.colors.neutrals.gray200};
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const ContainerText = styled.div`
  margin-left: 10px;
`;
export const GroupLeftItemDevice = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
