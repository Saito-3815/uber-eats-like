class LineFood < ApplicationRecord
  belongs_to :food
  belongs_to :restaurant
  # 関連付け先が存在しなくてもいい
  belongs_to :order, optional: true

  validates :count, numericality: { greater_than: 0 }
  
  # 全てのLineFoodからwhereでactive: trueなもの一覧をActiveRecord_Relationのかたちで返す
  scope :active, -> { where(active: true) }
  scope :other_restaurant, -> (picked_restaurant_id) { where.not(restaurant_id: picked_restaurant_id) }

  def total_amount
    food.price * count
  end
end
