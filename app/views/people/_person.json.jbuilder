json.extract! person, :id, :name, :gender, :created_at, :updated_at
json.url person_url(person, format: :json)
