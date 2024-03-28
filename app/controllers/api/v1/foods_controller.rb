module Api
  module V1
    class FoodsController < ApplicationController
      def index
        # リクエスト時にparams[:restaurant_id]というパラメーターを受け取る
        restaurant = Restaurant.find(params[:restaurant_id])
        foods = restaurant.foods

        render json: {
          foods: foods
        }, status: :ok
      end
    end
  end
end
