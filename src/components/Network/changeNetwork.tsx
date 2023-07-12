import React from "react";
import styled from "styled-components";
import { sliceAddress } from "../../utils";
import { Move } from "../../assets/icon";
type Props = {
  text1: string;
  text2: string;
};
import { breakpoint } from "../../utils";

const OldAddress = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  gap: 10px;
  width: 150px;
  position: absolute;
  height: 36px;
  top: 0;
  margin-top: 50px;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffeeef;
  border-radius: 8px;
  color: #fc6168;
`;

const NewAddress = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  gap: 10px;
  width: 150px;
  position: absolute;
  height: 36px;
  top: 0;
  margin-top: 86px;
  left: 57%;
  transform: translate(-50%, -50%);
  background: #c5f6e2;
  border-radius: 8px;
  color: #0d6b58;
`;
const MoveContainer = styled.div`
  position: absolute;
  top: 0;
  margin-top: 86px;
  transform: translate(-50%, -50%);
  z-index: 9;
  ${breakpoint("xs")`
       width: 50% !important;
       left: 26%;
      `}
  ${breakpoint("sm")`
        left: 44%;
    `}
`;
const ContainerDiv = styled.div`
  position: relative;
  height: 150px;
  width: 100%;
`;
const TagChangeNetwork: React.FC<Props> = (props: Props) => {
  return (
    <ContainerDiv>
      <OldAddress>{sliceAddress(props.text1)}</OldAddress>
      <MoveContainer>
        <Move />
      </MoveContainer>
      <NewAddress>{sliceAddress(props.text2)}</NewAddress>
    </ContainerDiv>
  );
};

export default TagChangeNetwork;
