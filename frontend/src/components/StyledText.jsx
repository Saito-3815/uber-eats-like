// 複数コンポーネントから共通で使われる「styled-componentsで定義したテキストスタイル」を定義
import styled from 'styled-components';
import { COLORS, FONT_SIZE } from '../style_constants';

export const SubText = styled.p`
  color: ${COLORS.SUB_TEXT};
  font-size: ${FONT_SIZE.BODY2};
`;