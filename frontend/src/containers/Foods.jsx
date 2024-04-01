import React, { Fragment, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { LocalMallIcon } from "../components/Icons";
import { FoodWrapper } from "../components/FoodWrapper";
import Skeleton from "@mui/material/Skeleton";

// reducers
import {
  initialState as foodsInitialState, //initialStateの変数名は別で使うため別名を定義
  foodsActionTyps,
  foodsReducer,
} from "../reducers/foods";

// apis
import { fetchFoods } from "../apis/foods";
import { useParams } from "react-router-dom";

// images
import MainLogo from "../images/logo.png";
import FoodImage from "../images/food-image.jpg";

// constants
import { COLORS } from "../style_constants";
import { REQUEST_STATE } from "../constants";

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
  const { restaurantsId } = useParams(); //URLの:restaurantsIdパラメータにアクセス

  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState);

  const initialState = {
    isOpenOrderDialog: false,
    selectedFood: null,
    selectedFoodCount: 1,
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
          foodsState.foodsList.map(
            (
              food 
            ) => (
              <ItemWrapper key={food.id}>
                <FoodWrapper
                  food={food}
                  onClickFoodWrapper={(food) =>
                    setState({
                      ...state,
                      isOpenOrderDialog: true,
                      selectedFood: food,
                    })
                  }
                  imageUrl={FoodImage}
                />
              </ItemWrapper>
            )
          )
        )}
      </FoodsList>
    </Fragment>
  );
};
