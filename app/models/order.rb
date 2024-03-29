class Order < ApplicationRecord
  has_many :line_foods

  validates :total_price, numericality: { greater_than: 0 }

  def save_with_update_line_foods!(line_foods)
    ActiveRecord::Base.transaction do
      line_foods.each do |line_food|
        # line_foodインスタンスのorder_idという属性を更新
        # order_id: self.id
        line_food.update!(active: false, order: self)
      end
      self.save!
    end
  end
end
