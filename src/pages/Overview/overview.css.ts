import styled from "styled-components";

export const HeaderPageContainer = styled.div`
  margin: 44px 35px;
`;
export const SubHeaderPage = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: ${({ theme }) => theme.fontSizes.xs + "px"};
  line-height: 24px;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.neutrals.gray600};
`;

export const BalanceContainer = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semiBold};
  font-size: ${({ theme }) => theme.fontSizes.xl + "px"};
  display: flex;
  justify-content: left;
  align-items: center;
`;
export const TextBlue = styled.p`
  color: ${({ theme }) => theme.colors.brands.blue400};
  margin-right: 10px;
`;
export const Divider = styled.hr`
  background-color: ${({ theme }) => theme.colors.neutrals.gray400};
  border-width: 0;
  height: 1px;
  width: 100%;
`;
