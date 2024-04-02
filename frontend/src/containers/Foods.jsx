import React, { Fragment, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";




import { LocalMallIcon } from "../components/Icons";
import { FoodWrapper } from "../components/FoodWrapper";
import { FoodOrderDialog } from "../components/FoodOrderDialog";
import { NewOrderConfirmDialog } from "../components/NewOrderConfirmDialog";
import Skeleton from "@mui/material/Skeleton";

// reducers
import {
  initialState as foodsInitialState, //initialStateの変数名は別で使うため別名を定義
  foodsActionTyps,
  foodsReducer,
} from "../reducers/foods";

// apis
import { fetchFoods } from "../apis/foods";
import { postLineFoods, replaceLineFoods } from "../apis/line_foods";

// images
import MainLogo from "../images/logo.png";
import FoodImage from "../images/food-image.jpg";

// constants
import { COLORS } from "../style_constants";
import { REQUEST_STATE } from "../constants";
import { HTTP_STATUS_CODE } from "../constants";

//justify-content: space-between; で要素が左右端に並ぶ
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 32px;
`;

const BagIconWrapper = styled.div`
  padding-top: 24px;
`;

const ColoredBagIcon = styled(LocalMallIcon)`
  color: ${COLORS.MAIN};
`;

const MainLogoImage = styled.img`
  height: 90px;
`;

const FoodsList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;

const ItemWrapper = styled.div`
  margin: 16px;
`;

const submitOrder = () => {
  // 後ほど仮注文のAPIを実装します
  console.log("登録ボタンが押された！");
};

// export const Foods = ({
//   match
// }) => {

//   useEffect(() => {
//     fetchFoods(match.params.restaurantsId)
//     .then((data) =>
//       console.log(data)
//     )
//   }, [])

export const Foods = () => {
  const navigation = useNavigate();

  const { restaurantsId } = useParams(); //URLの:restaurantsIdパラメータにアクセス

  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState);

  const initialState = {
    isOpenOrderDialog: false,
    selectedFood: null,
    selectedFoodCount: 1,
    isOpenNewOrderDialog: false,
    existingResutaurautName: "",
    newResutaurautName: "",
  };
  const [state, setState] = useState(initialState);

  useEffect(() => {
    dispatch({ type: foodsActionTyps.FETCHING });
    fetchFoods(restaurantsId).then((data) => {
      dispatch({
        type: foodsActionTyps.FETCH_SUCCESS,
        payload: {
          foods: data.foods,
        },
      });
    });
  }, []);

  //注文情報を送った後に注文ページへ遷移
  const submitOrder = () => {
    postLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    })
      .then(() => navigation("/orders")) ///ordersページ、つまり注文ページOrders.jsxへとルーティング
      .catch((e) => {
        if (e.response.status === HTTP_STATUS_CODE.NOT_ACCEPTABLE) { //別の店舗情報があればNewOrderDialogを表示
          setState({
            ...state,
            isOpenOrderDialog: false,
            isOpenNewOrderDialog: true,
            existingResutaurautName: e.response.data.existing_restaurant,
            newResutaurautName: e.response.data.new_restaurant,
          });
        } else {
          throw e;
        }
      });
  };

  //注文を置き換える
  const replaceOrder = () => {
    replaceLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    }).then(() => navigation("/orders"));
  };

  return (
    <Fragment>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
        <BagIconWrapper>
          <Link to="/orders">
            <ColoredBagIcon fontSize="large" />
          </Link>
        </BagIconWrapper>
      </HeaderWrapper>
      <FoodsList>
        {foodsState.fetchState === REQUEST_STATE.LOADING ? (
          <Fragment>
            {[...Array(12).keys()].map((i) => (
              <ItemWrapper key={i}>
                <Skeleton key={i} variant="rect" width={450} height={180} />
              </ItemWrapper>
            ))}
          </Fragment>
        ) : (
          foodsState.foodsList.map((food) => (
            <ItemWrapper key={food.id}>
              <FoodWrapper
                food={food}
                onClickFoodWrapper={(
                  food //クリックされたら実行
                ) =>
                  setState({
                    ...state,
                    isOpenOrderDialog: true,
                    selectedFood: food,
                  })
                }
                imageUrl={FoodImage}
              />
            </ItemWrapper>
          ))
        )}
      </FoodsList>
      {state.isOpenOrderDialog && ( //&&より前の値がtrueの場合に、&&よりあとの要素をレンダリング
        <FoodOrderDialog
          isOpen={state.isOpenOrderDialog}
          food={state.selectedFood}
          countNumber={state.selectedFoodCount}
          onClickCountUp={() =>
            setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount + 1,
            })
          }
          onClickCountDown={() =>
            setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount - 1,
            })
          }
          // 先ほど作った関数を渡します
          onClickOrder={() => submitOrder()}
          // モーダルを閉じる時はすべてのstateを初期化する
          onClose={() =>
            setState({
              ...state,
              isOpenOrderDialog: false,
              selectedFood: null,
              selectedFoodCount: 1,
            })
          }
        />
      )}

      {state.isOpenNewOrderDialog && (
          <NewOrderConfirmDialog
            isOpen={state.isOpenNewOrderDialog}
            onClose={() => setState({ ...state, isOpenNewOrderDialog: false })}
            existingResutaurautName={state.existingResutaurautName}
            newResutaurautName={state.newResutaurautName}
            onClickSubmit={() => replaceOrder()} //クリックしたら注文変更の関数が実行
          />
      )}
    </Fragment>
  );
};
