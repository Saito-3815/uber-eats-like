import React, { Fragment, useEffect, useReducer } from 'react';

import { fetchLineFoods } from '../apis/line_foods';

// reducers
import {
  initialState,
  lineFoodsActionTyps,
  lineFoodsReducer,
} from '../reducers/lineFoods';

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

  return (
    <Fragment>
      注文画面
    </Fragment>
  )
}