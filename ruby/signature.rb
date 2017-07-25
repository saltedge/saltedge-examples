class Signature
  class << self
    def sign(private_key, data)
      Base64.encode64(private_key.sign(OpenSSL::Digest::SHA1.new, data)).delete("\n")
    end

    def verify(public_key, data, signature)
      public_key.verify(OpenSSL::Digest::SHA1.new, Base64.decode64(signature), data)
    end
  end
end
