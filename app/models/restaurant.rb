class Restaurant < ApplicationRecord
  has_many :foods
  has_many :line_foods, through: :foods

  validates :name, :fee, :time_required, presence: true
  validates :name, length: { maximum: 30 }
  # :fee、つまり手数料が0以上
  validates :fee, numericality: { greater_than: 0 }
end
