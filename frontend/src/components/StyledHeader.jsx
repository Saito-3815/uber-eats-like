// ヘッダーの共通スタイル

import styled from 'styled-components';

//justify-content: space-between; で要素が左右端に並ぶ
export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 32px;
`;

export const MainLogoImage = styled.img`
  height: 90px;
`