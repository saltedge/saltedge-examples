require "sinatra"

set :port, 9292

def verify_signature(data, signature)
  public_key = OpenSSL::PKey::RSA.new(File.open("../public.pem"))
  public_key.verify(OpenSSL::Digest.new("SHA256"), Base64.decode64(signature), data)
rescue
  false
end

post "/api/callbacks/:type" do
  body = request.body.read
  type = params[:type]

  pp "Notification type [#{type}] received!"

  signature_body = "http://#{settings.bind}:#{settings.port}/api/callbacks/#{type}|#{body}"

  unless verify_signature(signature_body, request.env["HTTP_SIGNATURE"])
    puts "Signature verification failed!"

    halt 400
  end

  status 200
end