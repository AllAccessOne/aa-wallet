import React from "react";
import styled from "styled-components";
import MenuItem from "@mui/material/MenuItem";
import ButtonCustom from "../Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { listNetWorks } from "../../configs/data/menu";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
const breakpoint = createBreakpoint(base.breakpoints);
import { Dropdown } from "../../assets/icon";
import { sliceAddress, copyAddress } from "../../utils";

export const NetworkContainer = () => {
  const [network, setNetwork] = React.useState("Ethereum Mainnet");

  const handleChange = (event: any) => {
    setNetwork(event.target.value);
  };
  const myAdress = "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe";
  return (
    <Container>
      <ButtonCustom onClick={() => copyAddress(myAdress)} width='40%' height='40px' styleButton='style' padding='8px 12px' gap='10px' fontSize='14px' text={sliceAddress(myAdress)} />
      <FormControlCustom>
        <SelectCustom IconComponent={() => <Dropdown style={{ marginRight: "10px" }} />} value={network} onChange={handleChange}>
          {listNetWorks.map(network => (
            <MenuItemCustom key={network.chainID} value={network.description}>
              <p>{network.description}</p>
            </MenuItemCustom>
          ))}
        </SelectCustom>
      </FormControlCustom>
    </Container>
  );
};

const FormControlCustom = styled(FormControl)`
  background-color: #4a5568;
  ${breakpoint("xs")`
       width: 50% !important;

      `}
  ${breakpoint("sm")`
       width: 250px !important;
    `}
  border-radius: 8px !important;
  height: 40px !important;
  margin-left: 10px !important;
  box-sizing: border-box;
`;

const SelectCustom = styled(Select)`
  height: 40px !important;
  border-radius: 8px;
  color: #fff !important;
  font-family: "Inter" !important;
  font-style: normal !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  line-height: 24px !important;
  &:hover {
    border-radius: 8px !important;
  }
  box-sizing: border-box;
  border-radius: 8px !important;
  .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input {
    border-radius: 8px !important;
  }
`;
const Container = styled.div`
  ${breakpoint("xs")`
      margin: 10px 10px
      `}
  ${breakpoint("sm")`
       margin: 44px 35px;
    `}
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const MenuItemCustom = styled(MenuItem)`
  height: 50px;
`;
