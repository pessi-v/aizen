class CreatePeople < ActiveRecord::Migration[8.0]
  def change
    create_table :people do |t|
      t.string :name
      t.string :gender
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
