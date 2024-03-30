class ApplicationController < ActionController::API
  before_action :fake_load

  # 意図的に時間を伸ばす処理
  def fake_load
    sleep(1)
  end
end
