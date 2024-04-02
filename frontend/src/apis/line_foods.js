//モーダルから注文情報をAPIへ送る
import axios from 'axios';
import { lineFoods, lineFoodsReplace } from '../urls/index'

//仮注文を作る
export const postLineFoods =(params) => {
  return axios.post(lineFoods,
    {
      food_id: params.foodId,
      count: params.count,
    }
  )
  .then(res => {
    return res.data
  })
  .catch((e) => { throw e; })
};

//仮注文を置き換える’
export const replaceLineFoods = (params) => {
  return axios.put(lineFoodsReplace, //linefoodを新たなリクエストparamsで置き換える
    {
      food_id: params.foodId,
      count: params.count,
    }
  )
  .then(res => {
    return res.data
  })
  .catch((e) => { throw e; }) // (1) throwされたeはOrder.jsxのcatchへ
};

//仮注文情報を取得する
export const fetchLineFoods = () => {
  return axios.get(lineFoods)
  .then(res => {
    return res.data
  })
  .catch((e) => { throw e; })
};
