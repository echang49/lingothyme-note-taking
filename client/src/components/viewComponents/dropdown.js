import React from "react";
import {
  DropdownWrapper,
  StyledSelect,
  StyledOption,
} from "./styles.js";

export function Dropdown(props) {
  return (
    <DropdownWrapper action={props.action} onChange={props.onChange}>
      {/* <StyledLabel htmlFor="dropdown">{props.formLabel}</StyledLabel> */}
      <StyledSelect id="dropdown" name="dropdown">
        {props.children}
      </StyledSelect>
      {/* <StyledButton type="submit" value={props.buttonText} /> */}
    </DropdownWrapper>
  );
}

export function Option(props) {
  return <StyledOption selected={props.selected}>{props.value}</StyledOption>;
}
