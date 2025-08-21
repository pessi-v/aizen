desc "Start Rails server bound to 0.0.0.0"
task :s do
  exec "rails server -b 0.0.0.0"
end
