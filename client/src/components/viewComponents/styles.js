import styled from "styled-components";

// export const DropdownWrapper = styled.form`
//   display: flex;
//   align-self: end;
//   flex-flow: column;
//   margin-top: 5px;
//   justify-content: flex-start;
// `;

export const DropdownWrapper = styled.div`
  display: flex;
  align-self: end;
  flex-flow: column;
  margin-top: 8px;
  justify-content: flex-start;
`;

export const StyledSelect = styled.select`
  max-width: 100%;
  height: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

export const StyledOption = styled.option`
  color: ${(props) => (props.selected ? "lightgrey" : "black")};
`;

export const StyledLabel = styled.label`
  margin-bottom: 1rem;
`;