module Api
  module V1
    class LineFoodsController < ApplicationController
      before_action :set_food, only: %i[create replace]


      def index
        line_foods = LineFood.active
        # 仮注文情報を一つにまとめる

        # map,sum,sumとn個に３回繰り返し処理をしている
        # if line_foods.exists?
        #   render json: {
        #     line_food_ids: line_foods.map { |line_food| line_food.id },
        #     restaurant: line_foods[0].restaurant,
        #     count: line_foods.sum { |line_food| line_food[:count] },
        #     amount: line_foods.sum { |line_food| line_food.total_amount },
        #   }, status: :ok

        # 上のリファクタリング
        # コードは長いがデータベースは高速化
        if line_foods.exists?
          line_food_ids = []
          count = 0
          amount = 0

          line_foods.each do |line_food|
            line_food_ids << line_food.id # (1) idを参照して配列に追加する
            count += line_food[:count] # (2)countのデータを合算する
            amount += line_food.total_amount # (3)total_amountを合算する
          end

          render json: {
            line_food_ids: line_food_ids,
            restaurant: line_foods[0].restaurant,
            count: count,
            amount: amount,
          }, status: :ok
        else
          render json: {}, status: :no_content
        end
      end


      def create
        # 複数のscope(active、other_restaurant)を組み合わせて「他店舗でアクティブなLineFood」を取得
        # 存在するかどうか？をexists?で判断
        if LineFood.active.other_restaurant(@ordered_food.restaurant.id).exists?
          return render json: {
            existing_restaurant: LineFood.other_restaurant(@ordered_food.restaurant.id).first.restaurant.name,
            new_restaurant: Food.find(params[:food_id]).restaurant.name,
          }, status: :not_acceptable
        end

        set_line_food(@ordered_food)

        if @line_food.save
          render json: {
            line_food: @line_food
          }, status: :created
        else
          render json: {}, status: :internal_server_error
        end
      end

      # 仮注文を別店舗の仮注文に置き換える
      def replace
        # 他店舗のLineFood一つずつに対してupdate_attributeで更新
        LineFood.active.other_restaurant(@ordered_food.restaurant.id).each do |line_food|
          line_food.update_attribute(:active, false)
        end

        set_line_food(@ordered_food)

        if @line_food.save
          render json: {
            line_food: @line_food
          }, status: :created
        else
          render json: {}, status: :internal_server_error
        end
      end


      private

      def set_food
        @ordered_food = Food.find(params[:food_id])
      end

      def set_line_food(ordered_food)
        # すでに同じfoodに関するline_foodが存在するか？
        if ordered_food.line_food.present?
          # 既存の情報を更新
          @line_food = ordered_food.line_food
          @line_food.attributes = {
            count: ordered_food.line_food.count + params[:count],
            active: true
          }
        else
          # インスタンスを新規作成
          @line_food = ordered_food.build_line_food(
            count: params[:count],
            restaurant: ordered_food.restaurant,
            active: true
          )
        end
      end
    end
  end
end
