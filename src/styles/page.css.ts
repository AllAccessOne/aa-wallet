import styled from "styled-components";
export const Page = styled.div``;
export const TitlePage = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xxxl + "px"};
  font-weight: ${({ theme }) => theme.fontWeights.semiBold};
  color: ${({ theme }) => theme.colors.brands.blue400};
  line-height: 39px;
`;
