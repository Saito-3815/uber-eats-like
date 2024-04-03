import React, { Fragment, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";

// components
import { OrderDetailItem } from '../components/OrderDetailItem';
import { OrderButton } from '../components/Buttons/OrderButton';
import CircularProgress from '@mui/material/CircularProgress';

import { fetchLineFoods } from '../apis/line_foods';
import { postOrder } from '../apis/orders';

// reducers
import {
  initialState,
  lineFoodsActionTyps,
  lineFoodsReducer,
} from '../reducers/lineFoods';

// images
import MainLogo from '../images/logo.png';

// constants
import { REQUEST_STATE } from '../constants';

import {
  HeaderWrapper,
  MainLogoImage
} from '../components/StyledHeader.jsx';

// const HeaderWrapper = styled.div`
//   display: flex;
//   justify-content: flex-start;
//   padding: 8px 32px;
// `;

// const MainLogoImage = styled.img`
//   height: 90px;
// `;

const OrderListWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const OrderItemWrapper = styled.div`
  margin-bottom: 50px;
`;


export const Orders = () => {

  const [state, dispatch] = useReducer(lineFoodsReducer, initialState);

  useEffect(() => {
    dispatch({ type: lineFoodsActionTyps.FETCHING });
    fetchLineFoods() //仮注文情報を取得
      .then((data) =>
        dispatch({
          type: lineFoodsActionTyps.FETCH_SUCCESS,
          payload: {
            lineFoodsSummary: data
          }
        })
      )
      .catch((e) => console.error(e)); // (2) api/line_foodsのthrowからcatchに入る
  }, []);


  const postLineFoods = () => {
    dispatch({ type: lineFoodsActionTyps.POSTING });
    postOrder({
      line_food_ids: state.lineFoodsSummary.line_food_ids, //取得した仮注文データ
    }).then(() => {
      dispatch({ type: lineFoodsActionTyps.POST_SUCCESS });
      window.location.reload();
    });
  };
  
  
  const orderButtonLabel = () => {
    switch (state.postState) {
      case REQUEST_STATE.LOADING:
        return '注文中...';
      case REQUEST_STATE.OK:
        return '注文が完了しました！';
      default:
        return '注文を確定する';
    }
  };

  const isExistsLineFoodsSummary = () => (
    state.fetchState === REQUEST_STATE.OK && state.lineFoodsSummary
  )
  
  return (
    <Fragment>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
      </HeaderWrapper>
      <OrderListWrapper>
          <div>
            <OrderItemWrapper>
              {
                // APIローディング中はくるくる回るローディングコンポーネントを表示
                state.fetchState === REQUEST_STATE.LOADING ?
                  <CircularProgress />
                :
                  state.lineFoodsSummary &&
                    <OrderDetailItem
                      restaurantFee={state.lineFoodsSummary.restaurant.fee}
                      restaurantName={state.lineFoodsSummary.restaurant.name}
                      restaurantId={state.lineFoodsSummary.restaurant.id}
                      timeRequired={state.lineFoodsSummary.restaurant.time_required}
                      foodCount={state.lineFoodsSummary.count}
                      price={state.lineFoodsSummary.amount}
                    />
              }
            </OrderItemWrapper>
          <div>
            {
              isExistsLineFoodsSummary() &&
              // state.fetchState === REQUEST_STATE.OK && state.lineFoodsSummary &&
                <OrderButton
                  onClick={() => postLineFoods()}
                  // APIを呼んでいるor成功した場合にはボタンをdisabledに
                  disabled={state.postState === REQUEST_STATE.LOADING || state.postState === REQUEST_STATE.OK}
                >
                  {orderButtonLabel()}
                </OrderButton>
            }
            {
              state.fetchState === REQUEST_STATE.OK && !(state.lineFoodsSummary) &&
                <p>
                  注文予定の商品はありません。
                </p>
            }
          </div>
        </div>
      </OrderListWrapper>
    </Fragment>
  )
}