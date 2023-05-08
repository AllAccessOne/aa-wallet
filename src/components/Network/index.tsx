import React from "react";
import styled from "styled-components";
import MenuItem from "@mui/material/MenuItem";
import ButtonCustom from "../Button";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { listNetWorks } from "../../configs/data/menu";
export const NetworkContainer = () => {
  const [network, setNetwork] = React.useState("Ethereum Mainnet");

  const handleChange = (event: any) => {
    setNetwork(event.target.value);
  };

  return (
    <Container>
      <ButtonCustom width='137px' height='40px' styleButton='style' padding='8px 12px' gap='10px' fontSize='14px' text='0x15375...b080f' />
      <FormControlCustom>
        <SelectCustom labelId='demo-simple-select-label' id='demo-simple-select' value={network} onChange={handleChange}>
          {listNetWorks.map(network => (
            <MenuItemCustom value={network.description}>
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
  width: 250px !important;
  border-radius: 8px !important;
  height: 40px !important;
  margin-left: 15px !important;
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
`;
const Container = styled.div`
  margin: 44px 35px;
  display: flex;
  justify-content: right;
  align-items: center;
`;
const MenuItemCustom = styled(MenuItem)`
  height: 50px;
`;
